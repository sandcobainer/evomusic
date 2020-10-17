"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const async = require('async')
const child_process_1 = require('child_process')
const events_1 = require("events");
const evolver_1 = require("./evolveAPI/evolve");
const parse = require ("./evolveAPI/parser.js");
const _ =  require("lodash")
const {Range, Point} = require("atom")
const viz = require("./visuals/index")
console.log(viz)
let currentEvo = []

class FoxDot extends events_1.EventEmitter {
    constructor(logger) {
        super();
        this.logger = logger;
        this.evolver = new evolver_1.Evolution()
        this.env = { bpm:120, num_beats:4, beat_length:4, dur:2000}

        const pythonPath = atom.config.get('foxdot.pythonPath') || 'python';
        const samplesDirectory = atom.config.get('foxdot.samplesDirectory');

        let command = ['-u', '-m', 'FoxDot', '--pipe'];
        if (samplesDirectory !== '') {
            logger === null || logger === void 0 ? void 0 : logger.service(`Using samples from ${samplesDirectory}.`, false);
            command = command.concat(['-d', samplesDirectory]);
        }
        this.pythonProcess = child_process_1.spawn(pythonPath, command);
        this.pythonProcess.stdout.on('data', (data) => {
            logger === null || logger === void 0 ? void 0 : logger.stdout(data);
        });
        this.pythonProcess.stderr.on('data', (data) => {
            console.log(data.toString())
            logger === null || logger === void 0 ? void 0 : logger.stderr(data);
        });
        this.pythonProcess.on('close', (code) => {
            if (code) {
                logger === null || logger === void 0 ? void 0 : logger.service(`FoxDot has exited with code ${code}.`, true);
            }
            else {
                logger === null || logger === void 0 ? void 0 : logger.service('FoxDot has stopped.', false);
            }
            this.pythonProcess = undefined;
            this.emit('stop');
        });
        logger === null || logger === void 0 ? void 0 : logger.service('FoxDot has started.', false);
    }

    dispose() {
        var _a;
        (_a = this.pythonProcess) === null || _a === void 0 ? void 0 : _a.kill();
    }
    clearClock() {
        return this.evaluateCode('Clock.clear()');
    }

    evaluateBlocks(evolve=false) {
        const ranges = this.getRanges()
        return this.evaluateRanges(ranges, evolve);
    }

    getRanges() {
      const editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
          return;
      }
      const buffer = editor.getBuffer();
      const lines = buffer.getLines();
      const selectedRanges = editor.getSelectedBufferRanges();
      const ranges = selectedRanges.map((selectedRange) => {
          if (!selectedRange.isEmpty()) {
              return selectedRange;
          }
          const row = selectedRange.start.row;
          let rowBefore = row;
          while (rowBefore >= 0 && lines[rowBefore] !== '') {
              --rowBefore;
          }
          let rowAfter = row;
          while (rowAfter < lines.length && lines[rowAfter] !== '') {
              ++rowAfter;
          }
          const range = [
              [rowBefore + 1, 0],
              [rowAfter, 0],
          ];
          return buffer.clipRange(range);
      });
      return ranges;
    }
    evaluateCode(code) {
        var _a, result
        if (!this.pythonProcess) {
            return;
        }
        let lines =code.split('\n');
        lines.forEach((line, i) => {
          line = line.replace(/\s/g, '');
          if (line.length > 0) {
            if(line.startsWith('Clock')) {
              try {
                result = parse(line)
                "bpm" in result ? this.env['bpm'] = result['bpm'] : false
                "num_beats" in result ? this.env['num_beats'] = result['num_beats'] : false
                "beat_length" in result ? this.env['beat_length'] = result['beat_length'] : false
              }
              catch(e){
                return
              }

            }
          }
        });

        this.env.dur = (parseFloat(this.env['num_beats']) / this.env['beat_length']) * 4 * 60000.0 / this.env['bpm']

        const stdin = this.pythonProcess.stdin;
        stdin.write(code);
        stdin.write('\n\n');
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.stdin(code);
    }
    evaluateFile() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
            return;
        }
        const range = editor.getBuffer().getRange();
        return this.evaluateRange(range, evolve);
    }
    evaluateLines() {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
            return;
        }
        const buffer = editor.getBuffer();
        const positions = editor.getCursorBufferPositions();
        const ranges = positions.map((position) => {
            const row = position.row;
            return buffer.rangeForRow(row, true);
        });
        return this.evaluateRanges(ranges);
    }
    evaluateRange(range, evolve=false, text) {
        let editor = atom.workspace.getActiveTextEditor();
        if (text) {
            editor = text
        }
        const buffer = editor.getBuffer();
        const marker = editor.markBufferRange(range);
        editor.decorateMarker(marker, {
            class: 'foxdot-flash',
            type: 'highlight',
        });

        setTimeout(() => {
            marker.destroy();
        }, 300);

        const code = buffer.getTextInRange(range);
        if (evolve) {
          //TODO use threads instead
          this.logger.stdout ('Evolution started');
          async.parallel([
        		this.evolutionProcess.bind(null, code, editor, buffer, this)
      	  ], function(err, results) {
            		if (err) {
            			//oh shit
                  console.log('Error in evolutionProcess: ',err)
            		}
            });
        }
        else
          this.evaluateCode(code);
    }

    evolutionProcess(code, editor, buffer, obj)
    {
      let evolutions = obj.evolver.applyEvolutions(code), params = obj.evolver.getParams();
      if (!evolutions) return;

      let fName = 'evolve' + '_' + params.source + '_' + params.dest + '()',
        genCode = '\n\n' + '@nextBar' +
      '\n' + 'def ' + fName +':'+ '\n'
                    + '\t' + evolutions[0]
                    + fName + '\n'
                    + `# Evolving from ${params.source} to ${params.dest}`
      editor.insertText(genCode);

      let funcRange = _.cloneDeep(obj.getRanges()),
          codeRange = new Range(new Point(funcRange[0].start.row+2,0), new Point(funcRange[0].start.row+3,0)),
          progressRange;

      let editorId = editor.id, cloneEditor;
      atom.workspace.getTextEditors().forEach(t => {
        if (t.id == editor.id) {
            cloneEditor = t
          }
      });
      obj.evaluateRange(funcRange[0]);
      let i = 1;
      let interval =  setInterval(() => {
          let j = funcRange[0].start.row;
            obj.sendVis(i, 'status')
          // anchor ranges around j = end row (func name evolve_p1_p2)
          while (cloneEditor.buffer.getLines()[j] != fName){
            j++;
          }
          funcRange[0].end.row = j+1;
          progressRange = new Range(new Point(j+1, 0), new Point(j+1, 0))
          cloneEditor.buffer.setTextInRange(codeRange, '\t' + evolutions[i]);
          obj.evaluateRange(funcRange[0], false, cloneEditor);
          cloneEditor.buffer.setTextInRange(progressRange,'#')

          // stop after last evolution, clearClock, clear Interval
          if(i == evolutions.length - 1) {
            for (let k=0; k< currentEvo.length; k++) {
              if (currentEvo[k]['start'] == funcRange[0].start.row) {
                let clearId = currentEvo[k]['intervalObj']
                currentEvo.splice(k,1)
                cloneEditor.buffer.setTextInRange(progressRange,'#|')
                console.log(currentEvo)
                obj.clearClock()
                clearInterval(clearId)
                break;
              }
            }
          }
          i+=1
        }, obj.env.dur * params.options.lifetime)

      currentEvo.push({
        start: funcRange[0].start.row,
        intervalObj: interval
      })
    }

    sendVis(i, key) {
      viz(i, key)
    }

    evaluateRanges(ranges, evolve) {
        return ranges.forEach((range) => this.evaluateRange(range, evolve));
    }

    evolve() {
      this.evaluateBlocks(true)
    }
    stopevo() {
        console.log('Stopping evo at ',this.getRanges()[0].start.row)
        let lineId = this.getRanges()[0].start.row
        this.searchEvo(lineId, currentEvo, (i, result)=> {
          currentEvo.splice(i,1)
          this.clearClock()
          clearInterval(result)
        })

    }
    searchEvo(lineId, arr, cb) {
      for (let i=0; i < arr.length; i++) {
        if (arr[i]['start'] === lineId)
            return cb(i, arr[i]['intervalObj']);
      }
    }


}
exports.FoxDot = FoxDot;

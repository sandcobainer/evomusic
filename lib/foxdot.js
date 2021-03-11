"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const async = require('async')
const child_process_1 = require('child_process')
const events_1 = require("events");
const evolver_1 = require("./evolveAPI/evolve");
const parse = require ("./evolveAPI/parser.js");
const _ =  require("lodash")
const {Range, Point} = require("atom")
const {updateStatus} = require("./evolveAPI/vectorize.js")
const fs = require('fs')
const {csvAppend} = require("csv-append")
const { append, end } = csvAppend('/Users/a2012/.atom/packages/evomusic/data/events.csv');

// FoxDot constructor on initial toggle (taken from Koltes Digital package)
class FoxDot extends events_1.EventEmitter {
    constructor(logger) {
        super();
        this.logger = logger;
        this.evolver = new evolver_1.Evolution()
        this.env = { bpm:120, num_beats:4, beat_length:4, dur:2000}
        this.currentEvo = []

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
         let _a;
        (_a = this.pythonProcess) === null || _a === void 0 ? void 0 : _a.kill();
        end();
    }
    clearClock() {
      this.logEvent('clearClock', '')
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
        let _a, result
        if (!this.pythonProcess) {
            return;
        }
        let lines =code.split('\n');
        lines.forEach((line, i) => {
          line = line.replace(/\s/g, '');
          if (line.length > 0) {
            try {
            if(line.startsWith('Clock') && line!='Clock.clear()') {
                result = parse(line)
                "bpm" in result ? this.env['bpm'] = result['bpm'] : false
                "num_beats" in result ? this.env['num_beats'] = result['num_beats'] : false
                "beat_length" in result ? this.env['beat_length'] = result['beat_length'] : false
              }
            }
            catch(e){
              console.log(e)
              return
            }
          }
        });
        // calculate bar length in ms according to bpm, time signature
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
        const code = buffer.getTextInRange(range);
        editor.decorateMarker(marker, {
            class: 'foxdot-flash',
            type: 'highlight',
        });
        // marker flash on execution
        setTimeout(() => {
            marker.destroy();
        }, 300);

        if (evolve) {
          let output = this.evolver.applyEvolutions(code), params = this.evolver.getParams();
          let evolutions = output.code, funcRange = output.funcRange, undirected = (params.dest == undefined)
          if (!evolutions) return;

          if(undirected) {
            let input = {evolutions : evolutions, params:params, editor: editor, buffer:buffer, funcRange:funcRange}
            if(typeof funcRange !==  'undefined') {
              console.log(this.currentEvo)
              this.stopevo(funcRange.start)
            }
            this.logEvent('startNovelty', code)
            async.parallel([ this.undirectedScheduler.bind(null, input, this) ]
              ,function(err, results) {
                if (err)
                  console.log('Error in undirected scheduler: ',err)
              });
          }
          else {
            let input = {evolutions : evolutions, params:params, editor: editor, buffer:buffer }
            this.logEvent('startDirected', code)
            async.parallel([ this.directedScheduler.bind(null, input, this) ]
              ,function(err, results) {
                if (err)
                  console.log('Error in directed scheduler: ',err)
              });
          }

        }
        else {
          this.evaluateCode(code);
          this.logEvent('evaluateCode', code)
        }

    }

    // async thread for directed evolution (scheduler)
    directedScheduler(input, obj) {
      let evolutions =  input.evolutions, params = input.params,
                        editor = input.editor,  buffer=input.buffer
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
      // each evolution executes during the setInterval
      let i=1, interval =  setInterval(() => {
          let j = funcRange[0].start.row;
          // obj.sendVis(i)
          // anchor ranges around j = end row (func name evolve_p1_p2)
          while (cloneEditor.buffer.getLines()[j] != fName){
            j++;
          }
          funcRange[0].end.row = j+1;
          progressRange = new Range(new Point(j+1, 0), new Point(j+1, 0))
          cloneEditor.buffer.setTextInRange(codeRange, '\t' + evolutions[i]);
          obj.evaluateRange(funcRange[0], false, cloneEditor);
          cloneEditor.buffer.setTextInRange(progressRange,'#')

          // clearInterval after last evolution
          if(i == evolutions.length - 1) {
            for (let k=0; k< obj.currentEvo.length; k++) {
              if (obj.currentEvo[k]['start'] == funcRange[0].start.row) {
                let clearId = obj.currentEvo[k]['intervalObj']
                console.log('Exiting async thread after last evolution: ', obj.currentEvo)
                obj.currentEvo.splice(k,1)
                cloneEditor.buffer.setTextInRange(progressRange,'#|')
                obj.clearClock()
                clearInterval(clearId)
                break;
              }
            }
          }
          i+=1
        }, obj.env.dur * params.options.lifetime)

      obj.currentEvo.push({
        start: funcRange[0].start.row,
        intervalObj: interval,
        evoId:  params.source
      })
    }

    undirectedScheduler(input, obj) {
      let evolutions =  input.evolutions, params = input.params,
                        editor = input.editor,  buffer=input.buffer,
                        funcRange = input.funcRange
                        ,codeRange ,progressRange,
                        fName, genCode
      let editorId = editor.id, cloneEditor, startRow, endRow;
      atom.workspace.getTextEditors().forEach(t => {
        if (t.id == editor.id) {
            cloneEditor = t
          }
      });
      if (funcRange.start == undefined) {
        fName = 'evolve' + '_' + params.source + '()'
        genCode = '\n\n' + '@nextBar' +
                      '\n' + 'def ' + fName +':'+ '\n'
                          + '\t' + evolutions[0]
                          + fName + '\n'
                          + `# Evolving from ${params.source}`
        editor.insertText(genCode)
        startRow = _.cloneDeep(obj.getRanges()[0].start.row)
        endRow = startRow + 4
        funcRange = new Range(new Point(startRow,0), new Point(endRow,0))
        codeRange = new Range(new Point(startRow+2,0), new Point(startRow+3,0))
        obj.send({'funcRange':{'start':startRow, 'end':endRow}}, params.source)
        console.log('new novelty search spawned: ', funcRange, obj.currentEvo)
      }
      else {
        startRow = funcRange.start
        endRow = funcRange.end
        console.log('continue new generation of novelty search',funcRange, obj.currentEvo)
        codeRange = new Range(new Point(startRow+2,0), new Point(startRow+3,0))
        cloneEditor.buffer.setTextInRange(codeRange, '\t' + evolutions[0])
        funcRange = new Range(new Point(startRow,0), new Point(endRow,0))
      }

      obj.evaluateRange(funcRange);
      // each evolution executes during the setInterval
      let i = 1, interval =  setInterval(() => {
        let j = startRow;
        // anchor ranges around j = end row (func name evolve_p1_p2)
        while (cloneEditor.buffer.getLines()[j] != fName) {
          j++;
        }
        funcRange.end.row = j+1;
        progressRange = new Range(new Point(j+1, 0), new Point(j+1, 0))
        cloneEditor.buffer.setTextInRange(codeRange, '\t' + evolutions[i]);
        obj.evaluateRange(funcRange, false, cloneEditor);
        cloneEditor.buffer.setTextInRange(progressRange,'#')
        obj.send({'evolution':i}, params.source)
        // loop back to 0th evolution
        if(i == evolutions.length-1) {
          i=0
        }
        i+=1
      }, obj.env.dur * params.options.lifetime)

      obj.currentEvo.push({
        start: funcRange.start.row,
        intervalObj: interval,
        evoId:  params.source
      })
    }

    send(msg, src) {
      updateStatus(msg, src)
    }

    evaluateRanges(ranges, evolve) {
        return ranges.forEach((range) => this.evaluateRange(range, evolve));
    }

    evolve() {
      this.evaluateBlocks(true)
    }

    fitnessUp() {
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
      const marker = editor.markBufferRange(ranges[0]);
      const code = buffer.getTextInRange(ranges[0]);
      editor.decorateMarker(marker, {
          class: 'foxdot-flash',
          type: 'highlight',
      });
      setTimeout(() => {
          marker.destroy();
      }, 300);
      let parsedResult =  parse(code.replace(/\s/g, ''));
      this.send({'positiveFitness':2}, parsedResult.pname)
      this.logEvent('positiveFitness', '')
    }

    fitnessDown() {
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
      const marker = editor.markBufferRange(ranges[0]);
      const code = buffer.getTextInRange(ranges[0]);
      editor.decorateMarker(marker, {
          class: 'foxdot-flash',
          type: 'highlight',
      });
      setTimeout(() => {
          marker.destroy();
      }, 300);
      let parsedResult =  parse(code.replace(/\s/g, ''));
      this.send({'negativeFitness': 2}, parsedResult.pname)
      this.logEvent('negativeFitness', '')
    }

    // Cmd+Z triggers this function
    stopevo(line) {
        let lineId, undirected=false;
        if (typeof line === 'undefined')
          lineId = this.getRanges()[0].start.row
        else {
          lineId = line
          undirected = true
        }
        this.searchEvo(lineId, this.currentEvo, (i, result)=> {
          console.log('Stopping evo at line: ',lineId)
          console.log(this.currentEvo[i], result)
          if(!undirected) this.send( {'terminateEvo' :this.currentEvo[i].evoId})
          // this.clearClock()
          clearInterval(result)
          this.logEvent('stopEvolution', '')
          // this.evaluateCode(this.currentEvo[i].evoId + '.stop()')
          this.currentEvo.splice(i,1)
        })
    }
    searchEvo(lineId, arr, cb) {
      for (let i=0; i < arr.length; i++) {
        if (arr[i]['start'] === lineId)
            return cb(i, arr[i]['intervalObj']);
      }
    }

    logEvent(event, code) {
      let time = new Date()
      append({ 'event': event, 'code': code, 'tstamp':time.getTime(), 'time': time});
    }
}
exports.FoxDot = FoxDot;

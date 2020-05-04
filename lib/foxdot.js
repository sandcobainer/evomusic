"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const async = require('async')
const child_process_1 = require('child_process')
const events_1 = require("events");
const evolver_1 = require("./evolve.js");
const _ =  require("lodash")

process.on('message', function(msg) {
  console.log(msg);
  process.send('Received msg')
});

class FoxDot extends events_1.EventEmitter {
    constructor(logger) {
        super();
        this.logger = logger;
        this.evolver = new evolver_1.Evolution()

        const pythonPath = atom.config.get('foxdot.pythonPath') || 'python';
        const samplesDirectory = atom.config.get('foxdot.samplesDirectory');

        let command = ['-m', 'FoxDot', '--pipe'];
        if (samplesDirectory !== '') {
            logger === null || logger === void 0 ? void 0 : logger.service(`Using samples from ${samplesDirectory}.`, false);
            command = command.concat(['-d', samplesDirectory]);
        }
        this.pythonProcess = child_process_1.spawn(pythonPath, command);
        this.pythonProcess.stdout.on('data', (data) => {
            logger === null || logger === void 0 ? void 0 : logger.stdout(data);
        });
        this.pythonProcess.stderr.on('data', (data) => {
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
        var _a;
        if (!this.pythonProcess) {
            return;
        }

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
    evaluateRange(range, evolve) {
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
            return;
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
                  console.log(err)
            		}
                console.log(results)
            });
        }
        else
          this.evaluateCode(code);
    }

    evolutionProcess(code, editor, buffer, obj, callback)
    {
      let result = obj.evolver.applyEvolutions(code);
      let evolutions = result.code;
      let barLengths = result.bars;
      let env = obj.evolver.getEnv();

      let i = 1;
      let fName = 'evolve' + '_' + env.params.source + '_' + env.params.dest + '()'
      let genCode = '\n\n' + '@nextBar' +
      '\n' + 'def ' + fName +':'+ '\n'
                    + evolutions[0]
                    + fName

      editor.insertText(genCode);

      let codeRange = _.cloneDeep(obj.getRanges());
      let funcRange = _.cloneDeep(codeRange);

      let lines = buffer.getLines();
      let textEnd = lines[funcRange[0].end.row]

      codeRange[0].start.row +=2
      codeRange[0].end.row -=1

      obj.evaluateRange(funcRange[0]);
      let intervalObj = setInterval(() => {
          if(i == evolutions.length - 1)
            clearInterval(intervalObj)
          let j = funcRange[0].start.row;
          while (buffer.getLines()[j] != fName)
            j++;

          funcRange[0].end.row = j+1;
          buffer.setTextInRange(codeRange[0], evolutions[i]);
          obj.evaluateRange(funcRange[0], false);
          i+=1;
        }, env.params.options.lifetime);

      callback('null', 'Evolution in progress')
    }

    evaluateRanges(ranges, evolve) {
        return ranges.forEach((range) => this.evaluateRange(range, evolve));
    }

    evolve() {
      this.evaluateBlocks(true)
    }
    generateCode(code) {
      let func = '\n\n' + '@nextBar' + '\n' + 'def autoEvolution():' + '\n'
      + code
      + 'autoEvolution()'
      return func
    }


}
exports.FoxDot = FoxDot;

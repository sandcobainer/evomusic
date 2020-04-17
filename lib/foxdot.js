"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const events_1 = require("events");
const evolver_1 = require("./evolve.js");

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
        this.childProcess = child_process_1.spawn(pythonPath, command);
        this.childProcess.stdout.on('data', (data) => {
            logger === null || logger === void 0 ? void 0 : logger.stdout(data);
        });
        this.childProcess.stderr.on('data', (data) => {
            logger === null || logger === void 0 ? void 0 : logger.stderr(data);
        });
        this.childProcess.on('close', (code) => {
            if (code) {
                logger === null || logger === void 0 ? void 0 : logger.service(`FoxDot has exited with code ${code}.`, true);
            }
            else {
                logger === null || logger === void 0 ? void 0 : logger.service('FoxDot has stopped.', false);
            }
            this.childProcess = undefined;
            this.emit('stop');
        });
        logger === null || logger === void 0 ? void 0 : logger.service('FoxDot has started.', false);
    }

    dispose() {
        var _a;
        (_a = this.childProcess) === null || _a === void 0 ? void 0 : _a.kill();
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
        if (!this.childProcess) {
            return;
        }

        const stdin = this.childProcess.stdin;
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
          console.log('evolving')
          let evolutions = this.evolver.applyEvolutions(code);
          let i = 1;
          let env = this.evolver.getEnv();
          let timeoutLength = (60000/env.bpm) * env.fparams.options.updateFreq

          let genCode = '\n\n' + '@nextBar' + '\n' + 'def autoEvolution():' + '\n'
          + evolutions[0]
          + 'autoEvolution()'
          editor.insertText(genCode);

          let range = this.getRanges()
          range[0].start.row +=2
          range[0].end.row -= 1

          this.evaluateCode(genCode);

          var intervalObj = setInterval(() => {
            if( i == evolutions.length - 1)
              clearInterval(intervalObj)

            console.log(i, range[0], evolutions[i])
            buffer.setTextInRange(range[0], evolutions[i])
            this.evaluateRange(range[0], false);

            i += 1
            console.log(timeoutLength)
          },timeoutLength)
        }
        else
        {
        this.evaluateCode(code);
        }
    }

    evaluateRanges(ranges, evolve) {
        return ranges.forEach((range) => this.evaluateRange(range, evolve));
    }
    evolve() {
      let evolve = true;
      this.evaluateBlocks(evolve);
    }
    generateCode(code) {
      let func = '\n\n' + '@nextBar' + '\n' + 'def autoEvolution():' + '\n'
      + code
      + 'autoEvolution()'
      return func
    }


}
exports.FoxDot = FoxDot;

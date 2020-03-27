"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const events_1 = require("events");

const moo = require('moo')
const nearley = require("nearley");
const grammar = require("./grammar.js");
const Rand = require('total-serialism').Stochastic;


class FoxDot extends events_1.EventEmitter {
    constructor(logger) {
        super();
        this.logger = logger;
        this.evolutions = [];
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
        return this.evaluateRanges(ranges, evolve);
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
          let evolution = this.applyEvolution(code);
          editor.insertText(evolution);
        }
        else {
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
    applyEvolution(code) {
        // code = '# evolved it: \np1 >> pluck([3,4,7])'
        let results = {};
        let genome = {};

        console.log(code);
        let lines =code.split('\n');

        lines.forEach((line, i) => {
          line = line.trim();
          if (line.length > 0) {
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar),
                          { keepHistory: true }
                          );
            results[i] = parser.feed(line).results;
            this.analyzeCode(results[i], genome);
          }
          // this.evolutions.push(genome);
          this.applyMutation(genome);
        });
        return code;
    }

    analyzeCode(result,genome) {
      // take 1st amb grammar result only
      result = result[0][0];
      if (result[1] == ">>") {
        let pname =  result[0]
        genome[pname] =  {
                              'ptype' : result[2],
                              'notes' : result[4],
                         }
      }
      else if (result[1] == ".") {
        let pname = result[0]
        let pattribute = result[2]
        genome[pname][pattribute] = result[4];
      }
    }

    applyMutation(genome) {
      console.log(genome)
      const players = Object.keys(genome)
      for (let p in players) {

        player = players[p]
        const attributes = Object.keys(player)
        console.log(player)
        for (let a in attributes) {
          console.log(player[a])
        }
        // if(Array.isArray(attributes))
          // Rand.shuffle(attributes)
      }
    }

}
exports.FoxDot = FoxDot;

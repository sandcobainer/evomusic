// Main index file : Starts up plugin on Atom start up

"use strict";
let __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const child_process_1 = require("child_process");
const autocomplete_1 = __importDefault(require("./autocomplete"));
const foxdot_1 = require("./foxdot");
const logging_1 = require("./logging");
let foxDot, logger, subscriptions;
const { shell } = require('electron')
const {killWS} = require('./visuals/server')

// start or stop package on toggle
function start() {
    autocomplete_1.default.enabled = true;
    if (atom.config.get('foxdot.logging.enabled')) {
        logger = new logging_1.LoggerInWorkspace();
    }
    foxDot = new foxdot_1.FoxDot(logger);
    foxDot.on('stop', () => {
        logger === null || logger === void 0 ? void 0 : logger.setTerminated();
        foxDot = undefined;
        logger = undefined;
    });
}

function stop() {
    foxDot === null || foxDot === void 0 ? void 0 : foxDot.dispose();
    autocomplete_1.default.enabled = false;
}

exports.config = {
    logging: {
        properties: {
            enabled: {
                default: true,
                description: 'Takes effect at the next plugin startup.',
                type: 'boolean',
            },
            logServiceMessages: {
                default: true,
                type: 'boolean',
            },
            logStderr: {
                default: true,
                type: 'boolean',
            },
            logStdin: {
                default: true,
                type: 'boolean',
            },
            logStdout: {
                default: true,
                type: 'boolean',
            },
        },
        type: 'object',
    },
    pythonPath: {
        default: '',
        description: 'Leave empty to use python from the PATH environment variable.',
        type: 'string',
    },
    samplesDirectory: {
        default: '',
        description: 'Use an alternate directory for looking up samples.',
        type: 'string',
    },
};
function consumeAutoreload (reloader) {
  return reloader({
        pkg: "evomusic",
        files: ["package.json"],
        folders: ["lib/"]
      });
}
// pkg has to be the name of your package and is required
// files are watched and your package reloaded on changes, defaults to ["package.json"]
// folders are watched and your package reloaded on changes, defaults to ["lib/"]
function activate() {
  subscriptions = new atom_1.CompositeDisposable(atom.workspace.addOpener((uri) => {
      if (uri === logging_1.LOGGER_IN_WORKSPACE_URI) {
          return new logging_1.LoggerInWorkspace();
      }
      return undefined;
  }), atom.commands.add('atom-workspace', {
      'foxdot:clear-clock': (event) => {
          if (!foxDot) {
              return event.abortKeyBinding();
          }
          else {
              foxDot.clearClock();
          }
      },
      'foxdot:evaluate-blocks': (event) => {
          if (!foxDot) {
              return event.abortKeyBinding();
          }
          else {
              foxDot.evaluateBlocks();
          }
      },
      'foxdot:evaluate-file': (event) => {
          if (!foxDot) {
              return event.abortKeyBinding();
          }
          else {
              foxDot.evaluateFile();
          }
      },
      'foxdot:evaluate-lines': (event) => {
          if (!foxDot) {
              return event.abortKeyBinding();
          }
          else {
              foxDot.evaluateLines();
          }
      },
      'foxdot:toggle': () => {
          if (!foxDot) {
              start();
          }
          else {
              stop();
          }
      },
      'evo:evolve': (event) => {
          if (!foxDot) {
              start();
          }
          else {
              foxDot.evolve()
          }
      },
      'evo:stopevo': (event) => {
        if (!foxDot) {
            start();
        }
        else {
            foxDot.stopevo()
        }
      },
      'evo:fitness-up': (event) => {
        if (!foxDot) {
            start();
        }
        else {
            foxDot.fitnessUp()
        }
      },
      'evo:fitness-down': (event) => {
        if (!foxDot) {
            start();
        }
        else {
            foxDot.fitnessDown()
        }
      }
}))}


exports.activate = activate;
function deactivate() {
  stop();
  subscriptions.dispose();
  killWS();
}
exports.deactivate = deactivate;
function provideAutocomplete() {
    return autocomplete_1.default;
}
exports.provideAutocomplete = provideAutocomplete;
function serialize() {
    return {};
}
exports.serialize = serialize;

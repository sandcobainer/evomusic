const Rand = require('total-serialism').Stochastic;
const parse = require ("./parser");
const ga_1 = require("./ga");
// const OSC = require('osc-js');
// let osc = new OSC();
// osc.open();

const paramTypes = {
  degree : 'int', oct : 'int', bpm : 'int', sample : 'int', bits: 'int',
  dur: 'int', amp : 'float', delay : 'float', sus : 'float', blur:'float', pan : 'float',
  fmod : 'float', vib : 'float', vibdepth: 'float', slide : 'float', slidedelay:'float',
  slideform: 'float',  bend: 'float', benddelay: 'float', chop : 'float', coarse:'float',
  hpf: 'float', hpr: 'float', lpf :'float', lpr:'float', crush : 'float', dist:'float',
  shape:'float', drive : 'float', room : 'float', echo : 'float', echotime:'float',
   spin :'float',
  cut : 'float', tremolo:'float', pshift:'float', glide:'float', glidedelay: 'float',
  scale : 'string', root : 'string'
}

const instruments = ['loop', 'stretch', 'play1', 'play2', 'audioin', 'noise', 'dab', 'varsaw', 'lazer', 'growl', 'bass', 'dirt', 'crunch', 'rave', 'scatter', 'charm', 'bell', 'gong', 'soprano', 'dub', 'viola', 'scratch', 'klank', 'feel', 'glass', 'soft', 'quin', 'pluck', 'spark', 'blip', 'ripple', 'creep', 'orient', 'zap', 'marimba', 'fuzz', 'bug', 'pulse', 'saw', 'snick', 'twang', 'karp', 'arpy', 'nylon', 'donk', 'squish', 'swell', 'razz', 'sitar', 'star', 'jbass', 'sawbass', 'prophet', 'pads', 'pasha', 'ambi', 'space', 'keys', 'dbass', 'sinepad'];
const attributes =  {'degree':[0,32,'int'], 'oct':[0,14,'int'], 'freq', 'dur':[0,200,'float'], 'delay', 'buf', 'blur', 'amplify':[0,1,'float'], 'scale':[0,0,'string'], 'bpm':[0,300,'int'], 'sample', 'env', 'sus', 'fmod', 'pan', 'rate', 'amp', 'midinote', 'channel', 'vib', 'vibdepth', 'slide', 'sus', 'slidedelay', 'slidefrom', 'glide', 'glidedelay', 'bend', 'benddelay', 'coarse', 'striate', 'buf', 'rate', 'pshift', 'hpf', 'hpr', 'lpf', 'lpr', 'swell', 'bpf', 'bpr', 'bpnoise', 'chop', 'tremolo', 'beat_dur', 'echo', 'echotime', 'spin', 'cut', 'room', 'mix', 'formant', 'shape', 'drive'}


class Evolution {
    constructor() {
      this.srcPlayer = {}
      this.destPlayer = {}
      this.currGen = {}
      this.latestResult = {}
      this.options = {}
      this.evolver = ''
      this.env = { root:'C', scale:'major', bpm:120,params:''}
    }
    getEnv() {
      return this.env;
    }

    applyEvolutions(code) {
        let lines =code.split('\n');
        let players = []

        lines.forEach((line, i) => {
          line = line.replace(/\s/g, '');
          if (line.length > 0) {
          let result = parse(line)
          if(result.hasOwnProperty('pname'))
              players.push(result)
          if(result.hasOwnProperty('fparams'))
              this.env.params = result;
          if(result.hasOwnProperty('root'))
              this.env['root'] = result['root']
          if(result.hasOwnProperty('scale'))
              this.env['scale'] = result['scale']
          if(result.hasOwnProperty('bpm'))
              this.env['bpm'] = result['bpm']
          }
        });

        this.srcPlayer = players.filter( (p) => p.pname == this.env.params.source)
        this.destPlayer = players.filter( (p) => p.pname == this.env.params.dest)

        this.start = this.convertToObj(this.srcPlayer[0].attributes)
        this.end = this.convertToObj(this.destPlayer[0].attributes)
        this.evolver = new ga_1.GA(this.start, this.end, this.env.params.options)

        return this.getEvolutions(this.env.params.options)
    }

    // sendP5(result) {
    //   let message = new OSC.Message('/test', JSON.stringify(result));
    //   osc.send(message);s
    //   console.log('sent :',message)
    // }

    calculateMeasure(player) {
        console.log(player);
    }

    convertToObj(options) {
        let obj = {}
        options.forEach((o) => {
            let k = Object.keys(o)[0]
            obj[k] = o[k]
        });
        return obj
    }

    getEvolutions(options) {
        let results=[], codeGens = [], barLengths = [], stepSize,interpolation = options.interpolate, j= 0;
        for(let i = 0; i < options.evolutions ; i++) {
            let e = this.evolver.ga.evolve()
            if (i % options.skipGenerations == 0)
            {
              let result = e.best()
              results.push(result)
              let barLength;
              if (interpolation != 'none')
                barLength = this.getBarLength(result)

              let gen = '\t' + this.srcPlayer[0].pname + '>>' + this.srcPlayer[0].type + '('
              let params = Object.keys(result)
              params.forEach((r,k) => {
                  if (paramTypes[r] == 'float' && result[r].length == 1 && interpolation != 'none' && j>0){
                    stepSize = options.stepSize;

                    gen = gen + r  + '=' +interpolation + '([' + results[j-1][r][0] + ',' + result[r][0] +']' + ',' + barLength + ')'
                  }
                  else if (paramTypes[r] === undefined)
                      return;
                  else
                      gen = gen + r  + '=' + '[' + result[r] +']'

                  if (k < params.length-1)
                    gen = gen + ',';
              });
              gen = gen + ')' + '\n'
              codeGens.push(gen)
              barLengths.push(barLength)
              j++;
            }
        }

        return { code: codeGens, bars: barLengths }
    }

    getBarLength(result) {
      let barLength = 0;
      if(result.dur == undefined)
        return 1;
      else if (result.dur.length == 1 && result.degree != undefined)
        return result.degree.length * result.dur[0]
      else if (result.degree == undefined)
      {
        result.dur.forEach((d)=> {
          barLength = barLength + d;
        })
      }


      return barLength;
    }
}

exports.Evolution = Evolution;
exports.instruments = instruments;
exports.attributes = attributes;

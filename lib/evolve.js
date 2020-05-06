const Rand = require('total-serialism').Stochastic;
const parse = require ("./parser");
const ga = require("./ga");
console.log(ga)
// const OSC = require('osc-js');
// let osc = new OSC();
// osc.open();

const instruments = ['loop', 'stretch', 'play1', 'play2', 'audioin', 'noise', 'dab', 'varsaw', 'lazer', 'growl', 'bass', 'dirt', 'crunch', 'rave', 'scatter', 'charm', 'bell', 'gong', 'soprano', 'dub', 'viola', 'scratch', 'klank', 'feel', 'glass', 'soft', 'quin', 'pluck', 'spark', 'blip', 'ripple', 'creep', 'orient', 'zap', 'marimba', 'fuzz', 'bug', 'pulse', 'saw', 'snick', 'twang', 'karp', 'arpy', 'nylon', 'donk', 'squish', 'swell', 'razz', 'sitar', 'star', 'jbass', 'sawbass', 'prophet', 'pads', 'pasha', 'ambi', 'space', 'keys', 'dbass', 'sinepad'];
let attributes =  {'degree':[0,12,'int'], 'oct':[0,8,'int'], 'dur':[0,200,'float'], 'delay': [0,10,'float'], 'blur':[0,60,'float'], 'amplify':[0,10,'float'], 'scale':[0,0,'string'], 'bpm':[0,300,'int'],
'sample':[0,16,'int'], 'sus':[0,60,'float'], 'fmod':[0,100,'float'], 'pan':[-1,1,'float'],  'amp':[0,1,'float'], 'midinote':[0,127,'int'], 'vib':[0,20,'float'], 'vibdepth':[0, 0.1, 'float'], 'slide':[-2,2,'float'],
'sus':[0,60,'float'], 'slidedelay':[0,1,'float'], 'slidefrom':[-2,2,'float'], 'glide':[-24,24,'int'], 'glidedelay':[0,1,'float'], 'bend':[-2,2,'float'], 'benddelay':[-2,2,'float'], 'coarse':[0,64,'int'],
'pshift':[-24,24,'int'], 'hpf':[0,16000,'float'], 'hpr':[0,1,'float'], 'lpf':[0,16000,'float'], 'lpr':[0,1,'float'],'bpf':[0,16000,'float'], 'bpr':[0,1,'float'], 'bpnoise':[0,20000, 'float'], 'chop':[0,64,'int'], 'striate':[0,500,'int'],
'tremolo':[0,128,'int'], 'echo':[0,200,'float'], 'echotime':[0,8,'int'], 'spin':[[0,32,'int']], 'cut':[0,60,'float'], 'room':[0,1,'float'], 'mix':[0,1,'float'], 'formant':[1,7,'float'], 'shape':[0,1,'float'], 'drive':[0,1,'float']}
// TODO : 'freq', , 'buf', 'env','rate', 'channel','striate','rate', 'swell','beat_dur',


class Evolution {
    constructor() {
      this.srcPlayer = {}
      this.destPlayer = {}
      this.currGen = {}
      this.latestResult = {}
      this.options = {}
      this.evolver;
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
        this.evolver_1 = new ga.GA(this.start, this.end, this.env.params.options)

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
        let results=[], codeGens = [], barLengths = [], interpolation = options.interpolate, j= 0;
        for(let i = 0; i < options.evolutions ; i++) {
            let e = this.evolver_1.ga.evolve()
            if (i % options.skipGenerations == 0)
            {
              let result = e.best()
              results.push(result)

              let barLength;
              if (interpolation != 'none')
                barLength = this.getBarLength(result)

              let gen = '\t' + this.srcPlayer[0].pname + '>>' + this.srcPlayer[0].type + '('
              let params =   Object.keys(result)
              params.forEach((r,k) => {
                  if (attributes[r][2] == 'float' && result[r].length == 1 && interpolation != 'none' && j>0) {
                    for (var i in result[r])
                         result[r][i] = Math.round(result[r][i] / options.stepSize) * options.stepSize
                    gen = gen + r  + '=' +interpolation + '([' + results[j-1][r][0] + ',' + result[r][0] +']' + ',' + barLength + ')'
                  }
                  else if (attributes[r][2]=='int') {
                    for (var i in result[r])
                         result[r][i] = Math.round(result[r][i])
                    gen = gen + r  + '=' + '[' + result[r] +']'
                  }
                  else {
                    gen = gen + r  + '=' + '[' + result[r] +']'
                  }

                  if (k < params.length-1)
                    gen = gen + ',';
              });
              gen = gen + ')' + '\n'
              codeGens.push(gen)
              barLengths.push(barLength)
              j++;
            }
        }
        console.log(results, codeGens)
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

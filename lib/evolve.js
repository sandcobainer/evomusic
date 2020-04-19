const Rand = require('total-serialism').Stochastic;
const parse = require ("./parser");
const ga_1 = require("./ga");
// const OSC = require('osc-js');
// let osc = new OSC();
// osc.open();

const paramTypes = {
  degree : 'int', oct : 'int', bpm : 'int', sample : 'int', bits: 'int',
  dur: 'float', amp : 'float', delay : 'float', sus : 'float', blur:'float', pan : 'float',
  fmod : 'float', vib : 'float', vibdepth: 'float', slide : 'float', slidedelay:'float',
  slideform: 'float',  bend: 'float', benddelay: 'float', chop : 'float', coarse:'float',
  hpf: 'float', hpr: 'float', lpf :'float', lpr:'float', crush : 'float', dist:'float',
  shape:'float', drive : 'float', room : 'float', echo : 'float', echotime:'float',
   spin :'float',
  cut : 'float', tremolo:'float', pshift:'float', glide:'float', glidedelay: 'float',
  scale : 'string', root : 'string'
}
class Evolution {
    constructor() {
      this.srcPlayer = {}
      this.destPlayer = {}
      this.currGen = {}
      this.latestResult = {}
      this.options = {}
      this.evolver = ''
      this.env = { root:'C', scale:'major', bpm:120,
                   fparams : {
                        stepSize : 1,
                        updateFreq : 1,
                        skipGenerations: 300,
                        evolutions:3000,
                        mutationAmount : 0.25,
                        crossoverAmount: 0.7
                   }
                }
    }

    getEnv() {
      console.log(this.env)
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
              this.env['fparams'] = result
          if(result.hasOwnProperty('root'))
              this.env['root'] = result['root']
          if(result.hasOwnProperty('scale'))
              this.env['scale'] = result['scale']
          if(result.hasOwnProperty('bpm'))
              this.env['bpm'] = result['bpm']
          }
        });

        this.srcPlayer = players.filter( (p) => p.pname == this.env.fparams.source)
        this.destPlayer = players.filter( (p) => p.pname == this.env.fparams.dest)
        this.start = this.convertToObj(this.srcPlayer[0].attributes)
        this.end = this.convertToObj(this.destPlayer[0].attributes)
        this.env.fparams.options = this.convertToObj(this.env.fparams.options)

        this.evolver = new ga_1.GA(this.start, this.end, this.env.fparams.options)
        return this.evolve(this.env.fparams.options)
    }

    // sendP5(result) {
    //   let message = new OSC.Message('/test', JSON.stringify(result));
    //   osc.send(message);s
    //   console.log('sent :',message)
    // }

    convertToObj(options) {
        let obj = {}
        options.forEach((o) => {
            let k = Object.keys(o)[0]
            obj[k] = o[k]
        });
        return obj
    }

    evolve(options) {
        let results=[], stepSize ;
        for( let i = 0; i < options.evolutions ; i++ ) {
            let e = this.evolver.ga.evolve()
            if (i % options.skipGenerations == 0)
            {
                let result = e.best()
                Object.keys(result).forEach((r) => {
                    if (paramTypes[r] == 'int')
                        stepSize = 1;
                    else if (paramTypes[r] == 'float')
                        stepSize = options.stepSize;
                    else if (paramTypes[r] === undefined)
                        return;

                    for (var i in result[r]) {
                        result[r][i] = Math.round(result[r][i] / stepSize) * stepSize
                    }
                })
                let code = this.formatEvolutions(result)
                results.push(code)
            }
        }
        return results
    }

    formatEvolutions(result) {
      let params = Object.keys(result)
      let gen = '\t' + this.srcPlayer[0].pname + '>>' + this.srcPlayer[0].type + '('
      params.forEach((r,i) => {
        gen = gen + r  + '=' + '[' + result[r] +']'
        if (i < params.length-1)
          gen = gen + ','
      })
      gen = gen + ')' + '\n'
      return gen
    }
}
exports.Evolution = Evolution;

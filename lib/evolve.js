const parse = require ("./parser");
const ga = require("./ga");
const {instruments, attributes} = require('./params.js');

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
        console.log(options.interpolate)
        for(let i = 0; i < options.evolutions ; i++) {
            let e = this.evolver_1.ga.evolve()
            if (i % options.skipGenerations == 0)
            {
              let result = e.best()
              results.push(result)

              let barLength=1;

              let gen = '\t' + this.srcPlayer[0].pname + '>>' + this.srcPlayer[0].type + '('
              let params =   Object.keys(result)
              params.forEach((r,k) => {
                  if (attributes[r][2] == 'float' && interpolation != 'none' ) {
                    console.log(attributes[r][2], interpolation, r)
                    for (var i in result[r]) {
                      console.log(result[r])
                      result[r][i] = Math.round(result[r][i] / options.stepSize) * options.stepSize
                    }
                    console.log(result[r])
                    if(interpolation!= 'none' && j>0)
                      gen = gen + r  + '=' + interpolation + '([' + results[j-1][r][0] + ',' + result[r][0] +']' + ',' + barLength + ')'
                    else
                      gen = gen + r  + '=' + '[' + result[r] +']'

                  }
                  else if (attributes[r][2]=='int') {
                    console.log('int')
                    for (var i in result[r]){
                      result[r][i] = Math.round(result[r][i])
                    }
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
        return { code: codeGens, bars: barLengths }
    }

    getBarLength(result) {
      return 1
    }
}

exports.Evolution = Evolution;
exports.instruments = instruments;
exports.attributes = attributes;

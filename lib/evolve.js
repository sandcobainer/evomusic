const Rand = require('total-serialism').Stochastic;
const parse = require ("./parser")
const ga_1 = require("./ga")
// const OSC = require('osc-js');
// let osc = new OSC();
// osc.open();

class Evolution {
    constructor() {
      this.srcPlayer = {}
      this.destPlayer = {}
      this.currGen = {}
      this.latestResult = {}
      this.options = {}
      this.evolver = ''
    }
    applyEvolutions(code) {
        let lines =code.split('\n');
        let players = []
        let func = {}

        lines.forEach((line, i) => {
            line = line.replace(/\s/g, '');
            if (line.length > 0) {
            let parsed_line = parse(line)
            if(parsed_line.hasOwnProperty('pname'))
                players.push(parsed_line)
            if(parsed_line.hasOwnProperty('function'))
                func = parsed_line
            }
        });

        this.srcPlayer = players.filter( (p) => p.pname == func.source)
        this.destPlayer = players.filter( (p) => p.pname == func.dest)
        this.start = this.cleanPattributes(this.srcPlayer)
        this.end = this.cleanPattributes(this.destPlayer)
        this.options = this.cleanEvolverParams(func.options)
        this.evolver = new ga_1.GA(this.start, this.end, this.options)
        return this.evolve(this.options)
    }

    // sendP5(result) {
    //   let message = new OSC.Message('/test', JSON.stringify(result));
    //   osc.send(message);
    //   console.log('sent :',message)
    // }

    cleanPattributes(player_attributes) {
        let pattributes = player_attributes[0].attributes
        let pats = {}
        pattributes.forEach((pat) => {
            let k = Object.keys(pat)[0]
            pats[k] = pat[k]
        });
        return pats
    }

    cleanEvolverParams(options) {
        let evo = {}
        options.forEach((o) => {
            let k = Object.keys(o)[0]
            evo[k] = o[k]
        });
        return evo
    }

    evolve(options) {
        let results=[]
        for( let i = 0; i < options.evolutions ; i++ ) {
            let e = this.evolver.ga.evolve()
            if (i % options.updateFreq == 0)
            {
                let result = e.best()
                Object.keys(result).forEach((r) => {
                    for (var i in result[r]) {
                        result[r][i] = Math.round(result[r][i] / options.stepSize) * options.stepSize
                    }
                })
                let code = this.formatEvolutions(result)
                results.push(code)
            }
        }
        return results
    }

    formatEvolutions(result) {
      let gen = ''
      gen = gen + '\t' + this.srcPlayer[0].pname + '>>' + this.srcPlayer[0].type + '()' + '\n'
      Object.keys(result).forEach((r) => {
        gen = gen + '\t' + this.srcPlayer[0].pname + '.' + r  + '=' + '[' + result[r] +']' + '\n'
      })

      return gen
    }
}
exports.Evolution = Evolution;

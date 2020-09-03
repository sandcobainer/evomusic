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
      this.evolver
      this.params={}
    }
    getParams() {
      return this.params;
    }
    applyEvolutions(code) {
        let lines =code.split('\n');
        let players = [], result
        lines.forEach((line, i) => {
          line = line.replace(/\s/g, '');
          if (line.length > 0) {
            try {
              result = parse(line)
              "pname" in result ? players.push(result) : false
              "fparams" in result ? this.params = result : false
            }
            catch(e){
              console.log('unable to parse', line, e)
              return
            }
          }
        });

        if (players.length == 1) {
          console.log('novelty search feature not enabled yet')
        }
        else if (players.length == 2) {
          console.log('directed evolution begins')
          this.srcPlayer = players.filter( (p) => p.pname == this.params.source)
          this.destPlayer = players.filter( (p) => p.pname == this.params.dest)

          this.start = this.convertToObj(this.srcPlayer[0].attributes)
          this.end = this.convertToObj(this.destPlayer[0].attributes)
          this.evolver_1 = new ga.GA(this.start, this.end, this.params.options)

          return this.getEvolutions(this.params.options)
      }
      else
        return;
    }

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
        let results=[], codeGens = [], interpolation = options.interpolate, j= 0;
        for(let i = 0; i < options.evolutions ; i++) {
            let e = this.evolver_1.ga.evolve()
            if (i % options.skipGenerations == 0)
            {
              let result = e.best()
              results.push(result)
              let gen = '\t' + this.srcPlayer[0].pname + '>>' + this.srcPlayer[0].type + '('
              let params =   Object.keys(result)
              params.forEach((r,k) => {
                  if (attributes[r][2] == 'float') {
                    for (var i in result[r]) {
                      result[r][i] = (Math.round(result[r][i] / options.stepSize) * options.stepSize).toFixed(2)
                    }
                  if(interpolation!= 'none' && j>0)
                    gen = gen + r  + '=' + interpolation + '([' + results[j-1][r][0] + ',' + result[r][0] +']' + ',' + barLength + ')'
                  else
                    gen = gen + r  + '=' + '[' + result[r] +']'
                  }
                  else if (attributes[r][2]=='int') {
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
              j++;
            }
        }
        return codeGens
    }
}

exports.Evolution = Evolution;
exports.instruments = instruments;
exports.attributes = attributes;

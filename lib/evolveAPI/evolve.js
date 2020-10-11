// this.srcPlayer
/*
Contains a class related to all functionalities of the evolve API
including parsing, applying GA, formatting text evolutions
*/
const parse = require ("./parser");
const GAConstructor = require("./geneticalgorithm");
const {instruments, attributes} = require('./params.js');
const viz = require("../visuals/index")

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
          this.srcPlayer = players.find( (p) => p.pname == this.params.source)
          this.destPlayer = players.find( (p) => p.pname == this.params.dest)
          this.start = this.convertToObj(this.srcPlayer.attributes)
          this.end = this.convertToObj(this.destPlayer.attributes)
          this.evolver_1 = GAConstructor(this.start, this.end, this.params.options)

          return this.getEvolutions(this.params.options)
      }
      else
        return;
    }

    calculateMeasure(player) {
        console.log(player);
    }

    convertToObj(options) {
        let obj = {}, k
        options.forEach((o) => {
          if (Array.isArray(o) || typeof(o) == 'string')
            obj['nonparam'] = o
          else {
            k = Object.keys(o)[0]
            obj[k] = o[k]
          }
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
              let gen =  this.srcPlayer.pname + '>>' + this.srcPlayer.type + '('
              let params =   Object.keys(result)
              params.forEach((r,k) => {
                  if (r in attributes) {
                    if (attributes[r][2] == 'float') {
                      for (var i in result[r]) {
                        result[r][i] = (Math.round(result[r][i] / options.stepSize) * options.stepSize).toFixed(2)
                      }
                    if(interpolation!= 'none' && j>0)
                      gen = gen + r  + '=' + interpolation + '([' + results[j-1][r][0] + ',' + result[r][0] +']' + ',' + options.lifetime + ')'
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
                  }
                  else {
                    switch(r) {
                      case 'array':
                        gen += '[' + result[r] +']'
                        break;
                      case 'element':
                        if(typeof (result[r]) == 'string')
                          gen += "'" + result[r] + "'"
                        else
                          gen += result[r]
                        break;
                      case 'pattern':
                        gen += "'" + result[r] + "'"
                        break;

                    }
                  }
                  if (k < params.length-1)
                    gen = gen + ',';
              });
              gen = gen + ')' + '\n'
              codeGens.push(gen)
              j++;
            }
        }
        viz(results, 'mapping')
        return codeGens
    }
}

exports.Evolution = Evolution;

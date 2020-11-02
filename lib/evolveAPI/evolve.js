/*
Contains a class related to all functionalities of the evolve API
including parsing, applying GA, formatting text evolutions
*/
const async = require('async')
const parse = require ("./parser");
const directedGA = require("./directedGA.js");
const {instruments, attributes} = require('./params.js');
const {updateStatus, embed} = require("../evolveAPI/vectorize.js")

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
      return this.params
    }

    // parse inputs and apply GA
    applyEvolutions(code) {
        let lines =code.split('\n');
        let players = [], result
        // call parser for each selected line from text
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

        //trigger search based on number of players
        if (players.length == 1) {
          this.srcPlayer = players.find( (p) => p.pname == this.params.source)
          console.log(this.srcPlayer)
          this.start = this.convertToObj(this.srcPlayer.attributes)
          this.evolver = undirectedGA(this.start, this.params.options)
          return this.undirectedSearch(this.params.options)
        }
        else if (players.length == 2) {
          this.srcPlayer = players.find( (p) => p.pname == this.params.source)
          this.destPlayer = players.find( (p) => p.pname == this.params.dest)
          this.start = this.convertToObj(this.srcPlayer.attributes)
          this.end = this.convertToObj(this.destPlayer.attributes)
          this.evolver = directedGA(this.start, this.end, this.params.options)
          return this.directedSearch(this.params.options)
      }
      else
        return;
    }

    // convert parsed JSON into objects
    convertToObj(options) {
      let obj = {}, k
      options.forEach((o) => {
        if (Array.isArray(o) || typeof(o) == 'string')
          obj['nonparam'] = o
        else {
          k = Object.keys(o)[0]
          obj[k] = o[k]
        }
        if (typeof obj[k]!= 'object') {
          obj[k] = [obj[k]]
        }
      });
      return obj
    }

    // directed search from source to destination
    directedSearch(options) {
      let evolvedOutput = this.evolution(options)
      // add start & end to results, send to pca visualizer
      evolvedOutput.results.unshift(this.start)
      evolvedOutput.results.push(this.end)
      let output = {}
      output[this.params.source + '_' + this.params.dest] = evolvedOutput
      async.parallel(
        [embed.bind( null, output,
          [this.params.source, this.params.dest]
        )]
      );
      return evolvedOutput
    }

    // undirectedSearch(options) {
    //   let
    // }

    // performs series of directed evolutions
    directedEvolution (options) {
      let results=[], codeGens = [], interpolation = options.interpolate, j= 0;
      for(let i = 0; i < options.evolutions ; i++) {
          let e = this.evolver.evolve()
          if (i % options.skipGenerations == 0)
          {
            let result = e.best(), gen = stringifyResults(result)
            console.log(result, gen)
            results.push(result)
            codeGens.push(gen)
            j++;
          }
        }
      return { code: codeGens, results: results}
    }

    // performs one evolution of novelty search
    undirectedEvolution (options) {
      let e = this.evolver.evolve(),
          results = e.population(),
          codeGens = []
      for (let i = 0; i < results.length; i++) {
        let gen = stringifyResults(results[i])
        console.log(result[i], gen)
        codeGens.push(gen)
      }
      return { code: codeGens, results: results}
    }

    // stringify one evolution into code snippet, TODO: improve code efficiency
    stringifyResults (result) {
      let gen =  this.srcPlayer.pname + '>>' + this.srcPlayer.type + '('
      let params =   Object.keys(result)
      params.forEach((r,k) => {
          if (r in attributes) {
            if (attributes[r][2] == 'float') {
              for (let i in result[r]) {
                result[r][i] = (Math.round(result[r][i] / options.stepSize) * options.stepSize).toFixed(2)
              }
              gen = gen + r  + '=' + '[' + result[r] +']'
            }
            else if (attributes[r][2]=='int') {
              for (let i in result[r]){
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
      return gen
    }
}

exports.Evolution = Evolution;

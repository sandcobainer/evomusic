/*
Contains a class related to all functionalities of the evolve API
including parsing, applying GA, formatting text evolutions
*/
const async = require('async')
const parse = require ("./parser");
const directedGA = require("./ga.js");
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
          console.log('novelty search feature not enabled yet')
          this.srcPlayer = players.find( (p) => p.pname == this.params.source)
          this.start = this.convertToObj(this.srcPlayer.attributes)
          return this.noveltySearch(this.params.options)
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

    // perform evolutions and convert them into text
    // TODO: **improve code efficiency**
    directedSearch(options) {
        let results=[], codeGens = [], interpolation = options.interpolate, j= 0;
        for(let i = 0; i < options.evolutions ; i++) {
            let e = this.evolver.evolve()
            if (i % options.skipGenerations == 0)
            {
              let result = e.best()

              let gen =  this.srcPlayer.pname + '>>' + this.srcPlayer.type + '('
              let params =   Object.keys(result)
              params.forEach((r,k) => {
                  if (r in attributes) {
                    if (attributes[r][2] == 'float') {
                      for (let i in result[r]) {
                        result[r][i] = (Math.round(result[r][i] / options.stepSize) * options.stepSize).toFixed(2)
                      }
                    if(interpolation!= 'none' && j>0)
                      gen = gen + r  + '=' + interpolation + '([' + results[j-1][r][0] + ',' + result[r][0] +']' + ',' + options.lifetime + ')'
                    else
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
              results.push(result)
              codeGens.push(gen)
              j++;
            }
        }
        // add start, end to results, send to pca visualizer
        results.unshift(this.start)
        results.push(this.end)
        async.parallel(
          [embed.bind( null, results, this.params.source + '_' + this.params.dest,
            [this.params.source, this.params.dest]
          )]
        );
        return {code: codeGens, results: results}
    }
}

exports.Evolution = Evolution;

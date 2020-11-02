/*
Directed search as a JS function constructor
*/
let _ = require('lodash')
const {instruments, attributes} = require('./params.js');

module.exports = function directedGA(start, end, options) {
  let settings = parseSettings(start, end, options)
  settings.normStart = minmax(start)
  settings.normEnd = minmax(end)
  function parseSettings(start, end, options) {
      let settings = {}
      settings.start = clean(start),
      settings.end = clean(end),
      settings.stepSize = options.stepSize,
      settings.mutationAmount = options.mutationAmount,
      settings.crossoverAmount = options.crossoverAmount,
      settings.attributes = attributes,
      settings.normStart = '',
      settings.normEnd = '',
      settings.attributeKeys = Object.keys(attributes)
      settings.population = [clean(settings.start)]
      if ( settings.population.length <= 0 ) throw Error("population must be an array and contain at least 1 phenotypes")

      settings.populationSize = options.population
      if ( settings.populationSize <= 0 ) throw Error("populationSize must be greater than 0")
      return settings
  }

  // create initial population in each generation
  function populate () {
      let size = settings.population.length
      while( settings.population.length < settings.populationSize ) {
        settings.population.push( mutate( cloneJSON( settings.population[0]), settings.mutationAmount) )
      }
  }

  // overrided these functions for evomusic
  function mutate(inputPheno, mu) {
    let phenotype = cloneJSON(inputPheno), gene, sign
    Object.keys(phenotype).forEach((k) => {

        if (settings.attributeKeys.indexOf(k) > -1) {
            // select a gene to mutate in a list
            gene = Math.floor( Math.random() * phenotype[k].length );
            if (typeof gene !== "number")
              return phenotype;
            sign = Math.random() < 0.5 ? -1 : 1
            // phenotype[k][gene] = Math.round((phenotype[k][gene] + phenotype[k][gene] * sign * mu) * 100) / 100
            phenotype[k][gene] += (phenotype[k][gene] * sign * mu)
            //  clip output to min, max
            if (phenotype[k][gene] < settings.attributes[k][0])
              phenotype[k][gene] = settings.attributes[k][0];
            else if (phenotype[k][gene] > settings.attributes[k][1])
              phenotype[k][gene] = settings.attributes[k][1];
        }
        else {
          return phenotype
        }
    })
    return phenotype;
  }
  function crossover(phenotype) {
      let mate = settings.population[ Math.floor(Math.random() * settings.population.length ) ]
      if(typeof(mate) == 'object')
        mate = cloneJSON(mate)
      else
        return

      let x = cloneJSON(phenotype), y = mate;
      let temp;
      Object.keys(x).forEach((k) => {
          if ( Math.random() <= settings.crossoverAmount ) {
            x[k] = y[k];
          }
      })
      return x
  }
  function doesABeatB(a,b) {
      let doesABeatB = false;
      return fitnessFunction(a) <= fitnessFunction(b)
  }
  // normalize euclidean distance
  function fitnessFunction(phenotype) {
    let sumOfSquares = 0, val
    let norm = minmax(phenotype)
    Object.keys(norm).forEach((k) => {
       for (let i in norm[k]) {
          val = settings.normEnd[k][i] - norm[k][i]
          sumOfSquares += Math.pow(val, 2);
       }
   })
    return Math.sqrt(sumOfSquares);
  }




  // utils
  function cloneJSON( object ) {
      return JSON.parse ( JSON.stringify ( object ) )
  }
  function convertRange( value, r0, r1, r2, r3 ) {
    return ( value - r0 ) * (( r3 - r2) / ( r1 - r0 ));
  }
  function clean(phen) {
    Object.keys(phen).forEach((k) => {
    if (typeof phen[k]!= 'object') {
      phen[k] = [phen[k]]
    }
    })
    return phen
  }
  function minmax(phenotype) {
    norm = cloneJSON(phenotype)
    Object.keys(norm).forEach((k) => {
      let min = settings.attributes[k][0], max = settings.attributes[k][1]
      let arr = norm[k]
      for (let i in arr) {
        arr[i] = (arr[i] - min) / (max - min)
      }
    })
    return norm
  }



  function compete( ) {
      let nextGeneration = []
      let comp =0, phen =0
      for( let p = 0 ; p < settings.population.length - 1 ; p+=2 ) {
          let phenotype = settings.population[p];
          let competitor = settings.population[p+1];

          nextGeneration.push(phenotype)
          if ( doesABeatB( phenotype , competitor )) {
              phen++
              if ( Math.random() < 0.5 ) {
                  nextGeneration.push(mutate(phenotype, settings.mutationAmount))
              } else {
                  nextGeneration.push(crossover(phenotype))
              }
          } else {
             comp++
              nextGeneration.push(competitor)
          }
      }
      settings.population = nextGeneration;
  }
  function randomizePopulationOrder() {
      for( let index = 0 ; index < settings.population.length ; index++ ) {
          let otherIndex = Math.floor( Math.random() * settings.population.length )
          let temp = settings.population[otherIndex]
          settings.population[otherIndex] = settings.population[index]
          settings.population[index] = temp
      }
  }



  return {
      evolve : function () {
          populate()
          randomizePopulationOrder()
          compete()
          return this
      },
      best : function() {
          let scored = this.scoredPopulation()
          let result = scored.reduce(function(a,b){
              return a.score >= b.score ? a : b
          },scored[0]).phenotype
          return cloneJSON(result)
      },
      bestScore : function() {
          return settings.fitnessFunction( this.best() )
      },
      population : function() {
          return cloneJSON( this.config().population )
      },
      scoredPopulation : function() {
          return this.population().map(function(phenotype) {
              return {
                  phenotype : cloneJSON( phenotype ),
                  score : fitnessFunction( phenotype )
              }
          })
      },
      config : function() {
          return cloneJSON( settings )
      },
      clone : function(options) {
          return GAConstructor(
              settingWithDefaults(options,
                  settingWithDefaults( this.config(), settings )
                  )
              )
      }
  }
}

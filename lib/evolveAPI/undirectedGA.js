/*
Directed search as a JS function constructor
*/
let _ = require('lodash')
const {instruments, attributes} = require('./params.js');

module.exports = function undirectedGA(start, options) {
  let settings
  settings = parseSettings(start, options)

  function parseSettings(start, options) {
      settings = {}
      settings.start = clean(start),
      settings.stepSize = options.stepSize,
      settings.mutationAmount = options.mutationAmount,
      settings.crossoverAmount = options.crossoverAmount,
      settings.attributes = attributes,
      settings.attributeKeys = Object.keys(attributes)
      settings.population = settings.start
      if ( settings.population.length <= 0 ) throw Error("population must be an array and contain at least 1 phenotypes")
      settings.populationSize = options.population
      if ( settings.populationSize <= 0 ) throw Error("populationSize must be greater than 0")
      return settings
  }

  // create initial population in each generation
  function populate () {
      while( settings.population.length <= settings.populationSize ) {
        settings.population.push( mutate( cloneJSON( settings.population[0]), settings.mutationAmount) )
      }
  }

  // overrided these functions for evomusic
  function mutate(inputPheno, mu) {
    let phenotype = inputPheno.data, gene, sign, mutation
    Object.keys(phenotype).forEach((k) => {
        if (settings.attributeKeys.indexOf(k) > -1) {
            // select a gene to mutate in a list
            gene = Math.floor( Math.random() * phenotype[k].length );
            if (typeof gene !== "number")
              return phenotype;
            sign = Math.random() < 0.5 ? -1 : 1
            mutation = parseFloat(phenotype[k][gene])
            phenotype[k][gene] = mutation + (mutation * sign * mu)
            if (phenotype[k][gene] < settings.attributes[k][0])
              phenotype[k][gene] = settings.attributes[k][0];
            else if (phenotype[k][gene] > settings.attributes[k][1])
              phenotype[k][gene] = settings.attributes[k][1];
        }
        else {
          return inputPheno
        }
    })
    return inputPheno;
  }

  function crossover(phenotype) {
      let mate = settings.population[ Math.floor(Math.random() * settings.population.length ) ]
      if(typeof(mate) == 'object')
        mate = cloneJSON(mate.data)
      else
        return
      let x = phenotype.data, y = mate, temp
      Object.keys(x).forEach((k) => {
          if ( Math.random() <= settings.crossoverAmount ) {
            x[k] = y[k];
          }
      })
      return phenotype
  }

  function doesABeatB(a,b) {
      let doesABeatB = false;
      return a.fitness <= b.fitness
  }

  function compete( ) {
      let nextGeneration = [], nextFitness = []
      let comp =0, phen =0
      for( let p = 0 ; p < settings.population.length - 1 ; p+=2 ) {
          let phenotype = settings.population[p];
          let competitor = settings.population[p+1];

          nextGeneration.push(phenotype)
          if ( doesABeatB( phenotype , competitor )) {
              phen++
              // start new borns with a bias fitness of +2
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
      settings.population = nextGeneration
  }
  function randomizePopulationOrder() {
      for( let index = 0 ; index < settings.population.length ; index++ ) {
          let otherIndex = Math.floor( Math.random() * settings.population.length )
          let temp = settings.population[otherIndex]
          settings.population[otherIndex] = settings.population[index]
          settings.population[index] = temp
      }
  }



  // utils
  function cloneJSON( object ) {
      return JSON.parse ( JSON.stringify ( object ) )
  }
  function convertRange( value, r0, r1, r2, r3 ) {
    return ( value - r0 ) * (( r3 - r2) / ( r1 - r0 ));
  }

  function clean(pop) {
    pop.forEach((phen, i) => {
      Object.keys(phen.data).forEach((k) => {
        if (typeof phen.data[k]!= 'object') {
          phen.data[k] = [phen[k]]
        }
      })
    });
    return pop
  }

  return {
      evolve : function () {
          populate()
          // randomizePopulationOrder()
          compete()
          // console.log(settings.population)
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
      }
  }
}

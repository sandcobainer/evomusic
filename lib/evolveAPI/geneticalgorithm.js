var _ = require('lodash')
const {instruments, attributes} = require('./params.js');

module.exports = function GAConstructor(start, end, options) {

    function parseSettings(options) {
        settings = {}

        settings.stepSize : options.stepSize,
        settings.mutationAmount : options.mutationAmount,
        settings.crossoverAmount: options.crossoverAmount,
        settings.attributes : attributes,
        settings.attributeKeys : Object.keys(attributes)

        settings.population = [start]
        if ( settings.population.length <= 0 ) throw Error("population must be an array and contain at least 1 phenotypes")

        settings.populationSize = options.population
        if ( settings.populationSize <= 0 ) throw Error("populationSize must be greater than 0")

        settings.start: this.start,
        settings.end: this.end,

        return settings
    }

    var settings = parseSettings(options)

    function populate () {
        var size = settings.population.length
        while( settings.population.length < settings.populationSize ) {
            if ( Math.random() < 0.5 )
              settings.population.push(
                  mutate( cloneJSON( settings.population[0]) )
              )
            else
            settings.population.push(
                crossover( cloneJSON( settings.population[0]) )
            )
        }

    }

    function cloneJSON( object ) {
        return JSON.parse ( JSON.stringify ( object ) )
    }

    // got these functions and overrided

    function mutate(phenotype) {
      Object.keys(phenotype).forEach((k) => {
          let muAmount;
          if (this.attributeKeys.indexOf(k) > -1) {
            let subPheno = phenotype[k]
            if(typeof subPheno == "number") {
              if (this.start[k][0] === undefined)
                return;
              muAmount = this.convertRange(this.mutationAmount, 0, 1, this.start[k][0], this.end[k][0])
              subPheno  += (Math.random() * 2 - 1 ) * muAmount;
              if (subPheno < this.attributes[k][0])
                subPheno = this.attributes[k][0];
              else if (subPheno > this.attributes[k][1])
                subPheno = this.attributes[k][1];
            }
            else {
              var gene = Math.floor( Math.random() * subPheno.length );
              if (typeof gene !== "number")
                return phenotype;
              muAmount = this.convertRange(this.mutationAmount, 0, 1, this.start[k][gene], this.end[k][gene])
              subPheno[gene] = parseFloat(subPheno[gene])
              subPheno[gene] += (Math.random() * 2 - 1 ) * muAmount

              subPheno[gene] = parseFloat(subPheno[gene]).toFixed(2);
              if (subPheno[gene] < this.attributes[k][0])
                subPheno[gene] = this.attributes[k][0];
              else if (subPheno[gene] > this.attributes[k][1])
                subPheno[gene] = this.attributes[k][1];
            }
          }
          else
            return phenotype;
      })
      return phenotype;
    }

    function crossover(phenotype) {
        phenotype = cloneJSON(phenotype)
        var mate = settings.population[ Math.floor(Math.random() * settings.population.length ) ]
        if(typeof(mate) == 'object')
          mate = cloneJSON(mate)
        else
          return

        let x = _.cloneDeep(phenotype), y = _.cloneDeep(mate);
        let temp;
        Object.keys(x).forEach((k) => {
            if ( Math.random() <= this.crossoverAmount ) {
              temp = x[k];
              x[k] = y[k];
              y[k] = temp;
            }
        })
        return x
    }

    function doesABeatB(a,b) {
        var doesABeatB = false;
        return fitnessFunction(a) <= fitnessFunction(b)
    }

    function fitnessFunction(phenotype) {
      var sumOfPowers = 0;
      Object.keys(phenotype).forEach((k) => {
          if(typeof phenotype[k] == "number")
              phenotype[k] = [phenotype[k]]

          if(typeof this.end[k] == "number")
              this.end[k] = [this.end[k]]

          for (var i in phenotype[k]) {
              sumOfPowers += Math.pow( (this.end[k][i] - phenotype[k][i])/ Math.abs(this.start[k][i] - this.end[k][i]), 2);
          }
      })
      return Math.sqrt(sumOfPowers);
    }

    function convertRange( value, r0, r1, r2, r3 ) {
      return ( value - r0 ) * (( r3 - r2) / ( r1 - r0 ));
    }



    function compete( ) {
        var nextGeneration = []

        for( var p = 0 ; p < settings.population.length - 1 ; p+=2 ) {
            var phenotype = settings.population[p];
            var competitor = settings.population[p+1];

            nextGeneration.push(phenotype)
            if ( doesABeatB( phenotype , competitor )) {
                if ( Math.random() < 0.5 ) {
                    nextGeneration.push(mutate(phenotype))
                } else {
                    nextGeneration.push(crossover(phenotype))
                }
            } else {
                nextGeneration.push(competitor)
            }
        }

        settings.population = nextGeneration;
    }

    function randomizePopulationOrder( ) {

        for( var index = 0 ; index < settings.population.length ; index++ ) {
            var otherIndex = Math.floor( Math.random() * settings.population.length )
            var temp = settings.population[otherIndex]
            settings.population[otherIndex] = settings.population[index]
            settings.population[index] = temp
        }
    }



    return {
        evolve : function (options) {

            if ( options ) {
                settings = settingWithDefaults(options,settings)
            }
            populate()
            randomizePopulationOrder()
            compete()
            return this
        },
        best : function() {
            var scored = this.scoredPopulation()
            var result = scored.reduce(function(a,b){
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
                    score : settings.fitnessFunction( phenotype )
                }
            })
        },
        config : function() {
            return cloneJSON( settings )
        },
        clone : function(options) {
            return geneticAlgorithmConstructor(
                settingWithDefaults(options,
                    settingWithDefaults( this.config(), settings )
                    )
                )
        }
    }
}

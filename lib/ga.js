var GeneticAlgorithm = require('geneticalgorithm')
var _ = require('lodash')
// if ( !process.argv[2] ) { console.log("No argument found.  Using default of 10 as the Phenotype size.") }
// var PhenotypeSize = process.argv[2] || 10;

class GA {
    constructor(start, end, evo) {
        this.start = start
        this.end = end
        this.PhenotypeSize = 10

        this.mutationAmount = (evo.mutationAmount === undefined)
                            ?  0.3 : evo.mutationAmount

        this.crossoverAmount = (evo.crossoverAmount === undefined )
                                ? 0.8  : evo.crossoverAmount

        this.stepSize = (evo.stepSize === undefined) ? 1 : evo.stepSize



        this.ga = GeneticAlgorithm({
            mutationFunction: this.mutationFunction,
            crossoverFunction: this.crossoverFunction,
            fitnessFunction: this.fitnessFunction,
            doesABeatBFunction: this.doesABeatBFunction,
            population : !this.ga?[this.start]:this.ga.population() ,
            populationSize: 3,
            end: this.end,
            stepSize : this.stepSize,
            mutationAmount : this.mutationAmount,
            crossProbability: this.crossoverAmount
        });

    }


    mutationFunction(phenotype) {
        Object.keys(phenotype).forEach((k) => {
            let subPheno = phenotype[k]
            if(typeof subPheno == "number") {
                subPheno  += (Math.random() * 2 - 1 ) * this.mutationAmount
                subPheno = (Math.round(subPheno / this.stepSize) * this.stepSize)
                // subPheno = Math.round(subPheno * 1e2) / 1e2
            }
            else {
              var gene = Math.floor( Math.random() * subPheno.length );
              if (typeof gene !== "number")
                return phenotype;
              subPheno[gene] += (Math.random() * 2 - 1 ) * this.mutationAmount
              subPheno[gene] = (Math.round(subPheno[gene] / this.stepSize) * this.stepSize)
              subPheno[gene] = Math.round(subPheno[gene] * 1e2) / 1e2
            }
        })
        return phenotype;
    }

    crossoverFunction(a, b) {
        let x = _.cloneDeep(a), y = _.cloneDeep(b);

        Object.keys(x).forEach((k) => {
            for (var i in x[k]) {
                if ( Math.random() <= this.crossProbability ) {
                  try {
                    x[k][i] = y[k][i];
                    y[k][i] = x[k][i];
                  }
                  catch(e) {
                  }

                }
            }
        })
        return [ x , y ];
    }

    fitnessFunction(phenotype) {
        var sumOfPowers = 0;
        Object.keys(phenotype).forEach((k) => {
            if(typeof phenotype[k] == "number")
                phenotype[k] = [phenotype[k]]

            if(typeof this.end[k] == "number")
                this.end[k] = [this.end[k]]

            for (var i in phenotype[k]) {
                sumOfPowers += Math.pow( this.end[k][i] - phenotype[k][i], 2);

                //penalize negative numbers
                if (phenotype[k][i] < 0)
                    sumOfPowers += Math.pow(phenotype[k][i], 2)
            }
        })
        return Math.sqrt(sumOfPowers);
    }

    doesABeatBFunction(a,b) {
        return this.fitnessFunction(a) <= this.fitnessFunction(b)
    }
}

module.exports.GA = GA

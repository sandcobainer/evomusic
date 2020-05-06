var GeneticAlgorithm = require('geneticalgorithm')
var _ = require('lodash')
const evolver_1 = require("./evolve.js");
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
        this.attributes = evolver_1.attributes

        this.ga = GeneticAlgorithm({
            mutationFunction: this.mutationFunction,
            crossoverFunction: this.crossoverFunction,
            fitnessFunction: this.fitnessFunction,
            doesABeatBFunction: this.doesABeatBFunction,
            convertRange : this.convertRange,
            population : !this.ga?[this.start]:this.ga.population() ,
            populationSize: 3,
            end: this.end,
            stepSize : this.stepSize,
            mutationAmount : this.mutationAmount,
            crossProbability: this.crossoverAmount,
            attributes : this.attributes,
            attributeKeys : Object.keys(this.attributes)
        });

    }


    mutationFunction(phenotype) {
        Object.keys(phenotype).forEach((k) => {
            let mutationAmount;
            let stepSize;

            if (this.attributeKeys.indexOf(k) > -1) {
              mutationAmount = this.convertRange(this.mutationAmount, 0, 1, this.attributes[k][0], this.attributes[k][1])
              if(this.attributes[k][2] == 'int')
                stepSize = 1
              else
                stepSize =  this.stepSize
            }
            else
              return;
            let subPheno = phenotype[k]
            if(typeof subPheno == "number") {
              subPheno  += (Math.random() * 2 - 1 ) * mutationAmount
              subPheno = (Math.round(subPheno / stepSize) * stepSize)
              // subPheno = Math.round(subPheno * 1e2) / 1e2
              if (subPheno < this.attributes[k][0])
                subPheno = this.attributes[k][0];
              else if (subPheno > this.attributes[k][1])
                subPheno = this.attributes[k][1];

            }
            else {
              var gene = Math.floor( Math.random() * subPheno.length );
              if (typeof gene !== "number")
                return phenotype;
              subPheno[gene] += (Math.random() * 2 - 1 ) * mutationAmount
              subPheno[gene] = (Math.round(subPheno[gene] / stepSize) * stepSize)
              subPheno[gene] = Math.round(subPheno[gene] * 1e2) / 1e2
              if (subPheno[gene] < this.attributes[k][0])
                subPheno[gene] = this.attributes[k][0];
              else if (subPheno[gene] > this.attributes[k][1])
                subPheno[gene] = this.attributes[k][1];

            }
        })
        return phenotype;
    }

    crossoverFunction(a, b) {
        let x = _.cloneDeep(a), y = _.cloneDeep(b);
        // console.log([a,b], this.crossProbability)
        // function cloneJSON( item ) {
		    //     return JSON.parse ( JSON.stringify ( item ) )
		    // }
		    // var x = cloneJSON(a), y = cloneJSON(b), cross = false;
        let temp;
        Object.keys(x).forEach((k) => {
            if ( Math.random() <= this.crossProbability ) {
              temp = x[k];
              x[k] = y[k];
              y[k] = temp;
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

    convertRange( value, r0, r1, r2, r3 ) {
      return ( value - r0 ) * ( r3 - r2) / ( r1 - r0 ) + r2;
    }

}

module.exports.GA = GA

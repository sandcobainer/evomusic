var GeneticAlgorithm = require('geneticalgorithm')
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
        this.ga = GeneticAlgorithm({
            mutationFunction: this.mutationFunction,
            crossoverFunction: this.crossoverFunction,
            fitnessFunction: this.fitnessFunction,
            doesABeatBFunction: this.doesABeatBFunction,
            population : !this.ga?[this.start]:this.ga.population() ,
            populationSize: 3,
            end: this.end,
            mutationAmount : this.mutationAmount,
            crossProbability: this.crossoverAmount
        });

    }


    mutationFunction(phenotype) {
        Object.keys(phenotype).forEach((k) => {
            let subPheno = phenotype[k]
            if(typeof subPheno == "number") {
                subPheno = [subPheno]
            }
            var gene = Math.floor( Math.random() * subPheno.length );
            subPheno[gene] += (Math.random() * 2 - 1 ) * this.mutationAmount
        })
        return phenotype;
    }

    crossoverFunction(a, b) {
        function cloneJSON( item ) {
            return JSON.parse ( JSON.stringify ( item ) )
        }
        // var x = cloneJSON(a), y = cloneJSON(b),
        let cross = false;
        Object.keys(a).forEach((k) => {
            for (var i in a[k]) {
                // console.log(Math.random() * a[k].length <)
                if ( Math.random() <= this.crossProbability ) { cross = !cross }
                if (cross) {
                    a[k][i] = b[k][i];
                    b[k][i] = a[k][i];
                }
            }
        })
        return [ a , b ];
    }

    fitnessFunction(phenotype) {
        var sumOfPowers = 0;
        Object.keys(phenotype).forEach((k) => {
            if(typeof phenotype[k] == "number") {
                phenotype[k] = [phenotype[k]]
            }
            if(typeof this.end[k] == "number") {
                this.end[k] = [this.end[k]]
            }
            for (var i in phenotype[k]) {
                sumOfPowers += Math.pow( this.end[k][i] - phenotype[k][i], 2);
            }
        })
        let distance = Math.sqrt(sumOfPowers);
        return distance
    }

    doesABeatBFunction(a,b) {
        return this.fitnessFunction(a) <= this.fitnessFunction(b)
    }
}

module.exports.GA = GA

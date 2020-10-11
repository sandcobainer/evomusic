/*
Contains class GA specific to all functionalities of the GA GeneticAlgorithm:
mutation, crossover, fitnessFunction, doesABeatBFunction
*/
var GeneticAlgorithm = require('./geneticalgorithm.js')
console.log(GeneticAlgorithm)
var _ = require('lodash')
const {instruments, attributes} = require('./params.js');

class GA {
  constructor(start, end, options) {
    this.start = start
    this.end = end
    this.ga = GeneticAlgorithm({
       mutationFunction: this.mutationFunction,
       crossoverFunction: this.crossoverFunction,
       fitnessFunction: this.fitnessFunction,
       doesABeatBFunction: this.doesABeatBFunction,
       convertRange : this.convertRange,
       population : [this.start],
       populationSize : options.population,
       start: this.start,
       end: this.end,
       stepSize : options.stepSize,
       mutationAmount : options.mutationAmount,
       crossoverAmount: options.crossoverAmount,
       attributes : attributes,
       attributeKeys : Object.keys(attributes)
    });
    console.log(options)
  }


 mutationFunction(phenotype) {
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

 crossoverFunction(a, b) {
     console.log(this.crossoverAmount)
     let x = _.cloneDeep(a), y = _.cloneDeep(b);
     let temp;
     Object.keys(x).forEach((k) => {
         if ( Math.random() <= this.crossoverAmount ) {
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
             sumOfPowers += Math.pow( (this.end[k][i] - phenotype[k][i])/ Math.abs(this.start[k][i] - this.end[k][i]), 2);
             //penalize negative numbers
             // if (phenotype[k][i] < 0)
             //     sumOfPowers += Math.pow(phenotype[k][i], 2)
         }
     })
     return Math.sqrt(sumOfPowers);
 }

 doesABeatBFunction(a,b) {
     return this.fitnessFunction(a) <= this.fitnessFunction(b)
 }

 convertRange( value, r0, r1, r2, r3 ) {
   return ( value - r0 ) * (( r3 - r2) / ( r1 - r0 ));
 }
}

module.exports.GA = GA

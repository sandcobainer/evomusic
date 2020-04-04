const Rand = require('total-serialism').Stochastic;
const {parse} = require('./parser')
const OSC = require('osc-js');
let osc = new OSC();
osc.open();

class Evolution {
    constructor() {
      this.currentGenome = {}
      this.destination = {}
      this.src_player = ''
      this.dest_player = ''
      this.latestResult = {}

    }
    applyEvolution(code) {
        // code = '# evolved it: \np1 >> pluck([3,4,7])'
        let results = {};
        let genome = {};

        console.log(code);
        let lines =code.split('\n');

        lines.forEach((line, i) => {
          line = line.replace(/\s/g, '')
          if (line.length > 0) {
            let result = parse(line)

            this.sendP5(result);
          }
          // this.evolutions.push(genome);
          // this.applyMutation(genome);
        });
    }

    sendP5(result) {
      let message = new OSC.Message('/test', JSON.stringify(result));
      osc.send(message);
      console.log('sent :',message)
    }

    analyzeCode(result,genome) {
      // take 1st amb grammar result only
      console.log(result)
    }

    applyMutation(genome) {
      console.log(genome)
      const players = Object.keys(genome)
      for (let p in players) {

        player = players[p]
        const attributes = Object.keys(player)
        console.log(player)
        for (let a in attributes) {
          console.log(player[a])
        }
        // if(Array.isArray(attributes))
          // Rand.shuffle(attributes)
      }
    }

}
exports.Evolution = Evolution;

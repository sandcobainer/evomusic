const Rand = require('total-serialism').Stochastic;


class Evolution {
    constructor() {
      this.currentGenome = {}
      this.destination = {}
      this.src_player = ''
      this.dest_player = ''
    }
    applyEvolution(code) {
        // code = '# evolved it: \np1 >> pluck([3,4,7])'
        let results = {};
        let genome = {};

        console.log(code);
        let lines =code.split('\n');

        lines.forEach((line, i) => {
          line = line.trim();
          if (line.length > 0) {
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar),
                          { keepHistory: true }
                          );
            results[i] = parser.feed(line).results;
            this.analyzeCode(results[i], genome);
          }
          // this.evolutions.push(genome);
          this.applyMutation(genome);
        });
        return code;
    }

    analyzeCode(result,genome) {
      // take 1st amb grammar result only
      result = result[0][0];
      if (result[1] == ">>") {
        let pname =  result[0]
        genome[pname] =  {
                              'ptype' : result[2],
                              'notes' : result[4],
                         }
      }
      else if (result[1] == ".") {
        let pname = result[0]
        let pattribute = result[2]
        genome[pname][pattribute] = result[4];
      }
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

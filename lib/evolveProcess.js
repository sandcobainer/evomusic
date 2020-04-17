const evolver_1 = require("./evolve.js");

const evolveBlock = () = {
  const editor = atom.workspace.getActiveTextEditor();
  let evolutions = this.evolver.applyEvolutions(code);
  let evolver = new evolver_1.Evolution()

  let i = 1;
  let env = evolver.getEnv();
  let timeoutLength = (60000/env.bpm) * env.fparams.options.updateFreq

  let genCode = '\n\n' + '@nextBar' + '\n' + 'def autoEvolution():' + '\n'
  + evolutions[0]
  + 'autoEvolution()'
  editor.insertText(genCode);

  let range = this.getRanges()
  range[0].start.row +=2
  range[0].end.row -= 1

  this.evaluateCode(genCode);

  var intervalObj = setInterval(() => {
    if( i == evolutions.length - 1)
      clearInterval(intervalObj)

    console.log(i, range[0], evolutions[i])
    buffer.setTextInRange(range[0], evolutions[i])
    this.evaluateRange(range[0], false);

    i += 1
    console.log(timeoutLength)
  },timeoutLength)
};

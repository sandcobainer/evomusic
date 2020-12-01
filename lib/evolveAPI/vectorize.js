/*
Vectorize and store evolution results, Dimensionality reduce
and send to visualizer(WebSocket) Uses mljs/pca
*/
const WebSocket = require('ws');
const server = require('../visuals/server.js')
const {instruments, attributes} = require('./params.js');
const { PCA } = require('ml-pca');

// setup WS client, PCA
const ws = new WebSocket('ws://localhost:8081');
let opt = {}, evoMemory = {}
opt.method = 'SVD' // theta
opt.nCompNIPALS = 2 // perplexity

function checkMemory(src) {
  if (evoMemory[src] == undefined)
    return undefined
  else {
    return { funcRange:evoMemory[src].funcRange, results:evoMemory[src].results }
  }

}

function updateStatus(msg, src) {
  let msgVal, evoIdx
  switch(Object.keys(msg)[0]) {
    case 'funcRange':
      console.log(msg)
      evoMemory[src].funcRange.start = msg['funcRange'].start
      evoMemory[src].funcRange.end = msg['funcRange'].end
      break;
    case 'evolution':
      msgVal = msg['evolution']
      evoMemory[src]['currentEvo'] = msgVal
      evoMemory[src].results[msgVal].fitness++
      ws.send(JSON.stringify({'evoUpdate': {'code':evoMemory[src].code[msgVal], 'fitness':evoMemory[src].results[msgVal].fitness}}))
      break;
    case 'terminateEvo':
      msgVal = msg['terminateEvo']
      delete evoMemory[msgVal]
      ws.send(JSON.stringify({'terminateEvo':msgVal}))
      break;
    case 'positiveFitness':
      msgVal = msg['positiveFitness']
      evoIdx = evoMemory[src].currentEvo
      evoMemory[src].results[evoIdx].fitness += msgVal
      ws.send(JSON.stringify({'fitnessUpdate': evoMemory[src].results[evoIdx].fitness}))
      break;
    case 'negativeFitness':
      msgVal = msg['negativeFitness']
      evoIdx = evoMemory[src].currentEvo
      evoMemory[src].results[evoIdx].fitness = evoMemory[src].results[evoIdx].fitness - msgVal
      ws.send(JSON.stringify({'fitnessUpdate': evoMemory[src].results[evoIdx].fitness}))
      break;
  }

}

// store evolutions, apply reduction and send to WS
function embed(map, pid) {
  let vectors = [], x=[], y=[], z=[]
  evoMemory[pid] = map

  for (let m in map.results) {
    vectors.push(vectorize(map.results[m].data))
  }
  // let embedding = applyReduction(map.results)
  // console.log(map.code, embedding.x, embedding.y, pid)
  for (let i=0; i < vectors.length; i++) {
    x.push(vectors[i][0])
    y.push(vectors[i][1])
    z.push(vectors[i][2])
  }

  ws.send(JSON.stringify({ 'plot': {x:x,y:y,z:z,'player':pid}}));
}

// vectorize and return 2D embedding
function applyReduction(results) {
  let vectors = [], embedding, x=[], y=[], pca
  for (let m in results) {
    vectors.push(vectorize(results[m].data))
  }
  // let pca = new PCA([vectors[0], vectors[vectors.length-1]])
  pca = new PCA(vectors)
  embedding = pca.predict(vectors).data
  for (let i=0; i < embedding.length; i++) {
    x.push(embedding[i][0])
    y.push(embedding[i][1])
  }
  return {x: x, y:y}
}

function vectorize(phenotype) {
  let vector = []
  Object.keys(phenotype).forEach((k) => {
    if (k in attributes) {
      let min = attributes[k][0], max = attributes[k][1]
      let arr = phenotype[k]
      for (let i in arr) {
        vector.push((arr[i] - min) / (max - min))
      }
    }
  })
  return vector
}

module.exports = { updateStatus : updateStatus, embed : embed, checkMemory : checkMemory }

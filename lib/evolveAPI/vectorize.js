/*
Vectorize, Dimensionality reduce
and send to visualizer(WebSocket) Uses mljs/pca
*/
const WebSocket = require('ws');
const server = require('../visuals/server.js')
const {instruments, attributes} = require('./params.js');
const { PCA } = require('ml-pca');

// setup WS client, PCA
const ws = new WebSocket('ws://localhost:8080');
let opt = {}
opt.method = 'SVD' // theta
opt.nCompNIPALS = 2 // perplexity

function updateStatus(e) {
  console.log('Current Evolution:', e)
}

// apply reduction and send to WS
function embed(map, id, players) {
  let embedding = applyReduction(map)
  console.log(map.length, embedding.x.length)
  ws.send(JSON.stringify({code:map, x:embedding.x,y:embedding.y,'players':players}));
}

// vectorize and return 2D embedding
function applyReduction(map) {
  let vectors = [], embedding, x=[], y=[]
  for (let m in map) {
    vectors.push( vectorize(map[m]))
  }
  let pca = new PCA([vectors[0], vectors[vectors.length-1]])
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
    let min = attributes[k][0], max = attributes[k][1]
    let arr = phenotype[k]
    for (let i in arr) {
      vector.push((arr[i] - min) / (max - min))
    }
  })
  return vector
}

module.exports = { updateStatus : updateStatus, embed: embed }

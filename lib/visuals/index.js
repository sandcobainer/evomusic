console.log('tsne started')


module.exports = function viz(val, key) {
  if (key == 'status')
    updateStatus(val)
  else if (key == 'mapping')
    createMap(val)
}

function updateStatus(status) {
  console.log('Current Evolution:', status)
}

function createMap(data) {
  console.log('received:', data)
}

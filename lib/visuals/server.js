// create websocket server for viz
const WebSocket = require('ws');

const server = new WebSocket.Server({
  port: 8081
});

console.log('Created server at localhost:8080', server)

let sockets = [];
server.on('connection', function(socket) {
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg) {
    sockets.forEach(s => s.send(msg));
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});

// open localhost:8080 in default browser
// (async () => {
//     // Opens the URL in the default browser.
//     await open('file:///Users/a2012/.atom/packages/evomusic/lib/visuals/index.html', {wait:true}, ()=> {
//       console.log('The evolution viewer app quit');
//     });
// })();

// kill WS on exit
function killWS() {
  console.log('Killing WS')
  server.close()
}
module.exports = { killWS : killWS }

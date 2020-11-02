// Visualization code for Plotly
const ws = new WebSocket('ws://localhost:8081');
let parsedMsg, myPlot, maps = [], data = [], layout = {
    hovermode:'closest',
    plot_bgcolor: 'black',
    width: window.innerWidth ,
    height: window.innerHeight - 58,
    paper_bgcolor: '#7f7f7f',
    margin: {
    l: 40,
    r: 40,
    b: 40,
    t: 40
  },
  legend: {
    x: 1,
    xanchor: 'right',
    y: 1,
    font: {
      family: 'sans-serif',
      size: 20,
      color: '#0ff'
    }
  }
 };

ws.onmessage = function(msg) {
  parsedMsg = JSON.parse(msg.data)
  plot(parsedMsg)
};


document.addEventListener('DOMContentLoaded', () => {
  myPlot = document.getElementById('myDiv')
  initMap()
})

// initialize map with layout
function initMap() {
  Plotly.newPlot(myPlot, [], layout);

  myPlot.on('plotly_click', function(data){
      var pts = '';
      for(var i=0; i < data.points.length; i++) {
          pts = 'x:'+data.points[i].x.toPrecision(2) +'y:'+
              data.points[i].y.toPrecision(2);
      }
      console.log('Closest point clicked:\n\n'+pts);
  });
}

// plot new data
function plot(obj) {
  console.log(obj)
  let labels = [], label = obj.players[0] + '_' + obj.players[1],
   trace1 = {
    x: [obj.x[0], obj.x[obj.x.length-1]],
    y: [obj.y[0], obj.y[obj.y.length-1]],
    mode: 'markers+text',
    type: 'scatter',
    name: label,
    text: [obj.players[0], obj.players[1]],
    marker:{size:18}
  }

  for (let i = 1; i < obj.x.length-1; i++) {
    labels[i] = label + '_' + (i).toString()
  }

  let trace2 = { x: obj.x,y: obj.y, type: 'scatter',
             mode:'markers', marker:{size:8},
             name: label,
             hovertext:labels,
             hoverinfo:'text'
           }
  data.push(trace1, trace2)

  Plotly.react(myPlot, data, layout)
}

// Visualization code for Plotly
const ws = new WebSocket('ws://localhost:8081');
let parsedMsg, myPlot, maps = {}, data = [], layout = {
    hovermode:'closest',
    plot_bgcolor: 'black',
    // width: window.innerWidth ,
    height: window.innerHeight - 130,
    paper_bgcolor: 'black',
    title:'VISUALIZATION OF EVOLUTIONS',
    margin: {
    l: 40,
    r: 40,
    b: 40,
    t: 70
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
  },
  xaxis: {
    autorange:true,
    showgrid:false,
    showline: true,
    showticklabels:false,
    zeroline:true
  },
  yaxis: {
    autorange:true,
    showgrid:false,
    showline: true,
    showticklabels:false,
    zeroline:true
  }
}
document.addEventListener('DOMContentLoaded', () => {
  myPlot = document.getElementById('myDiv')
  initMap()
})

// initialize map with layout
function initMap() {
  Plotly.newPlot(myPlot, [], layout, {responsive: true});

  myPlot.on('plotly_click', function(data){
      var pts = '';
      console.log(data)
      for(var i=0; i < data.points.length; i++) {
          pts = 'x:'+data.points[i].x.toPrecision(2) +'y:'+
              data.points[i].y.toPrecision(2);
      }
      var update = {'marker':{color: 'white', size:16}};
      console.log('Closest point clicked:\n\n'+pts);
  });
}

ws.onmessage = function(msg) {
  parsedMsg = JSON.parse(msg.data)
  switch(Object.keys(parsedMsg)[0]) {
    case 'plot':
      plot(parsedMsg.plot)
      break;
    case 'evoUpdate':
      updateEvo(parsedMsg.evoUpdate)
      break;
    case 'fitnessUpdate':
      updateFitness(parsedMsg.fitnessUpdate)
      break;
  }
};

// plot new data
function plot(obj) {
  let labels = [], label = obj.player, trace1, trace2
  for (let i = 0; i < obj.x.length; i++) {
    labels[i] = label + '_' + (i).toString()
  }
  // generated population
  trace1 = {
    x: obj.x,y: obj.y, type: 'scatter',
    mode:'markers', marker:{size:6},
    name: label,
    hovertext:labels,
    hoverinfo:'text',
    showlegend:true
  }
  data.push(trace1)
  console.log('setting up new plot')
  Plotly.react(myPlot, data, layout)
}

function updateEvo(result) {
  document.getElementById('code').innerHTML = result.code
  document.getElementById('status').innerHTML = result.status
  document.getElementById('fitness').innerHTML = 0
}

function updateFitness(fitness) {
  if (fitness != null) {
    document.getElementById('fitness').innerHTML = fitness
    // document.getElementById('evotitle').innerHTML = 'Novelty Search'
  }
}

// plot new data
function plot3D(obj) {
  console.log(obj, obj.x)
  let labels = [], label = obj.player, trace1, trace2

  for (let i = 0; i < obj.x.length; i++) {
    labels[i] = label + '_' + (i).toString()
  }
  // generated population
  trace1 = {
    x:obj.x, y:obj.y, z:obj.z,
    type: 'scatter3d',
    mode:'lines+markers', marker:{size:5},
    name: label, hovertext:labels,
    hoverinfo:'text',
    showlengend:true
  }
  data.push(trace1)
  Plotly.react(myPlot, data, layout)
}

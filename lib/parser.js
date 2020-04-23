const parser = require('./grammar')

// this is a naive parser with no editor exception handling like spaces,
// all params should be in the format degree=[], dur=[] etc.
var defaultFparams = {
     source : '',
     dest: '',
     options : {
       stepSize : 1,
       lifetime : 4000,
       skipGenerations: 300,
       evolutions:3000,
       mutationAmount : 0.25,
       crossoverAmount: 0.7
     }
   }

var actions = {
  make_player: function(input, start, end, elements) {
    let player = {}
    player['pname'] = elements[0]
    player['type'] = elements[2];
    player['attributes'] = elements[4];
    return player;
  },
  make_pname: function(input, start, end, elements) {
    return elements[0].concat(elements[1])
  },
  make_param: function(input, start, end, elements) {
    let params = []
    if(Array.isArray(elements[0]))
      params.push({'degree':elements[0]})
    else
      params = [elements[0]];
    elements[1].elements.forEach(function(el) {params.push(el.param)})
    return params
  },
  make_note: function(input, start, end, elements) {
    return elements
  },

  make_pattribute: function(input, start, end, elements) {
    let pat = {}
    pat[elements[0]] = elements[2]
    return pat
  },

  make_list: function(input, start, end, elements) {
    let list = [elements[1]];
    elements[2].forEach(function(el) { list.push(el.element) });
    return list;
  },

  make_string: function(input, start, end, elements) {
    let str = ''
    elements.forEach(function(el){str = str.concat(el.text) })
    return str;
  },
  make_number: function(input, start, end, elements) {
    return parseFloat(input.substring(start, end), 10);
  },

  make_bpm: function(input, start, end, elements) {
    return { 'bpm': elements[2] }
  },
  make_root: function(input, start, end, elements) {
    return { 'root': elements[3]}
  },
  make_scale: function(input, start, end, elements) {
    return { 'scale': elements[3] }
  },
  make_fparams: function(input, start, end, elements) {
    let fparams = defaultFparams;
    fparams['fparams'] = elements[0]
    fparams['source'] = elements[2];
    fparams['dest'] = elements[4];
    let options = []
    elements[5].elements.forEach(function(el) {
      options.push(el.param)
    })
    options = convertToObj(options);
    Object.keys(options).forEach((o) => {
      fparams.options[o] = options[o];
    });
    console.log(fparams);
    return fparams;
  }
};


function convertToObj(options) {
    let obj = {}
    options.forEach((o) => {
        let k = Object.keys(o)[0]
        obj[k] = o[k]
    });
    return obj
}

module.exports = function parse (code) {
  return results = parser.parse(code, {actions: actions});
}

/* this is a naive parser with no editor exception handling like spaces,
all params should be in the format degree=[], dur=[] etc.
Parser actions for the PEG Grammar
*/

const parser = require('./grammar')
let defaultParams = { source : '', dest: '',
     options : {
       stepSize : 1,
       lifetime : 1,
       interpolate: 'none',
       population: 5,
       skipGenerations: 100,
       evolutions:3000,
       mutationAmount : 0.3,
       crossoverAmount: 0.3
     }
}


let actions = {
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
    params = [elements[0]];
    elements[1].elements.forEach(function(el) {params.push(el.param)})
    return params
  },

  make_pattribute: function(input, start, end, elements) {
    let pat = {}
    pat[elements[0]] = elements[2]
    return pat
  },
  make_nonattribute: function(input, start, end, elements) {
   let nat = {}
   if(elements[0].text!='')
     nat['array'] = elements[0].elements[0]
   else if (elements[1].text!='')
     nat['element'] = elements[1].elements[0]
   else if (elements[2].text!='')
     nat['pattern'] = elements[2].elements[0]
   return nat
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
  make_special: function(input, start, end, elements) {
    let str = ''
    elements.forEach(function(el){str = str.concat(el.text) })
    return str;
  },

  make_pattern: function(input, start, end, elements) {
    return elements[1].text
  },
  make_file: function(input, start, end, elements) {
   return elements[1] + '.' + elements[3]
 },
  make_fraction: function(input, start, end, elements){
    return elements[0] / elements[2]
  },
  make_number: function(input, start, end, elements) {
    return parseFloat(input.substring(start, end), 10);
  },
  make_bpm: function(input, start, end, elements) {
    return { 'bpm': elements[2] }
  },
  make_meter: function(input, start, end, elements) {
    return { 'num_beats': elements[2], 'beat_length': elements[4]  }
  },
  make_root: function(input, start, end, elements) {
    return { 'root': elements[3]}
  },
  make_scale: function(input, start, end, elements) {
    return { 'scale': elements[3] }
  },
  make_fparams: function(input, start, end, elements) {
    let params = defaultParams;
    params['fparams'] = elements[0]
    params['source'] = elements[2];
    params['dest'] = elements[4];
    let options = []
    elements[5].elements.forEach(function(el) {
      options.push(el.param)
    })
    options = convertToObj(options);
    Object.keys(options).forEach((o) => {
      params.options[o] = options[o];
    });
    return params;
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
  return parser.parse(code, {actions: actions});
}

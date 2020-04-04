const parser = require('./grammar')
var actions = {
    make_player: function(input, start, end, elements) {
    let player = {}
    let pname = elements[0]
    player['type'] = elements[2];
    player['attributes'] = elements[4];
    return { [elements[0]] : player };
    },
    make_pname: function(input, start, end, elements) {
      return elements[0].concat(elements[1])
    },
    make_param: function(input, start, end, elements) {
      let params = [elements[0]];
      elements[1].elements.forEach(function(el) {params.push(el.param)})
      // elements[2].forEach(function(el) { params.push(el.element) });

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
      return { 'bpm': elements[2]}
    },
    make_root: function(input, start, end, elements) {
      console.log(elements[3])
      return { 'root': elements[2].concat(elements[3].text)}
    },
    make_scale: function(input, start, end, elements) {
      return { 'scale': elements[2]}
    },
    make_fparams: function(input, start, end, elements) {
      let fparams = {}
      fparams['function'] = elements[0]
      fparams['source'] = elements[2];
      fparams['dest'] = elements[4];
      let options = []
      elements[5].elements.forEach(function(el) {
        options.push(el.param)
      })
      fparams['options'] = options;
      return fparams;
    },

  };

exports.parse = function parse(code ) {
  let results = parser.parse(code, {actions: actions});
  return results
}

// console.log(results.params.elements[0].elements[2].elements[0].elements)
// console.log(results.params.elements[0].elements[1].elements[0])

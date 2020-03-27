module.exports = {
  whitespace: /[ \t]+/,
  number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
  boolean: [ 'true', 'false' ],
  '>>': '>>',
  '(': '(',
  ')': ')',
  '{': '{',
  '}': '}',
  '[': '[',
  ']': ']',
  // moo: /(moo)+/,
  // cows: /cows/,
  ptype: [ 'pluck', 'bass']
}

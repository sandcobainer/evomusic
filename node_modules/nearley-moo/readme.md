## nearley-moo
#### [moo (ultra-fast tokenizer)](https://github.com/tjvr/moo) plugin for [nearley](https://github.com/Hardmath123/nearley) :cow2:

[![npm](https://img.shields.io/npm/v/nearley-moo.svg)](https://npmjs.com/package/nearley-moo)

## install

**with npm**
```sh
npm install nearley-moo --save
```

**with yarn**
```sh
yarn add nearley-moo
```

## usage

**index.js**
```js
const moo = require('moo')
const nearley = require('nearley')
const grammar = require('./grammar.js') // compiled from grammar.ne
const tokens = require('./tokens.js')

const nm = require('nearley-moo').parser(nearley, grammar) // curried

let parser = nm(moo.compile(tokens))

// ignored tokens will not be passed to nearley
// helpful for whitespace and/or comments
parser.ignore('whitespace') // may be Array<string> or String

// feed your lexer+parser combo as normal
parser.feed('if true then moomoomoo else cows')

console.log(parser.results) // just like nearley
```

**tokens.js**
```js
module.exports = {
  whitespace: /[ \t]+/,
  moo: /(moo)+/,
  cows: /cows/,
  boolean: [ 'true', 'false' ],
  keyword: [ 'if', 'then', 'else'],
}
```

**grammar.ne**
```ne
@{%

const nm = require('nearley-moo')
const tokens = require('./tokens.js')

nm(tokens)

%}

main -> %keyword_if expression %keyword_then expression %keyword_else expression

expression -> boolean
            | %moo
            | %cows

boolean -> %boolean_true  {% d => true %}
         | %boolean_false {% d => false %}
```

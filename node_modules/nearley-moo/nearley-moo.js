const curry = require('curry')

// intended to be called by the grammar itself
function nm(tokens) {
  // XXX: until nearley supports `.` in token identifiers this will
  //      pollute the global scope :(
  const g = global || window

  for (const key in tokens) {
    let value = tokens[key]

    if (value instanceof String)
      value = [ value ]

    if (value instanceof Array || value.value instanceof Array) {
      // we've got ourselves a keyword array!
      const keywords = value instanceof Array ? value : value.value

      for (let keyword of keywords) {
        // add tester functions for each
        g[key + '_' + keyword] = { test: tok =>
          tok.type === key && tok.value === keyword }
      }
    }

    // add tester function for `key`
    g[key] = { test: tok => tok.type === key }
  }
}

// intended to be called by the parent js file
nm.parser = curry((nearley, grammar, lexer) => {
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  lexer.reset()

  const self = {
    results: [],
    parser, lexer,

    ignore: type => {
      self.ignoredTokens.push(...(type instanceof Array ? type : [ type ]))
      return self
    },

    feed: (str, fn) => {
      let token

      // feed to moo
      lexer.reset(str)
      while(token = lexer.next()) {
        // ignore tokens if asked!
        if (self.ignoredTokens.includes(token.type))
          continue

        if (fn) {
          // pass to fn for magic to happen?
          fn(token, self)
        } else {
          // feed to nearley
          parser.feed([ token ])
        }
      }

      self.results = parser.results
      return self
    }
  }

  Object.defineProperty(self, 'ignoredTokens', { value: [] })

  return self
})

module.exports = nm

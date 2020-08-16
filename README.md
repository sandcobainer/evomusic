# evoMusic: Genetic Algorithm interface for FoxDot in Atom

See [FoxDot's repository](https://github.com/Qirky/FoxDot) for installation and usage instructions.

This is an extension of the native FoxDot interface for Atom. The earlier interface had the following features already

- Multiple cursors are executed in order of creation.
- Can evaluate the entire file.
- Autocompletion.
- Message Logger

 The APM package includes the following extensions

- Parser Grammar to parse and understand FoxDot Player objects
- Genetic algorithms to evolve musical piece
- Text interactions to Evolve a code snippet from player `p1` to `p2`
- Asynchronous parallel evolutions
- Stop getEvolutions
- Visual feedback for current evolution in text editor

An example of evolution from player `p1` to `p2`
```
evolve(p1, p2,         // source and destination
  genomesstepSize = 1,   // quantization steps for values
  lifetime = 2000,// Generation update time in ms
  skipGenerations = 200, // play every 200th gen
  evolutions = 3000,     // number of evolutions
  mutationAmount = 0.25, // probability of mutation
  crossoverAmount = 0.7  // probability of crossover
  interpolate = linvar   // type of interpolation: linear, exp, sin, none
  )
```

## Start livecoding

This only works in the scope of python files. Start Supercollider FoxDot quark before toggling this package.

**Toggle FoxDot** (`cmd-e`) in order to start it.

## Key bindings
Replace `cmd` with `ctrl` on Windows.

| Binding | Command |
| - | - |
| `cmd-e` | Toggle |
| `cmd-enter` | Evaluate block(s) |
| `cmd-alt-enter` | Evaluate file |
| `alt-enter` | Evaluate line(s) |
| `cmd-.` | Clear clock |
| `cmd-e` | Evolve code
| `cmd-c` | Stop evolution

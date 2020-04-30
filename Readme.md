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


## Start livecoding

This only works in the scope of python files. Start Supercollider FoxDot quark before toggling this package.

**Toggle FoxDot** (`cmd-e`) in order to start it.

## Key bindings

| Binding | Command |
| - | - |
| `cmd-e` | Toggle |
| `cmd-enter` | Evaluate block(s) |
| `cmd-alt-enter` | Evaluate file |
| `alt-enter` | Evaluate line(s) |
| `cmd-.` | Clear clock |
| `cmd-e` | Evolve code

# evoMusic: Genetic Algorithm interface for FoxDot in Atom

This is an extension of the native FoxDot interface for Atom and hence requires all the setup for the former project. See [FoxDot's repository](https://github.com/Qirky/FoxDot) for installation and usage instructions.

This APM package is designed specifically for Genetic Algorithms (GA) in FoxDot. Two variants of GA are applied with FoxDot player objects. Each player object in it's current state is considered a genome and is evolved using 2 variants of the GA

1. Directed Evolution: Evolves a player `p1` to `p2` over a defined number of evolutions and population. In each generation, the fittest possible player is selected and played as the object moves towards the destination player.

2. Novelty Search: Essentially a goal-less search, this variant allows the coder to mutate and direct the search to find new players around the source player `p1` provided. In this, the coder is expected to rate the players with a positive or negative fitness and the algorithm executes every member of the population while doing so. To spawn


**Stop FoxDot** (`cmd-e`) in order to start an evolution.
**Stop FoxDot** (`cmd-z`) in order to stop an evolution.
**Toggle FoxDot** (`cmd-up`) in order to start it.
**Toggle FoxDot** (`cmd-e`) in order to start it.

Note: `cmd` is replaced by `ctrl` in Windows


# Evolve API
Parameters for a directed search:
```
evolve(p1, p2,           // source and destination
  stepSize = 1,          // quantization steps for values
  lifetime = 1,          // Generation update time in number of bars
  population = 5         // Number of genomes in each generation
  skipGenerations = 200, // play every 200th gen
  evolutions = 3000,     // number of evolutions
  mutationAmount = 0.25, // probability of mutation
  crossoverAmount = 0.7  // probability of crossover
  interpolate = linvar   // type of interpolation: linear, exp, sin, none
  )
```

## Installation
Currently the package is not published on [`atom.io`!](https://atom.io/packages). Instead to install the package manually,

1. Navigate to .atom/packages and download this repository there
2. type apm install in the terminal
3. restart atom

## Start livecoding

This only works in the scope of python files. Start Supercollider FoxDot quark before toggling this package.

**Toggle FoxDot** (`cmd-e`) in order to start evomusic in Atom.

## Directed Evolution: Usage
An example of evolution from player `p1` to `p2`:

```
p1>>pluck([3,4,5],room=0.1, amp=0.2)
p2>>pluck([3,4,5],room=0.8, amp=0.5)
evolve(p1,p2) # Point cursor here and execute evolution with Cmd+E or Cmd+Z to Stop evolution
```

Generated code:
```
@nextBar
def evolve_p1_p2():
	p1>>pluck(room=[0.67],amp=[0.62])
evolve_p1_p2() #Point cursor and stop evolution with cmd+z
########## Evolving from p1 to p2
```

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

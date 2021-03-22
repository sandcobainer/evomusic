"""
Directed Evolution allows the live coder to evolve a musical simple
s1 to s2
using the following genetic algorithm parameters:

stepSize = 0.1,          # quantization steps for values
lifetime = 1,            # Generation update time in number of bars
population = 5           # Number of genomes in each generation
skipGenerations = 1,     # play every 200th gen
evolutions = 100,        # number of evolutions
mutationAmount = 0.5,    # probability of mutation
crossoverAmount = 0.5    # probability of crossover

To execute a directed evolution, list players p1 and p2 on successive lines,
followed by evolve() function. Place cursor after the evolve function handling
and use key combination Cmd/Ctrl + E to start a directed evolution.
p1>> ..
p2>> ..
evolve() Cmd/Ctrl + E

To stop an evolution, place the cursor at the end of the generated code snippet
at evolve_s1_s2() Cmd/Ctrl+Z

The genetic algorithm generates 'n' evolutions of musical simples that run for evolutions * lifetime number of
musical bars (calculated according to tempo and metric structure)

Example of Directed Evolution
"""


s1>>pluck(vib=[0.2],echo=[0.40],chop=[0.5],room=1,amp=0.9)
s2>>pluck(vib=[0.9],echo=[0.2],chop=[1],room=2,amp=0.5)
evolve(s1, s2, evolutions=50, lifetime=2, mutationAmount=0.5)

@nextBar
def evolve_s1_s2():
	s1>>pluck(vib=[0.10],echo=[0.30],chop=[0],room=[0.50],amp=[0.50])
evolve_s1_s2()

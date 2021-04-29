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

s2>>pluck(degree=[4,5,3], chop=1, vib=[0.9],echo=[0.2],chop=[1],dur=4)
evolve(s2, population=5, lifetime=1, mutationAmount=0.5)







c3>>space(degree=[3,3,0,5],amp=0.08,tremolo=1)
evolve(c3,lifetime=1, mutationAmount=0.8, population=6)

@nextBar
def evolve_c3():
	c3>>space(degree=[3,5,0,5],amp=[0.00],tremolo=[0.20])
evolve_c3()

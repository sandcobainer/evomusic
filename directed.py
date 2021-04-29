"""
Directed Evolution allows the live coder to evolve a musical simple
s1 to s2
stepSize = 0.1,          # quantization steps for values
lifetime = 1,            # Generation update time in number of bars
population = 5           # Number of genomes in each generation
skipGenerations = 1,     # play every 200th gen
evolutions = 100,        # number of evolutions
mutationAmount = 0.5,    # probability of mutation
crossoverAmount = 0.5    # probability of crossover

To execute a directed evolution, Cmd/Ctrl + E to start a directed evolution.
p1>> ..
p2>> ..
evolve() Cmd/Ctrl + E

To stop an evolution, place the cursor at the end of the generated code snippet
at evolve_s1_s2() Cmd/Ctrl+Z: evolutions

Generates 'n' evolutions of musical simples that run for evolutions * lifetime number of
musical bars (calculated according to tempo and metric structure)
"""

print(SynthDef)

Scale.default = Scale.mixolydian

s2>>dirt(degree=[0,2,4,8],dur=4,formant=0, room=1/4,mix=1/4,amp=0.4)
s3>>dirt(degree=[1,3,5,7],dur=5,formant=2, room=1,mix=3/4,amp=0.2)
evolve(s2,s3, population=100, evolutions=10, mutationAmount=0.5, lifetime=2)

Scale.default = Scale.minor

d1 >> dirt([0,0,4,0,7], dur=1/4, oct=4, drive=0.1, formant=[0,0,1])
d2 >> dirt([0,9,7,6,7], dur=1/2, oct=5, drive=0.15, formant=[0,2,1])
evolve(d1, d2, population=100, evolutions=20, mutationAmount=0.5, lifetime=2)

@nextBar
def evolve_d1_d2():
	d1>>dirt([0,9,7,6,7],dur=[0.50],oct=[5],drive=[0.10],formant=[0.00,2.00,1.00])
evolve_d1_d2()

d1.stop()

@nextBar
def evolve_d1_d2():
	d1>>dirt([0,9,7,6,7],dur=[0.50],oct=[5],drive=[0.10],formant=[0.00,2.00,1.00])
	d1.amp=0.1
evolve_d1_d2()


d2.stop()

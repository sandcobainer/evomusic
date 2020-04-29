# proof of concept live coding music editor
# using supercollider, p5 and node js

TODO DEV:
# add heuristics to the fitness function (euclidean distance)
#### penalize all negative values, excessive out of range values ie. loud amplifier values, big reverb, distortion
#### handle stepSize for each param

# auto = true  / false
# interpolation = true
# evolution Life Time in tempo/meter specific measures (currently hardcoded)
# toggle mutation off individually for each param
# extend parser to ignore comments and new line characters (currently crashes system)
# move evolution coding style from p1.degree=array, p1.amp=float
# to p1>>pluck(degree=[3,1,2,5], amp=[3,3,3,3])


TODO  Live coding practice:
# explore FoxDot completely (instruments, patterns)
# find
# live coding streams to analyze the results of this experiment
# write code snippets and documentation for the usage of evolve method
# paper


p1 >> pads(degree=[4,6,7,2], dur=4, amp=0.5, chop=2, delay=0.5)
p2 >> pads(degree=[3,1,2,5], dur=0.5, amp=0.7, chop=8, delay=0.2)
evolve(p1, p2, stepSize = 0.2, skipGenerations= 2, evolutions = 20, interpolate = linvar)

@nextBar
def autoEvolution():
	p1>>pads(degree=[3.6,5.8,7,2.4],dur=linvar([4.6,4.4],17.6),amp=linvar([0,0],17.6),chop=linvar([2.4,2.4],17.6),delay=linvar([0.8,0.8],17.6))
autoEvolution()

p1 >> pads([4,6,7,2], dur= [1,1,3,1], amp=0.5, chop=2, delay=0.5)
p2 >> pads([5,6,7,2], dur= [1,2,3,4], amp=0.7, chop=8, delay=0.2)
evolve(p1, p2, stepSize = 0.2, skipGenerations= 5, lifetime = 2000, evolutions = 20, interpolate = expvar)

@nextBar
def autoEvolution():
	p1>>pads(degree=[4,6,6.8,2],dur=expvar([0.8,0.6],2.4),amp=expvar([0.8,0.6],2.4),chop=expvar([2.4,2.8],2.4),delay=expvar([0.2,0],2.4))
autoEvolution()

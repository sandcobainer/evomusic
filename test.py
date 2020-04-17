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


p1 >> pads(degree=[4,6,7,2], dur=4, amp=0.5, room=1, slide=1, slidedelay=0.5, chop=2, delay=0.5)
p2 >> pads(degree=[3,1,2,5], dur=0.5, amp=0.7, room=1, slide=0.2, slidedelay=0.2, chop=8, delay=0.2)
evolve(p1, p2, stepSize = 1, updateFreq = 1, skipGenerations = 300, evolutions = 3000, mutationAmount = 0.25, crossoverAmount = 0.7)

@nextBar
def autoEvolution():
	p1>>pads(degree=[3,2,2,5],dur=[1],amp=[1],room=[1],slide=[1],slidedelay=[1],chop=[8],delay=[1])
autoEvolution()

@nextBar
def autoEvolution():
	p1>>pads(degree=[4,6,7,2],dur=[4],amp=[1],room=[1],slide=[1],slidedelay=[1],chop=[2],delay=[1])
autoEvolution()

@nextBar
def autoEvolution():
	p1>>pads(degree=[4,6,7,2],dur=[4],amp=[0],room=[1],slide=[1],slidedelay=[0],chop=[2],delay=[0])
autoEvolution()

@nextBar
def autoEvolution():
	p1>>pads(degree=[4,6,7,2],dur=[4],amp=[1],room=[1],slide=[1],slidedelay=[1],chop=[2],delay=[1])
autoEvolution()

@nextBar
def autoEvolution():
	p1>>pads(degree=[4,6,7,2],dur=[4],amp=[1],room=[1],slide=[1],slidedelay=[1],chop=[2],delay=[1])
autoEvolution()

@nextBar
def autoEvolution():
	p1>>pads(degree=[4,6,7,2],dur=[4],amp=[1],room=[1],slide=[1],slidedelay=[0],chop=[2],delay=[0])
	p1>>pads(degree=[3,0,2,5],dur=[0],amp=[0],room=[2],slide=[0],slidedelay=[0],chop=[8],delay=[1])

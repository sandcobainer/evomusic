from .Patterns import Pattern, PGroup, asStream
I   = PGroup(0, 2, 4)
II  = PGroup(1, 3, 5)
III = PGroup(2, 4,-1)
IV  = PGroup(3, 5, 0)
V   = PGroup(4,-1, 1)
VI  = PGroup(5, 0, 2)
VII = PGroup(-1,1, 3)
I7   = PGroup(I).concat(6)
II7  = PGroup(II).concat(7)
III7 = PGroup(III).concat(8)
IV7  = PGroup(IV).concat(9)
V7   = PGroup(V).concat(10)
VI7  = PGroup(VI).concat(11)
VII7 = PGroup(VII).concat(12)
Clock.bpm = 101
Samples.addPath('/Users/a2012/Downloads')

print(Samples)
print(SynthDefs)

# setup a chord Pattern
chords= (I, VI, V)

#setup a melody
n1>>nylon(chords)



#use bristolrights.wav, HarpAscend.wav, klank, play (maybe nylon, pluck)

b1>>loop('HarpAscend.wav',dur=4,chop=3,slide=0.25)
b2>>loop('HarpAscend.wav',dur=4,chop=3,slide=0)
evolve(b1, stepSize=0.25, population=3, distance=4)

@nextBar
def evolve_b1():
	b1>>loop('HarpAscend.wav',dur=[4.00],chop=[3],slide=[0.25])
evolve_b1()
## Novelty search around b1

@nextBar
def evolve_b1_b2():
	b1>>loop('HarpAscend.wav',dur=[4.00],chop=[3],slide=[0.25])
evolve_b1_b2()
# Evolving from b1 to b2



j1>>pluck(degree=[15,0,3,-1],amp=[0.40,0.50])
j2>>pluck(degree=[4,1,4,1], amp=[1,0.5])
evolve(j1,j2,stepSize=0.1)

@nextBar
def evolve_j1_j2():
	j1>>pluck(degree=[10,-1,3,-1],amp=[0.20,0.50])
	j1>>pluck(degree=[14,-1,3,-2],amp=[0.10,0.50])
### Evolving from j1 to j2

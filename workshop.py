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
Clock.bpm = 105
Samples.addPath('/Users/a2012/Downloads')
# setup a chord Pattern
chords= (I, VI, V)

# source musical simple using a wav sample
b1>>loop('HarpAscend.wav',dur=0.5,chop=0.2,slide=0.4) # source

b2>>loop('HarpAscend.wav',dur=4,chop=5,slide=4) # destination

# FoxDot native interpolations with timevars : linvar, sinvar, expvar
b1>>loop('HarpAscend.wav',dur=linvar([0.5,4],64),chop=linvar([0.2,5],64),slide=linvar([0.4,4],64))


# evomusic directed evolution with multiple configs
b1>>loop('HarpAscend.wav',dur=0.5,chop=0.2,slide=0.4)
b2>>loop('HarpAscend.wav',dur=4,chop=5,slide=4)
evolve(b1, b2, stepSize=0.25, lifetime=1, population=5, skipGenerations=50, mutationAmount=0.4, crossooverAmount=0.01, evolutions=50)

@nextBar
def evolve_b1_b2():
	b1>>loop('HarpAscend.wav',dur=[4.00],chop=[5],slide=[4.00])
evolve_b1_b2()
#|### Evolving from b1 to b2

@nextBar
def evolve_b1_b2():
	b1>>loop('HarpAscend.wav',dur=[4.00],chop=[5],slide=[4.00])
evolve_b1_b2()
#|### Evolving from b1 to b2












p1>>pluck()








b2>>loop('HarpAscend.wav',dur=4,chop=3,slide=1)
evolve(b2, stepSize=0.25, lifetime=2, population=20, mutationAmount = 0.4, crossooverAmount = 0.2, evolutions=5)

@nextBar
def evolve_b2():
	b2>>loop('HarpAscend.wav',dur=[4.00],chop=[4],slide=[1.00])
evolve_b2()
## Evolving from b2

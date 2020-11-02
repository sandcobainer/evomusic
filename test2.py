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
chords = (VI)

#

j1>>pluck(degree=[12,0,3,-1],chop=1,tremolo=0.20)
j2>>pluck(degree=[16,0,1,-1],chop=[4],tremolo=[0.09])
evolve(j1, j2, stepSize=0.01, lifetime = 2, evolutions=4, skipGenerations=2, population=3)

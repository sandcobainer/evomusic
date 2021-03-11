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


s1>>bass(vib=[0.2],echo=[0.40],chop=[0.5],room=1)
s2>>bass(vib=[0.9],echo=[0.2],chop=[1],room=2)
evolve(s1, s2, evolutions=50, lifetime=2, mutationAmount=0.5)

@nextBar
def evolve_s1_s2():
	s1>>bass(vib=[0.10],echo=[0.20],chop=[0],room=[0.50])
    s1.chop=1
    s1.amp=[0,0,0,2]
evolve_s1_s2()
############ Evolving from s1 to s2

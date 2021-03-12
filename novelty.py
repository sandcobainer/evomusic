# evolution:1
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


s1>>pluck(vib=[0.2],echo=[0.40],chop=[0.5],room=1,amp=0.9)








s2>>pluck(vib=[0.9],echo=[0.2],chop=[1],room=2,amp=0.5)
evolve(s2, evolutions=50, lifetime=2, mutationAmount=0.5)

@nextBar
def evolve_s2():
	s2>>pluck(vib=[0.80],echo=[0.10],chop=[1],room=[0.50],amp=[1.00])
evolve_s2()

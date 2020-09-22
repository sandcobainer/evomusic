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

p1>>pluck(room=0.1, amp=0.2,lpf=500)
p2>>pluck(room=0.8, amp=0.5,lpf=5000)
evolve(p1,p2,lifetime=4,stepSize=0.2, population=5, skipGenerations=30)

@nextBar
def evolve_p1_p2():
	p1>>pluck(room=[0.80],amp=[0.40],lpf=[6240.60])
	p1.amp=0.5
	p1.degree=chords
	p1.sus=8
	p1.dur=8
evolve_p1_p2()
###### Evolving from p1 to p2







k1>>klank(room=0.2, slide=0.6, tremolo=0.5, echo=0.4, bend = 0.5, spin = 4)

k2>>klank(room=1, slide=0.1, tremolo=0, echo=0, bend = 2, spin =18)
evolve(k1,k2, stepSize=0.2, mutationAmount=0.4, evolutions=3000, skipGenerations=50, lifetime=2)

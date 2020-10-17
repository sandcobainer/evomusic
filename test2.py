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

p1 >> pads(degree= [1,5], amp=0.2, lpf=5000)
p2 >> pads(degree= [2,3], amp=0.9, lpf=200)
evolve(p1, p2, evolutions=3000, skipGenerations=300, population=40, stepSize=0.1, mutationAmount=0.2)

k1>>klank(room=0.2, slide=0.6, tremolo=0.5, echo=0.4, bend = 0.5, spin = 4)

k2>>klank(room=1, slide=0.1, tremolo=0, echo=0, bend = 2, spin =18)
evolve(k1,k2, stepSize=0.2, mutationAmount=0.4, evolutions=3000, skipGenerations=50, lifetime=2)

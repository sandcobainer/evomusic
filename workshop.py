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



s1>>scatter(vib=[0.2],echo=[0.40],chop=[0.5],room=1)




p1>>nylon()

s1.stop()

g1.amp=0.3

g1>>space()

h1.degree='--(=-)-'
h1.amp=0.4






k1.amp=linvar([0.4,0.7],16)
k1>>play(sample=2, tremolo=1, echo=0.2)
k1.degree='--(=-)-'








w1>>play('.....',amp=0.1,spin=0.2,sample=2)



k1.solo()

w1.solo()

c1>>creep(amp=0.2, degree=[5,0,1,0,3,0], dur=[4,1,1,1,1])




c1.solo()

r1>>ripple()


k1>>klank()



q1>>play()






b1>>sawbass()

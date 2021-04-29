Samples.addPath('/Users/a2012/Downloads')

l1>>loop('WindChimes.wav',amp, striat)

# Limitation: no Prand, P, strings, interpolate

d1>>bass(degree=[0,2,[4,-4,-2],2],amp=0.7,room=0.2)

d1.stop()

d2>>marimba(degree=[0,2,6,8,4,0], oct=6, dur=16, chop=32, amp=0.6)

p1>>creep(degree=PRand([1,2,3,5,6,8,6,5,3]), dur=PDur(5,8), amp=linvar([0,1],8),.. )

p1>>creep(degree=[1,2,3,5,6,8,6,5,3], dur=[0.5,1,1], amp=0.3)
evolve(p1)



print(SynthDefs)

p1>>pluck([4,1,5], pan=linvar([-1,1],4),dur=PDur(8,12), amp=1)

p1.stop()


d2.stop()

l2.solo()

d1 >> play('------[---]')

d2 >> play('x---[*]')

whack = linvar([4,12],8)

l1 >> play('<     hh  [hhh]><  *  *  >< f  >', rate=var([1,2],[7,1]), dur=2)

l2 >> pluck([4,5,6], amp=0.8, dur=1/4)

l2.degree=whack


l3 >> marimba(degree=PRand([0,1,2,3,4,5,6,7]),dur=PDur(2,3), pan=expvar([-1,1],4), amp=.1).every(4,'stutter')

k1>>play('(-x)=(-o)-',sample=4,amp=0.03,bpm=60).every(8, "reverse").every(8,"stutter")



@nextBar
def evolve_d1_d2():
    d1>>space(degree=[0,2,4],oct=[3],dur=[12.00],chop=[4],amp=[0.6])
evolve_d1_d2()

l2>>varsaw(d1.degree.accompany(),amp=.4,dur=PDur(3,16)*2)

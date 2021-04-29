"""
evomusic Demonstration:
1. Directed evolution
2. Novelty Search
"""
# FoxDot Player

s1>>orient(degree=[1,3,6,7,8,10,11,12,14,15,17,18],dur=1,room=20,amp=0.2,formant=10)

s2>>arpy(degree=[1,3,5,7,9,10],dur=4,room=20,amp=0.4)
s3>>arpy(degree=[1,3,5,7,9,10],dur=1,room=2,amp=0.8)
evolve(s2,s3)



#s3>>arpy(degree=(1,3,5,7,9,10,11),dur=2,room=20)

s4>>pads(degree=[1,5,7],dur=1,room=20,amp=1)

#s6>>pads(degree=[7,2,5],dur=1,room=20,amp=1)

s2.stop()
s3.stop()
s4.stop()

s6>>pads(degree=[7,2,5],dur=1,room=20,amp=0.01) -> [7,2,5,1,20,0.01]



s7>>pads(degree=[1,1,1,1],dur=1/4,room=20,amp=linvar([0.9,2.5],8)) ->


s2>>marimba(degree=[8,0,-8],vib=1,room=2,amp=0.25)
s2.stop()

p1>>pluck(degree=[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9],dur=[1/20], room=1,)

d1>>play('X-o-', sample=4, amp=0.8)
evolve(d1)

p1>>pluck(room=0.1, amp=0.2,lpf=500)
p2>>pluck(room=0.8, amp=0.5,lpf=5000)
evolve(p1,p2,lifetime=5000,stepSize=0.1,interpolate=linvar)

@nextBar
def evolve_p1_p2():
	p1>>pluck(room=linvar([0.9,0.7000000000000001],1),amp=linvar([0.6000000000000001,0.4],1),lpf=linvar([4211.1,4899.5],1))
evolve_p1_p2()
#|########## Evolving from p1 to p2

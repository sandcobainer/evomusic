p1>>pluck(room=0.1, amp=0.2,lpf=500)
p2>>pluck(room=0.8, amp=0.5,lpf=5000)
evolve(p1,p2,lifetime=8000,stepSize=0.1,interpolate=linvar)

@nextBar
def evolve_p1_p2():
	p1>>pluck(room=linvar([1.00,0.50],1),amp=linvar([0.60,0.40],1),lpf=linvar([2041.00,4958.60],1))
	p1.degree=[5,6,12]
evolve_p1_p2()
######## Evolving from p1 to p2

@nextBar
def evolve_p1_p2():
	p1>>pluck(room=linvar([0.60,0.50],1),amp=linvar([0.40,0.40],1),lpf=linvar([4857.50,5347.20],1))
	p1.degree=[3,4,1,2]
	p1.chop=2
evolve_p1_p2()
####### Evolving from p1 to p2

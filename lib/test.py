p1>>pluck(amp=0.2)
p2>>pluck(amp=0.5)
evolve(p1,p2)

@nextBar
def evolve_p1_p2():
	p1>>pluck(amp=[0.55])
evolve_p1_p2()
########## Evolving from p1 to p2
@nextBar
def evolve_p1_p2():
	p1>>pluck(amp=[0.54])
evolve_p1_p2()
########## Evolving from p1 to p2

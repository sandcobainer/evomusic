

s1>>pluck(vib=[0.2],echo=[0.40],chop=[0.5],room=1,amp=0.9)
s2>>pluck(vib=[0.9],echo=[0.2],chop=[1],room=2,amp=0.5)
evolve(s1, s2, evolutions=50, lifetime=2, mutationAmount=0.5)

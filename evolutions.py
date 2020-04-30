# LIVE CODING EVOLUTIONS USING GENETIC ALGORITHMS

Clock.bpm=100; Scale.default="minor"

p1 >> pulse(dur=1, lpf=600, lpr=0.2, crush=8,sample = 4)
p2 >> pulse(dur=2, lpf=5000, lpr=0.7, crush=2, sample=2)
evolve(p1,p2, skipGenerations = 10, evolutions = 1000, stepSize = 0.25, interpolate=linvar)

@nextBar
def autoEvolution():
	p1>>pulse(dur=linvar([1,1],1),lpf=linvar([600,600.25],1),lpr=linvar([0.5,0.75],1),crush=linvar([8.25,8],1),sample=[4.5])
	pa + (4)
autoEvolution()





synthlist = [i for i in SynthDefs][12:]

p1 >> blip(degree=[4,6,7,2], dur=[4,4,4], amp=0.5, chop=2, delay=0.5)
p2 >> blip(degree=[4,6,7,2], dur=[4,4,4], amp=0.7, chop=8, delay=0.2)
evolve(p1, p2, stepSize = 0.2, skipGenerations= 50, evolutions = 2000, interpolate = linvar)

@nextBar
def autoEvolution():
	p1>>blip(degree=[3.8,6,6.8,2.2],dur=[4,4.6,5.8],amp=linvar([0.4,0.4],14.399999999999999),chop=linvar([8.6,7.8],14.399999999999999),delay=linvar([0.2,0.6],14.399999999999999))
autoEvolution()

p1.changeSynth(synthlist)



m1 >> marimba ([0,2,4,7] ,dur=2)
m2 >> marimba ([5,2,7,2] ,dur=2)
evolve(m1,m2)













evolve(
p1, p2,         // source and destination genomes
stepSize = 1,    // quantization steps for values
lifetime = 2000,  // Generation update time in ms
skipGenerations = 200, // play every 200th gen
evolutions = 3000,     // number of evolutions
mutationAmount = 0.25, // probability of mutation
crossoverAmount = 0.7  // probability of crossover
interpolate = linvar   // type of interpolation:
                       // linear, exp, sin, none)

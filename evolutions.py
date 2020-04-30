# LIVE CODING EVOLUTIONS USING GENETIC ALGORITHMS

Clock.bpm=100; Scale.default="major";


# evolve parameters for reference
evolve(
p1, p2,         // source and destination genomes
stepSize = 1,    // quantization steps for values
lifetime = 2000,  // Generation update time in ms
skipGenerations = 200, // play every 200th gen
mutationAmount = 0.25, // probability of mutation
crossoverAmount = 0.7  // probability of crossover
interpolate = linvar   // type of interpolation:
                       // linear, exp, sin, none)

m1 >> marimba (degree=[4,6,2],room = 0.5, lpf = 500, hpf = 800, delay = 0.2, amp = 0.6)
m2 >> marimba (degree=[2,5,6], room = 0.8, lpf = 600, hpf = 900, delay = 0.4, amp =0.9)
evolve(m1,m2,stepSize = 0.1, skipGenerations = 10, evolutions=500,interpolate = linvar)


k1 >> play('x x ', amp = 0.7)

p1>>pulse(degree=[6,2,4,2],dur=[4],lpf=[600],lpr=[-0.2],crush=[8], room = 0.2)
p2>>pulse(degree=[5,2,3,2],dur=[4],lpf=[600],lpr=[-0.2],crush=[8], room = 0.9)

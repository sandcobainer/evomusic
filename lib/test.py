p1>>pluck(room=0.1, amp=0.2,lpf=500)
p2>>pluck(room=0.8, amp=0.5,lpf=5000)
evolve(p1,p2,lifetime=5000)


FoxDot Quick Cheatsheet:

Player objects should have a variable name of type "p1" (alphabet and a number)
Example:
p1>>synth(at1=val1, atr2=[val2.1, val2.2, val2.3])

# list of player objects:
['loop', 'stretch', 'play1', 'play2', 'audioin', 'noise', 'dab', 'varsaw', 'lazer', 'growl', 'bass',
 'dirt', 'crunch', 'rave', 'scatter', 'charm', 'bell',
'gong', 'soprano', 'dub', 'viola', 'scratch', 'klank', 'feel', 'glass', 'soft', 'quin', 'pluck',
'spark', 'blip', 'ripple', 'creep', 'orient', 'zap', 'marimba','fuzz', 'bug', 'pulse', 'saw',
 'snick', 'twang', 'karp', 'arpy', 'nylon', 'donk', 'squish', 'swell', 'razz', 'sitar', 'star',
 'jbass', 'sawbass', 'prophet', 'pads','pasha', 'ambi', 'space', 'keys', 'dbass', 'sinepad']

# list of player attributes:
['degree':[-16,16],'oct':[0,8],'dur':[0,64],'delay': [0,8],'blur':[0,64],'amplify':[0,1],
'scale':[0,0,'string'],'bpm':[0,300],'sample':[0,16],'sus':[0,64],'fmod':[0,64],'pan':[-1,1],'amp':[0.01,1],
'midinote':[0,127],'vib':[0,32],'vibdepth':[0, 1, 'float'],'slide':[-4,4],'slidedelay':[0,1],'slidefrom':[-4,4],'glide':[-12,12],
'glidedelay':[0,1],'bend':[-4,4],'benddelay':[0,1],'coarse':[0,64],'pshift':[-24,24],'hpf':[0,16000],'hpr':[0,1],
'lpf':[0,16000],'lpr':[0,1],'bpf':[0,16000],'bpr':[0,1],'bpnoise':[0,20000, 'float'],'chop':[0,64],'striate':[0,500],
'tremolo':[0,64],'echo':[0,64],'echotime':[0,8],'spin':[0,32],'cut':[0,1],'room':[0,1],'mix':[0,1],
'formant':[1,7],'shape':[0,1],'drive':[0,1],'dist':[0,1, 'float'],'crush':[0,32],'bits':[0,8]

d1>>play('x-o-')

'!': Yeah!
'#': Crash
'$': Beatbox
'%': Noise bursts
'&': Chime
'*': Clap
'+': Clicks
'-': Hi hat closed
'/': Reverse sounds
'1': Vocals (One)
'2': Vocals (Two)
'3': Vocals (Three)
'4': Vocals (Four)
':': Hi-hats
'=': Hi hat open
'@': Gameboy noise
'A': Gameboy kick drum
'B': Short saw
'C': Choral
'D': Dirty snare
'E': Ringing percussion
'F': Trumpet stabs
'G': Ambient stabs
'H': Clap
'I': Rock snare
'J': Ambient stabs
'K': Percussive hits
'L': Noisy percussive hits
'M': Acoustic toms
'N': Gameboy SFX
'O': Heavy snare
'P': Tabla long
'Q': Electronic stabs
'R': Metallic
'S': Tamborine
'T': Cowbell
'U': Misc. Fx
'V': Hard kick
'W': Distorted
'X': Heavy kick
'Y': High buzz
'Z': Loud stabs
'\\': Lazer
'^': Donk
'a': Gameboy hihat
'b': Noisy beep
'c': Voice/string
'd': Woodblock
'e': Electronic Cowbell
'f': Pops
'g': Ominous
'h': Finger snaps
'i': Jungle snare
'j': Whines
'k': Wood shaker
'l': Robot noise
'm': 808 toms
'n': Noise


p1>>pluck(degree=[], amp=[], pan=[], room=[], vib=[])

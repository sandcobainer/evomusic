const parse = require ("./parser")
const evolver_1 = require("./ga")
//evolve(p1, p2, auto =true, stepSize = 0.25,   interpolate=true))
// p2>>pluck(degree=[2,5,8],amp=[1,1,1,1],dur=[3,4,3,2])

let code = `
p1>>pluck(degree=[4,6,7],amp=[2,4,5,1], delay=[3,3,2])
p2>>pluck(degree=[3,1,2], amp = [2,3,4,2], delay=[2,1,1])
evolve(p1, p2, auto = true, stepSize = 0.125, updateFreq = 100, evolutions = 1000)
`

let lines =code.split('\n');
let players = []
let func = {}
lines.forEach((line, i) => {
    line = line.replace(/\s/g, '');
    if (line.length > 0) {
    let result = parse(line)
    if(result.hasOwnProperty('pname'))
        players.push(result)
    if(result.hasOwnProperty('function'))
        func = result
    }
});


function cleanPattributes(player_attributes) {
    let pattributes = player_attributes[0].attributes
    let pats = {}
    pattributes.forEach((pat) => {
        let k = Object.keys(pat)[0]
        pats[k] = pat[k]
    });
    return pats
}

function cleanEvolverParams(options) {
    evo = {}
    options.forEach((o) => {
        let k = Object.keys(o)[0]
        evo[k] = o[k]
    });
    return evo
}
let start = cleanPattributes(players.filter( (p) => p.pname == func.source))
let end = cleanPattributes(players.filter( (p) => p.pname == func.dest))
let options = cleanEvolverParams(func.options)
let evolver = new evolver_1.Evolver(start, end, options)
let results = evolve(options)

console.log(end, results[9])
function evolve( options) {
    let results=[]
    for( let i = 0; i < options.evolutions ; i++ ) {
        let e = evolver.ga.evolve()
        if (i % options.updateFreq == 0)
        {
            let result = e.best()
            Object.keys(result).forEach((r) => {
                for (var i in result[r]) {
                    result[r][i] = Math.round(result[r][i] / options.stepSize) * options.stepSize
                }
            })
            results.push(result)
        }
    }
    return results
}

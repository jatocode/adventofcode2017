const fs = require('fs');
const args = process.argv.slice(2);

function read(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

var numticks = args[1]?parseInt(args[1]):1000;

read(args[0], function (data) {
    var lines = data.split('\n');
    var particles = [];
    for (let pid=0;pid<lines.length;pid++) {
        const line = lines[pid];
        if(line.length == 0) continue;
        var match = line.match(/p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>/);

        var p = {x:parseInt(match[1]), y:parseInt(match[2]), z:parseInt(match[3])};
        var v = {x:parseInt(match[4]), y:parseInt(match[5]), z:parseInt(match[6])};
        var a = {x:parseInt(match[7]), y:parseInt(match[8]), z:parseInt(match[9])};

        particles.push({p,v,a});
    }

    var zbuf = [];
    var zcopy;
    for(let tick=0; tick<numticks; tick++) {
        for(let i=0;i<particles.length;i++) {
            particles[i].v.x += particles[i].a.x;
            particles[i].v.y += particles[i].a.y;
            particles[i].v.z += particles[i].a.z;

            particles[i].p.x += particles[i].v.x;
            particles[i].p.y += particles[i].v.y;
            particles[i].p.z += particles[i].v.z;

            const dist = Math.abs(particles[i].p.x) + Math.abs(particles[i].p.y) + Math.abs(particles[i].p.z);
            zbuf[i] = {i:i, d:dist};
            zcopy = zbuf.slice(0, zbuf.length);
            zcopy.sort((a,b) => { return a.d - b.d });
        }
        if(tick % 20 == 0) console.log('@ tick: ' + tick + ' : ' + zcopy[0].i + ', dist = ' + zcopy[0].d);
    }
    console.log('Closest to <0,0,0> after ' + numticks + ' are ' + zcopy[0].i);
});

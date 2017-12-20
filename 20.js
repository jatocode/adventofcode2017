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
//    del1(particles);  // OBS, går inte att köra båda på rad, pga particles blir uppdaterad
    del2(particles); 
});

function del2(particles) {
    for(let tick=0; tick<numticks; tick++) {
        // Update
        for(let i=0;i<particles.length;i++) {
            particles[i].v.x += particles[i].a.x;
            particles[i].v.y += particles[i].a.y;
            particles[i].v.z += particles[i].a.z;

            particles[i].p.x += particles[i].v.x;
            particles[i].p.y += particles[i].v.y;
            particles[i].p.z += particles[i].v.z;

        }
        // Collision check
        for(let i=0;i<particles.length;i++) {
            var collisions = new Set();
            const p = particles[i].p;
            for(let j=0;j<particles.length;j++) {
                if(j == i) continue;
                const p2 = particles[j].p;
                if(p.x == p2.x && p.y == p2.y && p.z == p2.z) {
                    collisions.add(i);
                    collisions.add(j);
                }
            }

            // Hitta på ett bättre sätt att ta bort element!!
            for(c of Array.from(collisions)) {
                particles[c] = undefined;
            }
            particles = particles.filter((x) => x);
        }
        if(tick % 20 == 0) console.log('@ tick: ' + tick + ' particles left = ' + particles.length);
    }
};

function del1(particles) {
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
};

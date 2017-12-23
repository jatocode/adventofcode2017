var c = document.getElementById('advent-canvas');
var ctx = c.getContext("2d");

fetch('/aoc2017/20-input')
    .then(response => response.text())
    .then(text => run20(text));

var numticks = 5000;

function run20(data) {
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
    //del1(particles);  // OBS, går inte att köra båda på rad, pga particles blir uppdaterad
    drawdel2(particles); 
};

function drawdel2(particles) {
    ctx.clearRect(0, 0, c.width, c.height);
    del2(particles);
    if(numticks-- > 0) setTimeout(function() { drawdel2(particles); }, 200);
}

function del2(particles) {
    // Update
    for(let i=0;i<particles.length;i++) {
        if(!particles[i]) continue;
        print(particles[i].p.x, particles[i].p.y, 2, 'white');
        particles[i].v.x += particles[i].a.x;
        particles[i].v.y += particles[i].a.y;
        particles[i].v.z += particles[i].a.z;

        particles[i].p.x += particles[i].v.x;
        particles[i].p.y += particles[i].v.y;
        particles[i].p.z += particles[i].v.z;

    }
    // Collision check
    for(let i=0;i<particles.length;i++) {
        if(!particles[i]) continue;
        var collisions = new Set();
        const p = particles[i].p;
        for(let j=0;j<particles.length;j++) {
            if(!particles[j] || j == i) continue;
            const p2 = particles[j].p;
            if(p.x == p2.x && p.y == p2.y && p.z == p2.z) {
                print(particles[i].p.x, particles[i].p.y, 2, 'red');
                collisions.add(i);
                collisions.add(j);
            }
        }

        for(c of Array.from(collisions)) {
            particles[c] = undefined;
        }
    }
    particles = particles.filter((x) => x);
}

function del1(particles) {
    var zbuf = [];
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
        }
    }

    zbuf.sort((a,b) => { return a.d - b.d });
    console.log('Closest to <0,0,0> after ' + numticks + ' are ' + zbuf[0].i);
};

function print(x,y, size, mark) {
    ctx.fillStyle = mark;
    ctx.fillRect(x,y,size,size);
    ctx.stroke();
}

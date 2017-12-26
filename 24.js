const fs = require('fs');
const args = process.argv.slice(2);

function read(file, callback) {
    if(!file) file = 'data/24-example';
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

read(args[0], function (data) {
    var lines = data.split('\n');
    var map = {};
    for (let i=0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length == 0) continue;
        const match = line.match(/(\d+)\/(\d+)/);
        map[i] = { port:[match[1],match[2]],
                   prev: -1,
                   ts: +match[1] + +match[2] };
    }
    //console.log(map);
    for(p of Object.keys(map)) {
        if(map[p].port.indexOf('0') != -1) {
            var path = bfs(p, map, (x) => console.log(x));
            console.log(map);
        }
    }

});

function bfs(start, ports, callback) {
    var queue = [start];
    var n;
    var visited = [];
    const numports = Object.keys(ports).length;

    while (queue.length > 0) {
        n = queue.shift();
        //callback(ports[n]);

        if (visited.indexOf(n) != -1) {
            continue;
        }
        visited.push(n);

        for (let i = 0; i < numports; i++) {
            if(visited.indexOf(i) == -1) {
                const port0 = ports[i].port[0];
                const port1 = ports[i].port[1];
                if(port0 == 0 || port1 == 0) continue;
                if(ports[n].port.indexOf(port0) != -1 ||
                    ports[n].port.indexOf(port1) != -1) {
                        ports[i].prev = n;
                        ports[i].ts += ports[n].ts;
                        queue.push(i);
                        visited.push(n);
                }
            }
        }
    }
};


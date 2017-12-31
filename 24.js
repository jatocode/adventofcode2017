const fs = require('fs');
const args = process.argv.slice(2);

function read(file, callback) {
    if (!file) file = 'data/24-example';
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

read(args[0], function (data) {
    var lines = data.split('\n');
    let components = [];
    var map = {};
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length == 0) continue;
        const match = line.match(/(\d+)\/(\d+)/);
        map[i] = {
            port: [match[1], match[2]],
            ts: +match[1] + +match[2]
        };
        let comp = {a:+match[1], b:+match[2]};
        components.push(comp);
    }

    let bridges = byggbryggor({ strength: 0, path: [] }, components, 0);
    let sorterat = bridges.sort((a,b) => b.strength - a.strength);
    console.log('Starkaste bryggan: ' + sorterat[0].strength);
});

function byggbryggor(bridge, components, port, alla) {
    let bryggor = [];

    for (let i = 0; i < components.length; i++) {
        if (components[i].a == port || components[i].b == port) {
            let nybrygga = {
                strength: bridge.strength + components[i].a + components[i].b,
                path: bridge.path.concat(i)
            };

            bryggor.push(nybrygga);

            let komponenterkvar = components.slice();
            komponenterkvar.splice(i, 1);

            let nyport = andraport(components[i], port);

            bryggor = bryggor.concat(byggbryggor(nybrygga, komponenterkvar, nyport));
        }
    }

    return bryggor;
}

function andraport(component, port) {
    if(component.a == port) return component.b;
    return component.a;
}

function bfs(start, ports) {
    let queue = [start];
    let n;
    let visited = [];
    const numports = Object.keys(ports).length;
    let came_from = {};
    came_from[start] = -1;
    let strength = ports[start].ts;

    while (queue.length > 0) {
        n = queue.shift();

        if (visited.indexOf(n) != -1) {
            continue;
        }
        visited.push(n);

        for (let i = 0; i < numports; i++) {
            if (visited.indexOf(i) == -1) {
                const port0 = ports[i].port[0];
                const port1 = ports[i].port[1];
                if (port0 == 0 || port1 == 0) continue;
                if (n != i && (ports[n].port.indexOf(port0) != -1 ||
                    ports[n].port.indexOf(port1) != -1)) {
                    queue.push(i);
                    came_from[i] = n;
                }
            }
        }
    }
    return { path: Object.keys(came_from), came_from, visited };
};


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
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length == 0) continue;
        const match = line.match(/(\d+)\/(\d+)/);
        let comp = {i:i, a:+match[1], b:+match[2]};
        components.push(comp);
    }

    let bridges = byggbryggor({ strength: 0, path: [], length: 0 }, components, 0);
    let sorterat = bridges.sort((a,b) => b.strength - a.strength);
    console.log('Del 1, starkaste bryggan: ' + sorterat[0].strength);

    // Del 2, hitta längsta bryggorna
    sorterat = bridges.sort((a,b) => b.length - a.length);
    // Hitta max
    let maxlen = sorterat[0].length;
    // Filtrera ut med samma max och sortera igen
    sorterat = bridges.filter(a => a.length == maxlen).sort((a,b) => b.strength - a.strength);
    console.log('Del 2, längsta bryggan: ' + sorterat[0].length + ' har styrkan: ' + sorterat[0].strength);

});

function byggbryggor(bridge, components, port) {
    let bryggor = [];

    for (let i = 0; i < components.length; i++) {
        if (components[i].a == port || components[i].b == port) {
            let nybrygga = {
                strength: bridge.strength + components[i].a + components[i].b,
                path: bridge.path.concat(components[i].i),
            };
            nybrygga.length = nybrygga.path.length;

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

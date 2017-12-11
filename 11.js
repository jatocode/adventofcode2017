var fs = require('fs');
var args = process.argv.slice(2);

function read(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

read(args[0], function (data) {
    var lines = data.split('\n');
    for(l of lines) {
        if(l.length == 0) continue;
        turns = l.split(',');
        var path = [];
        const dir = ['se','ne','n','nw','sw','s'];

        var hex = Hex(0,0);
        for(t of turns) {
            hex = hex_neighbor(hex, dir.indexOf(t));
            path.push(hex);
        }
        var boy = path[path.length-1];
        console.log('Steg till pojken: ' + hex_distance(Hex(0,0), boy));

        // Steg 2, leta upp längsta kedjan
        var max = Math.max(...path.map((hex) => { return hex_distance(Hex(0,0), hex); }));
        console.log('Längst bort var: ' + max);
    }
});



// Lärde mig allt från: https://www.redblobgames.com/grids/hexagons/

var axial_directions = [
    Hex(+1,  0), Hex(+1, -1), Hex( 0, -1),
    Hex(-1,  0), Hex(-1, +1), Hex( 0, +1)
];

function hex_direction(direction) {
    var hd = axial_directions[direction];
    return hd;
}

function hex_neighbor(hex, direction) {
    var dir = hex_direction(direction);
    var q = hex.q() + dir.q();
    var r = hex.r() + dir.r();
    return Hex(q, r);
}

function hex_distance(a, b) {
    return (Math.abs(a.q() - b.q()) + Math.abs(a.q() + a.r() - b.q() - b.r()) + Math.abs(a.r() - b.r())) / 2;
}

function Hex(q, r) {
    var n = { qr: [q,r],
        q: function() { return this.qr[0]; },
        r: function() { return this.qr[1]; },
    };
    return n;
}

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
//        console.log(turns);
        var path = [];
        var q = 0;
        var r = 0;
        var hex = Hex(q,r);
        for(t of turns) {
            var dir = 0;
            switch(t) {
                case 'n':  dir = 2; break;
                case 'ne': dir = 1; break;
                case 'se': dir = 0; break;
                case 's':  dir = 5; break;
                case 'sw': dir = 4; break;
                case 'nw': dir = 3; break;
                default: console.log(t); break;
            }
            hex = hex_neighbor(hex, dir);
            path.push(hex);
        }
        var boy = path[path.length-1];
        console.log('Steps to boy: ' + hex_distance(Hex(0,0), boy));
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

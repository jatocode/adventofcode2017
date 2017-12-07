var fs = require('fs');
var args = process.argv.slice(2);

function read(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

var towerlist = [];
read(args[0], function(data) {
    var lines = data.split('\n');
    for(let l of lines) {
        if(l.length == 0) continue;
        var tower = l.match(/(.*)\s\((\d*)\)(\s*->\s*(.*))?/);
        var above = tower[4]?tower[4].split(', '):[];
        var t = { name: tower[1],
                  weight: tower[2],
                  below: [],
                  above: above,
        };
        towerlist.push(t);
    }

    var program = createTree(towerlist);

    for(p of program) {
        if(p.below.length == 0) {
            console.log('The bottom is ' + p.name);
        }
    }

});

function createTree(list) {
    var tree = [];
    // Gör en lookuptabell
    var map = {};
    for(l of list) {
        map[l.name] = l;
    }
 
    // Lägg upp skiten i trädet
    for(t of list) {
        for(a of t.above) {
            map[a].below.push(t.name);
        }
        tree.push(map[t.name]);
    }
    return tree;
}

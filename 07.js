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

var map = {};    // Global lookup, får duga
var structure;
read(args[0], function (data) {
    var towerlist = [];
    var lines = data.split('\n');
    for (let l of lines) {
        if (l.length == 0) continue;
        var tower = l.match(/(.*)\s\((\d*)\)(\s*->\s*(.*))?/);
        var above = tower[4] ? tower[4].split(', ') : [];
        var t = {
            name: tower[1],
            weight: parseInt(tower[2]),
            tw: 0,
            below: null,
            above: above,
        };
        towerlist.push(t);
        map[t.name] = t;
    }

    structure = createTree(towerlist);

    // Del 1
    let root = structure.find(p => p.below == null);
    console.log('Del 1. Längst ner är ' + (root.name));
    
    // Del 2
    let obalanserad = hittaObalans(root);
    let skyldig = hittaSkyldig(obalanserad.above);
    let nyvikt = map[skyldig.tower].weight + parseInt(skyldig.diff);
    console.log('Del 2. Obalanserad är ' + skyldig.tower + ', borde väga ' + nyvikt);

    // mfzpvpj, borde väga 596
});

function hittaObalans(tower) {
    if(tower.above.length == 0) return null;
    for(let a of tower.above) {
        var unbal = hittaObalans(map[a]);
        if(unbal) return unbal
    }

    var ovanset = new Set();
    for(let a of tower.above) {
        map[a].tw = hittaTotalVikt(map[a]);
        ovanset.add(map[a].tw);
    }
    if(ovanset.size == 1) return null;

    // Vi hittade där obalansen börjar
    return tower;
}

function hittaSkyldig(towers) {
    // Ok, vi har hittat kandidater. Men vilken?
    let vikter = towers.map(t => { return map[t].tw });
    for(a of towers) {
        // Hur många andra har samma vikt?
        let ensam = vikter.filter(f => f == map[a].tw);
        if(ensam.length == 1) {
            let syskon = towers[towers.indexOf(a) + 1 % towers.length];
            let diff = map[syskon].tw - map[a].tw;
            return {tower:a, diff:diff};
        }
    }
    return {};    
}

function hittaTotalVikt(tower) {
    return tower.weight + tower.above.reduce((a,b) => a + hittaTotalVikt(map[b]),0)
}

function createTree(list) {
    var tree = [];

    // Bygg trädet
    for (t of list) {
        var tw = parseInt(t.weight);
        for (a of t.above) {
            map[a].below = t.name;
        }
        tree.push(map[t.name]);
    }
    return tree;
};


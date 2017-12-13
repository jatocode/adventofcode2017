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
    let ub = hittaObalans(root);
    let nyvikt = map[ub.tower].weight + parseInt(ub.diff);
    console.log('Del 2. Obalanserad är ' + ub.tower + ', borde väga ' + nyvikt);
});

function hittaObalans(tower) {
    if(tower.above.length == 0) return null;
    for(let a of tower.above) {
        var unbal = hittaObalans(map[a]);
        if(unbal) return unbal
    }

    var ovan = [];
    var ovans = new Set();
    for(let a of tower.above) {
        map[a].tw = hittaTotalVikt(map[a]);
        ovan.push(map[a].tw );
        ovans.add(map[a].tw );
    }
    if(ovans.size == 1) return null;

    // Ok, vi har hittat kandidater. Men vilken?
    for(a of tower.above) {
        let v2 = ovan.filter(f => f == map[a].tw);
        if(v2.length == 1) {
            //console.log('Den här jäveln ' + JSON.stringify(map[a]));
            let syskon = tower.above[tower.above.indexOf(a) + 1 % tower.above.length];
            let diff = map[syskon].tw - map[a].tw;
            return {tower:a, diff:diff};
        }
    }
    return {};
}
function hittaTotalVikt(node) {
    return node.weight + node.above.reduce((a,b) => a + hittaTotalVikt(map[b]),0)
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


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

var towerlist = [];
var map = {};
read(args[0], function (data) {
    var lines = data.split('\n');
    for (let l of lines) {
        if (l.length == 0) continue;
        var tower = l.match(/(.*)\s\((\d*)\)(\s*->\s*(.*))?/);
        var above = tower[4] ? tower[4].split(', ') : [];
        var t = {
            name: tower[1],
            weight: tower[2],
            tw: 0,
            below: [],
            above: above,
        };
        towerlist.push(t);
    }

    var program = createTree(towerlist);

    var root;
    for (p of program) {
        if (p.below.length == 0) {
            console.log('The bottom is ' + p.name);
            root = p;
        }
    }

    //console.log(program);

    // Gör en lookup. Global, men orka..
    for (p of program) {
        map[p.name] = p;
    }

    dfs(root, program, ((x) => { 
        if(x.bal == true) {
            console.log(x);
        } 
    }));
    
});

function findOdd(subtowers) {
    //var list = subtowers.map((x) => { return 'a'+x.weight });
    var list = subtowers;
    if (list.length == 0) return false;
    var count = {};
    for (l of list) {
        if (!count[l]) count[l] = 0;
        count[l]++;
    }
    // Alla lika?
    if (Object.values(count).length == 1) {
        return true;
    }

    var min = Math.min(...Object.values(count));
    var mini = Object.values(count).indexOf(min);
    var key = parseInt(Object.keys(count)[mini]);

    // Index på den minsta
    return subtowers[list.indexOf(key)];
}

function totweight(tower) {
    var tw = 0; //parseInt(tower.weight);
    for(a of tower.above) {
        tw += parseInt(map[a].weight) + totweight(map[a]);
    }
    return tw;
}

function balanced(tower) {
    var alist = [];
    var count = {};
    for(a of tower.above) {
        var w = parseInt(map[a].weight) + totweight(map[a]);
        if (!count[w]) count[w] = 0;
        count[w]++;
    }
    return (Object.values(count).length == 1);
}

function dfs(root, list, callback) {
    var stack = [root];

    var n;
    while (stack.length > 0) {

        n = stack.pop();
        n.tw = parseInt(totweight(n)) + parseInt(n.weight);
        n.bal = balanced(n);

        callback(n);

        if (!n.above) {
            continue;
        }

        //console.log(n.bal);
        for (var i = n.above.length - 1; i >= 0; i--) {
            stack.push(map[n.above[i]]);
        }
    }
};

function createTree(list) {
    var tree = [];
    // Gör en lookuptabell
    var map = {};
    for (l of list) {
        map[l.name] = l;
    }

    // Lägg upp skiten i trädet
    for (t of list) {
        for (a of t.above) {
            map[a].below.push(t.name);
        }
        tree.push(map[t.name]);
    }
    return tree;
};

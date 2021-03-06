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
    var programs = [];
    for(l of lines) {
        if(l.length == 0) continue;
        var match = l.match(/(\d+)\s+<->\s+(.*)/);
        var connectedTo = match[2].split(', ').map((x) => { return parseInt(x) });
        var program = {id: parseInt(match[1]), ct: connectedTo};
        programs.push(program);
    }

    // Create map
    var map = {};
    for(i=0;i<programs.length;i++) {
        map[i] = programs[i];
    }

    // Del 1:
    var conn = [0];
    bfs(0, map, conn);
    console.log('Antal program i grupp 0 : ' + conn.length);

    // Del 2:
    var groups = new Set();
    for(gid in programs) {
        var conn = [parseInt(gid)];
        bfs(gid, map, conn);
        groups.add(conn.sort().join()); // Sortera och bunta ihop
    }
    console.log('Antal grupper totalt: ' + groups.size);

});

function bfs(start, map, conn) {
    var queue=[start];
    var pid;
    var tested = [];
    while(queue.length>0) {

        pid = queue.shift();

        p = map[pid];
        if (!p.ct) {
            continue;
        }

        for (var i = 0; i<p.ct.length; i++) {
            var cid = p.ct[i];
            // Om conn0 innehåller cid och p inte redan är med så lägg till p
            if(conn.indexOf(cid) >=0 && conn.indexOf(p.id) < 0) {
                conn.push(p.id);
            }

            // Har vi sett den förut?
            if(tested.indexOf(cid) < 0) {
                tested.push(cid);
                queue.push(cid);
            }
        }
    }
    return conn;
};

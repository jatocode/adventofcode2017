const fs = require('fs');
const args = process.argv.slice(2);

function read(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

var matrix = [];
read(args[0], function (data) {
    var lines = data.split('\n');
    for (line of lines) {
        if(line.length == 0) continue;
        matrix.push(line.split(''));
    }
    var start = [matrix[0].indexOf('|'), 0, 0];
    var result = dfs(start);
    console.log('Texten är ' + result.text + ' och antal steg är ' + result.steps);
});

function dfs(start, callback) {
    var stack = [start];
    var n;
    var text = '';
    var path = {};
    var dir = 0;
    path[getNode(start)] = [];
    steps = 0; 
    while (stack.length > 0) {
        n = stack.pop();
        var r = getRoute(n);    
        const match = r.match(/[A-Z]/);
        if(match && match[0]) text += match[0];

        dir = r=='+'?-1:n[2]; // Ändra bara kurs vid +, annars kör på
        steps++; // Del 2

        var prev = path[getNode(n)];
        var paths = getPaths(n, dir);
        for (var i = paths.length - 1; i >= 0; i--) {
            if(getNode(prev) == getNode(paths[i])) {
                    continue;
            }
            if(getRoute(paths[i]) != ' ') {
                stack.push(paths[i]);
                path[getNode(paths[i])] = n;
            }
        }
    }
    return {text, steps};
};

function getRoute(n) {
    const x = n[0];
    const y = n[1];
    if(!matrix[y] || !matrix[y][x]) return ' '
    else return matrix[y][x];
}

function getNode(n) {
    if(!n) return [];
    return n[0] + '' + n[1] + getRoute(n);
}

function getPaths(n, dir) {
    const x = n[0];
    const y = n[1];

    var paths = [ [x-1, y, 1],
                  [x+1, y, 1],
                  [x, y-1, 0],
                  [x, y+1, 0] ];

    if(dir == 0) return paths.slice(2);
    else if (dir == 1)  return paths.slice(0, 2);
    else return paths;
}


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
const GRIDSIZE = 1000;
const BURSTS = 10000000;

var grid = [];
var infected = 0;
var facing = 0;
for (i = -GRIDSIZE; i < GRIDSIZE; i++) {
    grid[i] = [];
    for (j = -GRIDSIZE; j < GRIDSIZE; j++) {
        grid[i][j] = '.';
    }
}
read(args[0], function (data) {
    var lines = data.split('\n');
    var j = 0;
    var w = 0;
    for (line of lines) {
        if (line.length == 0) continue;
        w = line.length;
        for (i = 0; i < line.length; i++) {
            grid[j][i] = line[i];
        }
        j++;
    }
    const pos = [Math.floor(j / 2), Math.floor(w / 2)];
    for (let i = 0; i < BURSTS; i++) {
        var x = pos[0];
        var y = pos[1];
        const newpos = burst(x, y);
        pos[0] = newpos[0];
        pos[1] = newpos[1];
    }
    console.log('Infected: ' + infected);
});

function fixgrid(x, y) {
    if (grid[y] == undefined) {
        grid[y] = [];
        grid[y][x] = '.';
    }
}

function burst(x, y) {
    fixgrid(x, y);

    switch (grid[y][x]) {
        case '.':
            grid[y][x] = 'W';
            dir = 'l';
            break;
        case 'W':
            grid[y][x] = '#';
            infected++;
            dir = 's';
            break;
        case '#':
            grid[y][x] = 'F';
            dir = 'r';
            break;
        case 'F':
            grid[y][x] = '.';
            dir = 'R'; // Reverse
            break;
    }

    const delta = move(x, y, dir);
    x += delta[0];
    y += delta[1];
    return [x, y];
}

function move(x, y, direction) {
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    switch (direction) {
        case 'r':
            facing++;
            break;
        case 'l':
            facing--;
            break;
        case 'R':
            facing += 2;
            break;
        case 's':
            break;
    }
    facing = (facing % dirs.length + dirs.length) % dirs.length;
    return dirs[facing];
}

function printgrid(pos) {
    var min = 0;
    for (yi in grid) {
        min = yi < min ? yi : min;
    }
    for (let yi = -GRIDSIZE; yi < GRIDSIZE; yi++) {
        const y = grid[yi];
        var min = 0;
        for (let xi = -GRIDSIZE; xi < GRIDSIZE; xi++) {
            if (pos && pos[0] == xi && pos[1] == yi) process.stdout.write('['); else process.stdout.write(' ');
            process.stdout.write(y[xi]);
            if (pos && pos[0] == xi && pos[1] == yi) process.stdout.write(']'); else process.stdout.write(' ');
        }
        process.stdout.write('\n');
    }
    console.log();
}

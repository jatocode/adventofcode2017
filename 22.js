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

var grid = [];
var infected = 0;
var facing = 0;
read(args[0], function (data) {
    var lines = data.split('\n');
    for(line of lines) {
        if(line.length == 0) continue;
        grid.push(line.split(''));
    }
    const pos = [Math.floor(grid.length/2), Math.floor(grid[0].length/2)];
    printgrid(pos);
    for(let i=0; i<70; i++) {
        var x = pos[0];
        var y = pos[1];

        const newpos = burst(x,y);

        pos[0] = newpos[0];
        pos[1] = newpos[1];

        printgrid(pos);
    }

});

function isInfected(x,y) {
    if(grid[y] == undefined) {
        console.log(y);
        grid[y] = [];
        grid[y][x] = '.';
        return false;
    }
    return grid[y][x] == '#';
}

function burst(x,y) {
    //   console.log({x,y});
    if(isInfected(x,y)) {
        grid[y][x] = '.'; // Clean it
        dir = 'r';
    } else {
        grid[y][x] = '#'; // Infect!
        infected++;
        dir = 'l';
    }
    const delta = move(x,y, dir);
    x += delta[0];
    y += delta[1];
    return [x,y];
}

function move(x,y, direction) {
    const dirs = [ [0,-1], [1,0], [0,1], [-1,0] ];
    switch(direction) {
        case 'r':
            facing++;
            break;
        case 'l':
            facing--;
            break;
    }
    facing = (facing % dirs.length + dirs.length) % dirs.length;
    //    console.log(dirs[facing]);
    return dirs[facing];
}

function printgrid(pos) {
    var min = 0;
    for(yi in grid) {
        min = yi < min?yi:min;
    }
    for(let yi=min; yi<grid.length; yi++) {
        const y = grid[yi];
        var min = 0;
        for(x in y.sort()) {
            if(pos && pos[0] == x && pos[1] == yi) process.stdout.write('['); else process.stdout.write(' ');
            process.stdout.write(y[x]);
            if(pos && pos[0] == x && pos[1] == yi) process.stdout.write(']'); else process.stdout.write(' ');
        }
        process.stdout.write('\n');
    }
    console.log();
}

var c = document.getElementById('advent-canvas');
var ctx = c.getContext("2d");

fetch('/aoc2017/22-input')
    .then(response => response.text())
    .then(text => run22(text));

var grid = [];
var infected = 0;
var facing = 0;
var GRIDSIZE = 40;
var loops = 10000;

function run22(data) {
    for (var i = -GRIDSIZE; i < GRIDSIZE; i++) {
        grid[i] = [];
        for (var j = -GRIDSIZE; j < GRIDSIZE; j++) {
            grid[i][j] = '.';
        }
    }
    var lines = data.split('\n');
    virus(lines);
};

function virus(lines) {
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
    drawloop(pos);
    //printgrid(pos);
}

function drawloop(pos) {
    ctx.clearRect(0, 0, c.width, c.height);
    printgrid(pos);
    var x = pos[0];
    var y = pos[1];
    const newpos = burst(x, y);
    pos[0] = newpos[0];
    pos[1] = newpos[1];
    console.log(loops);
    if (loops-- > 0) setTimeout(function () { drawloop(pos); }, 10);
}

function isInfected(x, y) {
    if (grid[y] == undefined) {
        grid[y] = [];
        grid[y][x] = '.';
        return false;
    }
    return grid[y][x] == '#';
}

function burst(x, y) {
    if (isInfected(x, y)) {
        grid[y][x] = '.'; // Clean it
        dir = 'r';
    } else {
        grid[y][x] = '#'; // Infect!
        infected++;
        dir = 'l';
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
    }
    facing = (facing % dirs.length + dirs.length) % dirs.length;
    return dirs[facing];
}

function printgrid(pos) {
    var GRIDSIZE = 40;
    for (let yi = -GRIDSIZE; yi < GRIDSIZE; yi++) {
        const y = grid[yi];
        for (let xi = -GRIDSIZE; xi < GRIDSIZE; xi++) {
            if(y[xi] == '#') {
                print(xi + GRIDSIZE, yi + GRIDSIZE, 'black');
            }
        }
    }
}

function print(x, y, mark) {
    ctx.fillStyle = mark;
    ctx.fillRect(x*10, y*10, 8, 8);
    ctx.stroke();
}

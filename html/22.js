var c = document.getElementById('advent-canvas');
var ctx = c.getContext("2d");

fetch('/aoc2017/22-input')
    .then(response => response.text())
    .then(text => run22(text));

var grid = [];
var infected = 0;
var facing = 0;
var GRIDSIZE = 50;
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
    if (loops-- > 0) setTimeout(function () { drawloop(pos); }, 10);
}

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
    var GRIDSIZE = 50;
    for (let yi = -GRIDSIZE; yi < GRIDSIZE; yi++) {
        const y = grid[yi];
        for (let xi = -GRIDSIZE; xi < GRIDSIZE; xi++) {
            switch (y[xi]) {
                case '#':
                    print(xi + GRIDSIZE, yi + GRIDSIZE, 'red');
                    break;
                case 'W':
                    print(xi + GRIDSIZE, yi + GRIDSIZE, 'black');
                    break;
                case 'F':
                    print(xi + GRIDSIZE, yi + GRIDSIZE, 'green');
                    break;
                case '.':
                    //print(xi + GRIDSIZE, yi + GRIDSIZE, 'lightgrey');
                    break;
                default:
                    print(xi + GRIDSIZE, yi + GRIDSIZE, 'yellow');
                    break;
            }
        }
    }
}

function print(x, y, mark) {
    ctx.fillStyle = mark;
    ctx.fillRect(x * 10, y * 10, 8, 8);
    ctx.stroke();
}

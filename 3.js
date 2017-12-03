var fs = require('fs');
var args = process.argv.slice(2);

const input = 265149;

// VM i globala variabler idag
var spiral = [];
var xmax = 1;
var xmin = -1;
var ymax = 1;
var ymin = -1;
var x = 0;
var y = 0;

// ms för att slippa krångla med negativ array.
// krånligt nog med 2d arrayer i javascript
const ms = Math.ceil(Math.sqrt(input));
var spiral2 = [...Array(ms+10).keys()].map(i => Array(ms+10));
var part2 = 0;
for(var i=1; i<=input;i++) {
    spiral.push({sq:i,x:x,y:y});

    // Part 2
    var sum = 0;
    if(x == 0 && y == 0) {
        spiral2[y+ms][x+ms] = 1;        
    } else if(part2 == 0) {
        sum = addNeighbors(x+ms,y+ms);
        spiral2[y+ms][x+ms] = sum;
        if(sum > input) {
            part2 = sum;
        }
    }

    // Gå runt i spiralen
    d = direction(x,y);
    x += d[0];
    y += d[1];
    if(x == xmax && y == ymin) {
        xmax++; 
        xmin--;
        ymin--;
        ymax++;
    }
}
console.log('It\'s ' + manh(spiral[0], spiral[input-1]) + ' steps to ' + input);
console.log('First larger number is: ' + part2);

function addNeighbors(x,y) {
    return data(y+1, x+0) + data(y+1, x+1) +
           data(y+0, x+1) + data(y-1, x+1) +
           data(y-1, x+0) + data(y-1, x-1) +
           data(y+0, x-1) + data(y+1, x-1);           
}

function data(y,x) {
    if (spiral2[y] == undefined) return 0;
    d = spiral2[y][x];
    return d==undefined?0:d;
}

function direction(x,y) {
    // TODO Clean this mess up
    if(x == xmax) {
        if(y == ymin)  return [1,0]; // Right
        if(y == ymax) return [-1,0]; // Left
        return [0,1]; // Up
    }
    if(x == xmin) {
        if(y == ymin)  return [1,0]; // Right
        if(y == ymax) return [0,-1]; // Down
        return [0,-1]; // Down
    }
    if(y == ymin) return [1,0]; // Right
    if(y == ymax) return [-1,0]; // Left

    return [1,0]; // Right
}

// Calculate distance
function manh(from, to) {
    return (Math.abs(from.x - to.x) + Math.abs(from.y - to.y));
}

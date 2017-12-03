var fs = require('fs');
var args = process.argv.slice(2);

const input = 265149;
//const input = 23;

var spiral = [];
var xmax = 1;
var xmin = -1;
var ymax = 1;
var ymin = -1;
var x = 0;
var y = 0;

const ms = Math.ceil(Math.sqrt(input));
var spiral2 = [...Array(ms+10).keys()].map(i => Array(ms+10));

spiral2[y+ms][x+ms] = 1;
for(var i=1; i<=input;i++) {
    spiral.push({sq:i,x:x,y:y});
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

// Part 2
for(square of spiral) {
    if(square.x == 0 && square.y == 0) {
        spiral2[square.y+ms][square.x+ms] = 1;        
    } else {
        spiral2[square.y+ms][square.x+ms] = addNeighbors(square.x+ms,square.y+ms);
    }
    square.data = spiral2[square.y+ms][square.x+ms];
    if(square.data > input) {
        console.log('First larger number is: ' + square.data);
        return;
    }
}
/*
for(var j=spiral2.length;j>=0;j--) {
    console.log(spiral2[j]);
}
*/

function addNeighbors(x,y) {
    return data(y+1, x+0) +
           data(y+1, x+1) +
           data(y+0, x+1) +
           data(y-1, x+1) +

           data(y-1, x+0) +
           data(y-1, x-1) +
           data(y+0, x-1) +
           data(y+1, x-1);           
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

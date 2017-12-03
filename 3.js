var fs = require('fs');
var args = process.argv.slice(2);

/*              31 30
17  16  15  14  13 30
18   5   4   3  12 29
19   6   1   2  11 28
20   7   8   9  10 27
21  22  23  24  25 26
*/

const input = 265149;

var spiral = [];
var xmax = 1;
var xmin = -1;
var ymax = 1;
var ymin = -1;
var x = 0;
var y = 0;

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

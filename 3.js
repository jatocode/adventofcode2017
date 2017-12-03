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
console.log('Its ' + manh(spiral[0], spiral[input-1]) + ' steps to ' + input);

function direction(x,y) {
    var dx = 0;
    if(x == xmax) {
        if(y == ymin)  return [1,0]; // Next spiral 9 -> 10
        if(y == ymax) return [-1,0]; // Go left 3 -> 4
        return [0,1]; // Go upp 2 -> 3
    } 
    if(x == xmin) {
        if(y == ymin)  return [1,0]; // Go right 7 - 8
        if(y == ymax) return [0,-1]; // 5 - > 6
        return [0,-1]; // Go down // 6 -> 7
    }
    if(y == ymin) return [1,0]; // Go right 1 -> 2
    if(y == ymax) return [-1,0]; // Go left 4 -> 5

    return [1,0]; // Go right 8 -> 9
}

// Calculate distance
function manh(from, to) {
    return (Math.abs(from.x - to.x) + Math.abs(from.y - to.y));
}

var fs = require('fs');
var args = process.argv.slice(2);

function read(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

read(args[0], function(data) {
    var lines = data.split('\n');
    var sum = 0;
    for(let l of lines) {
        if(l.length == 0) continue;
        var nums = l.split(/\s+/).map((a) => parseInt(a));
        var currmax = 0;
        var currmin = 65535;
        for(num of nums) {
            currmax = Math.max(num, currmax);
            currmin = Math.min(num, currmin);
        }
        sum = sum + (currmax - currmin);
    }
    console.log('Part 1: ' + sum);
});


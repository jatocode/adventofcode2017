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
    var sum2 = 0;
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

        var divisible;
        for(num of nums) {
            for(num2 of nums) {
                if(num != num2 && num % num2 == 0)  {
                    divisible = [num, num2];
                }
            }
        }
        sum2 = sum2 + divisible[0] / divisible[1];
    }
    console.log("Part 1: " + sum);
    console.log("Part 2: " + sum2);
});


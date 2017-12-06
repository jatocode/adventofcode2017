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
    var blocks = data.split(/\s+/).map(x => {return parseInt(x)});
    var seen = [];
    var steps = 0;
    do {
        seen.push(blocks.toString());
        steps++;
        var max = Math.max(...blocks);
        var maxi = blocks.indexOf(max);

        var dist1 = Math.ceil(max / blocks.length);
        var dist2 = max % dist1;
        blocks[maxi] = 0;

        var num = Math.floor(max / dist1);

        for(var i=1; i<=num; i++) {
            var index = (maxi + i) % blocks.length;
            blocks[index] += dist1;
        }
        var index = (maxi + blocks.length) % blocks.length; 
        blocks[index] += dist2;
        console.log(blocks);

        var newSeen = blocks.toString();
    } while(seen.indexOf(newSeen) < 0);
    console.log('Found loop at step: ' + steps);
 });


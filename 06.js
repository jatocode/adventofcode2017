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
    var newseen = '';
    var steps = 0;
    do {
        seen.push(blocks.toString());
        steps++;
        var max = Math.max(...blocks);
        var maxi = blocks.indexOf(max);

        blocks[maxi] = 0;
        for(var i=1;i<=max;i++) {
            blocks[(maxi + i) % blocks.length]++;
        }
        newseen = blocks.toString();
    } while(seen.indexOf(newseen) < 0);

    // Part 1
    console.log('Part 1. Found loop at step: ' + steps);

    // Part 2
    var loopi = seen.indexOf(newseen);
    console.log('Part 2, Size of loop is:' + (seen.length - loopi));
 });


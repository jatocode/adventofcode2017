var fs = require('fs');
var args = process.argv.slice(2);

function read(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

read(args[0], function (data) {
    var lines = data.split('\n');
    for (let l of lines) {
        if (l.length == 0) continue;
        var stream = l.split('');
        var garbage = false;
        var ignore = false;
        var groups = [];
        var level = 0;
        var gc = 0;
        for(i=0; i < l.length ;i++) {
            if(ignore) {
                i++;
                ignore = false;
            }
            if(garbage && !ignore) gc++;
            switch (l[i]) {
                case '{':
                    if(!garbage) {
                        level += 1;
                        groups.push(level);
                    }
                    break;
                case '}':
                    if(!garbage) level -= 1;
                    break;
                case '<':
                    garbage=true;
                    break;
                case '>':
                    gc--;
                    garbage=false;
                    break;
                case '!':
                    gc--;
                    ignore=true;
                    break;
            }
        }
        var sum = groups.reduce((p,c) => { return p + c});
        console.log('Part 1. Sum of groups is :' + sum);
        console.log('Part 2. Number of garbage chars:' + gc);
        
    }
});

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
        for(i=0; i < l.length ;i++) {
            if(ignore) {
                i++;
                ignore = false;
            }
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
                    garbage=false;
                    break;
                case '!':
                    ignore=true;
                    break;
            }
        }
        var sum = groups.reduce((p,c) => { return p + c});
        console.log('Sum of groups is :' + sum);
    }
});

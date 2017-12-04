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
    var numvalid = 0;
    for(let l of lines) {
        if(l.length == 0) continue;

        var pass = l.split(/\s+/);
        var valid = false;
        for(p of pass) {
            var reg = new RegExp('\\b'+p+'\\b', 'g');
            var match = l.match(reg); 
            if(match.length > 1) {
                valid = false;
                break;
            }
            valid = true;
        }
        if (valid) numvalid++;
    }
    console.log('Number of valid ' + numvalid);
});


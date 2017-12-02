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

    for(let l of lines) {
        if(l.length == 0) continue;
        var nums = l.split(/\s+/).map((a) => parseInt(a));
        
    }

});


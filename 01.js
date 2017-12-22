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
        const digits = l.trim().split("");
        var matching = [];
        for(var i=0;i<digits.length;i++) {
            if(digits[i] == digits[(i+digits.length/2) % digits.length]) {
                matching.push(parseInt(digits[i]));
            }
        }
        if(matching.length > 0 ) {
            console.log(l + ' = ' + matching.reduce((s,d) => { return s + d }));
        } else {
            console.log(l + ' = 0');
        }
   }
});


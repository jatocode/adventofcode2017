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
    var numvalid1 = 0;
    var numvalid2 = 0;
    for(let l of lines) {
        if(l.length == 0) continue;

        // Part 1 with regex, no need for this now with part 2, could do both at once..but I dont care
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
        if (valid) {
            numvalid1++;
        }

        // Part 2
        valid = false;
        for(p1 of pass) {
            var matches = 0;
            var ana1 = p1.split('').sort().join('');
            for(p2 of pass) {
                var ana2 = p2.split('').sort().join('');
                if(ana1 == ana2) {
                    matches++;
                }
            }
            if(matches > 1) {
                valid = false;
                break;
            }
            valid = true;
            
        }
        if(valid) {
            numvalid2++;
        }
    }
    console.log('Number of valid part 1 ' + numvalid1);
    console.log('Number of valid part 2 ' + numvalid2);
});


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
    var lengths = data.split('\n')[0].split(',').map((x) => {return parseInt(x)});

    var currentpos = 0;
    var skipsize = 0;
    var len = args[1]?args[1]:256; // Easier to test
    var list = [];
    for(i=0;i<len;i++) {
        list[i] = i;
    }

    for(length of lengths) {
        list = reverse(list, currentpos, length);
        currentpos = (currentpos + length + skipsize) % list.length;
        skipsize++;
    }

    console.log(list.slice(0,2) + ' = ' + list[0] * list[1]);

});

function reverse(list, pos, num) {
    var safe = list.slice(pos).concat(list.slice(0, pos));
    var rev = safe.slice(0, num).reverse();
    for(i=0;i<rev.length;i++) {
        list[(pos + i) % list.length] = rev[i];
    }
    return list;
}

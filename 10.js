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

    console.log('Del 1: Totalen är: ' + list.slice(0,2) + ' = ' + list[0] * list[1]);

    // Del 2
    var input = data.split('\n')[0];
    console.log('Del 2: Knothash of ' + input + ' = ' + knothash(input, len, 64));

    // Tests
    //console.log('AoC 2017 = ' + knothash('AoC 2017', 256, 64));
    //var test = xor([65,27,9,1,4,3,40,50,91,7,6,0,2,5,68,22]);
    //console.log(test);
});

function knothash(input, len, rounds) {
    var lengths = input.split('').map((x) => x.charCodeAt(0));
    lengths = lengths.concat([17, 31, 73, 47, 23]);

    var list=[];
    for(i=0;i<len;i++) {
        list[i] = i;
    }

    // Kör len varv
    var currentpos = 0;
    var skipsize = 0;
    for(r=0;r<rounds;r++) {
        for(length of lengths) {
            list = reverse(list, currentpos, length);
            currentpos = (currentpos + length + skipsize) % list.length;
            skipsize++;
        }
    }

    // Sparse hash till dense hash
    var dense = densehash(list, 16);

    return tohex(dense);
}

function tohex(list) {
    var hex = '';
    for(l of list) {
        // Snodde kod för 0-pad från stackoverflow
        var d = "00"+l.toString(16);
        var e = d.substr(d.length-2);
        hex += e;
    }
    return hex;
}

function densehash(list, size) {
    var dense = [];
    for(i=0;i<list.length;i+=size) {
        block = list.slice(i, i+size);
        dense.push(xor(block));        
    }
    return dense;
}

function xor(block) {
    var x = 0;
    for(b of block) {
        x = x ^ b;
    }
    return x;
}


function reverse(list, pos, num) {
    var safe = list.slice(pos).concat(list.slice(0, pos));
    var rev = safe.slice(0, num).reverse();
    for(i=0;i<rev.length;i++) {
        list[(pos + i) % list.length] = rev[i];
    }
    return list;
}

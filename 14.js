var input = 'ljoxqyyw';
//var input = 'flqrgnkx';

var sum = 0;
for(j=0;j<128;j++) {
    var key = input + '-'+j;
    kh = knothash(key, 256, 64);

    for(i=0;i<kh.length;i+=2) {
        var bitarr = parseInt(kh.slice(i,i+2), 16).toString(2).split('');
        sum += bitarr.filter((x) => x == 1).length;
    }
}
console.log(sum + '  squares are used for ' + input);

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

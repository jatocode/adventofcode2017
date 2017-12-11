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
    var list = [];
    for(i=0;i<256;i++) {
        list[i] = i;
    }

    console.log(JSON.stringify(list) + ' ' + list.length);
    console.log(lengths);

    var loop = 1;
    for(length of lengths) {
        var rev = [];
        if(length == 187) {
            console.log(currentpos);
        }
        if(currentpos + length > list.length) {
            var rev1 = list.slice(currentpos, list.length);
            var rev2 = list.slice(0, length-(list.length-currentpos));
            rev = rev1.concat(rev2);
            rev.reverse();
        } else {
            rev = list.slice(currentpos, length);
            rev.reverse();
            if(length == 187) console.log(rev[0]);
        }
        //console.log({rev:rev});   
        if(length == 187) console.log(list[currentpos]);
        for(i=0;i<rev.length;i++) {
            list[(currentpos + i) % list.length] = rev[i];
        }
        if(length == 187) console.log(list[currentpos]);
        
        currentpos = (currentpos + length + skipsize) % list.length;
        skipsize++;
        //console.log({l:loop, lenght: length,cp:currentpos, skipsize:skipsize});
        console.log(length);
        console.log(JSON.stringify(list));
        loop++;
        //if(loop > 5) break;
    }

       // console.log(JSON.stringify(list));
        console.log(list.slice(0,2) + ' = ' + list[0] * list[1]);
        
});

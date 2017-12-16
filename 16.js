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
var programs = 'abcdefghijklmnop'.split('');
//var programs = 'abcde'.split('');
read(args[0], function (data) {
    console.log(programs);
    var commands = data.split(',');
    var layers = [];
    for (l of commands) {
        console.log(l);
        if (l.length == 0) continue;
        var match = l.match(/s(.*)/);
        if (match && match[1]) {
            spin(match[1]);
        }
        
        match = l.match(/x(.*)\/(.*)/);
        if (match && match[1]) {
            exchange(match[1], match[2]);
        }
        
        match = l.match(/p(.*)\/(.*)/);        
        if (match && match[1]) {
            partner(match[1], match[2]);
        }        
    }
});

function spin(x) {
   var tmp = programs.slice(programs.length-x);
   programs = tmp.concat(programs.slice(0,programs.length-x));
}

function exchange(a,b) {
    var tmp = programs[a];
    programs[a] = programs[b];
    programs[b] = tmp;
}

function partner(a,b) {
    var ia = programs.indexOf(a);
    var ib = programs.indexOf(b);
    var tmp = programs[ia];
    programs[ia] = programs[ib];
    programs[ib] = tmp;
}

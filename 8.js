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
    // Usch vad fult med dubbla objekt. Hinner inte städa nu
    var regs = {};
    var regmax = {};
    for(let l of lines) {
        if(l.length == 0) continue;
        var parse = l.match(/([a-z]+)\s+(inc|dec)\s+(-?\d+)\s+if\s+([a-z]+)\s(.*)\s(-?\d+)/);
        var op = '';
        switch(parse[2]) {
            case 'inc': op = '+'; break;
            case 'dec': op = '-'; break;
        }

        var i = { reg: parse[1], op: op, amount: parse[3],
                  lvalue: parse[4], cond: parse[5], rvalue: parse[6]};

        if(!regs[parse[1]]) regs[parse[1]] = 0;
        if(!regs[parse[4]]) regs[parse[4]] = 0;
        if(!regmax[parse[1]]) regmax[parse[1]] = 0;
        if(!regmax[parse[4]]) regmax[parse[4]] = 0;

        var evalstring = regs[i.lvalue] + ' ' + i.cond + ' ' + '(' + parseInt(i.rvalue) + ')';
        var condition = eval(evalstring);

        if(condition) {
            var current = regs[i.reg];
            var evs = current + i.op + '(' + parseInt(i.amount) + ')';
            regs[i.reg] = eval(evs);
            if(regs[i.reg] > regmax[i.reg]) regmax[i.reg] = regs[i.reg];
        }
    }

    // Fult som fasen, men hinner inte göra snyggare
    var regarr = Object.keys( regs ).map(function ( key ) { return {reg:key, value:regs[key]}; });
    var regmaxarr = Object.keys( regmax ).map(function ( key ) { return {reg:key, value:regmax[key]}; });
    var maxi = 0;
    var max = 0;
    var maxi_ever = 0;
    var max_ever = 0;
    for(i=0; i<regarr.length; i++) {
        if(regarr[i].value > max) {
            maxi = i;
            max = regarr[i].value;
        }
        if(regmaxarr[i].value > max) {
            maxi_ever = i;
            max_ever = regmaxarr[i].value;
        }
    }
    console.log('Part 1, highest value is ' + regarr[maxi].value + ' in ' + regarr[maxi].reg);
    console.log('Part 2, highest value ever is ' + regmaxarr[maxi_ever].value + ' in ' + regmaxarr[maxi_ever].reg);

});

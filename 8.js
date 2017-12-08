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
    var program = [];
    var regs = {}
    for(let l of lines) {
        if(l.length == 0) continue;
        var parse = l.match(/([a-z]+)\s+(inc|dec)\s+(-?\d+)\s+if\s+([a-z]+)\s(.*)\s(-?\d+)/);
        var op = '';
        try {
        switch(parse[2]) {
            case 'inc': op = '+'; break;
            case 'dec': op = '-'; break;
        }
            
        var inst = { reg: parse[1],
                     op: op,
                     amount: parse[3],
                     lvalue: parse[4],
                     cond: parse[5],
                     rvalue: parse[6]};

        if(!regs[parse[1]]) regs[parse[1]] = 0;
        if(!regs[parse[4]]) regs[parse[4]] = 0;
        } catch (err) {
            console.log(l);
            console.log(err);
            console.log(parse);
        }

        program.push(inst);
    }

    for(i of program) {
        reg = i.reg;

        var evalstring = regs[i.lvalue] + ' ' + i.cond + ' ' + '(' + parseInt(i.rvalue) + ')';
        var condition = eval(evalstring);
        //console.log(evalstring + ' = ' + condition);
        
        if(condition) {
            var current = regs[reg];
            var evs = current + i.op + '(' + parseInt(i.amount) + ')';
            regs[reg] = eval(evs);
        }
    }

    var regarr = Object.keys( regs ).map(function ( key ) { return {reg:key, value:regs[key]}; });
    var maxi = 0;
    var max = 0;
    for(i=0; i<regarr.length; i++) {
        if(regarr[i].value > max) {
            maxi = i;
            max = regarr[i].value;
        }
    }
    console.log(regarr[maxi]);

});

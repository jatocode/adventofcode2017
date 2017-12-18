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

var registers = []
read(args[0], function (data) {
    var instructions = data.split('\n');
    var program = [];
    for (inst of instructions) {
        let match = inst.match(/(\w+)\s+(.*?)(\s+(.*)|$)/);
        if(match) {
            let ins = {i:match[1], lvalue:match[2].trim(), rvalue:match[3].trim()};
            program.push(ins);
        } 
    }
    console.log('Last frequency: ' + run(program));
});

function run(program) {
    var ip = 0;
    var freq = 0;
    while(ip < program.length) {
        let p = program[ip];
        let i = p.i;
        let lvalue = p.lvalue;
        let rvalue = p.rvalue;
        switch(i) {
            case 'snd': 
                freq = get(lvalue); 
                break;
            case 'set': 
                registers[lvalue] = get(rvalue);
                break;
            case 'add': 
                registers[lvalue] += get(rvalue);
                break;
            case 'mul': 
                registers[lvalue] *= get(rvalue);
                break;
            case 'mod':
                registers[lvalue] %= get(rvalue);
                break;
            case 'rcv': 
                if(get(lvalue) > 0) return freq;
                break;
            case 'jgz': 
                if(get(lvalue) > 0) {
                    ip += get(rvalue);
                    continue;
                }
                break;
        }
        ip++;
    }
}

function get(x) {
    if(Object.keys(registers).indexOf(x) > -1) {
        return registers[x];
    }
    return parseInt(x);
}


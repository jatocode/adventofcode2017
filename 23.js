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

read(args[0], function (data) {
    var instructions = data.split('\n');
    var program = [];
    for (inst of instructions) {
        let match = inst.match(/(\w+)\s+(.*?)(\s+(.*)|$)/);
        if (match) {
            let ins = {
                i: match[1],
                lvalue: match[2].trim(),
                rvalue: match[3].trim()
            };
            program.push(ins);
        }
    }
    console.log('Number of mul: ' + run(0, program));
});

function run(id, program) {
    var registers = {
        v: [],
        get: function (x) {
            if (Object.keys(this.v).indexOf(x) > -1) {
                return this.v[x];
            }
            return parseInt(x);
        }
    };
    for(r of 'abcdefgh'.split('')) {
        registers.v[r] = 0;
    }
    var ip = 0;
    var freq = 0;
    var mul = 0;
    while (ip < program.length) {
        let p = program[ip];
        let i = p.i;
        let lvalue = p.lvalue;
        let rvalue = p.rvalue;
        switch (i) {
            case 'set':
                registers.v[lvalue] = registers.get(rvalue);
                break;
            case 'sub':
                registers.v[lvalue] -= registers.get(rvalue);
                break;
            case 'mul':
                registers.v[lvalue] *= registers.get(rvalue);
                mul++;
                break;
            case 'jnz':
                if (registers.get(lvalue) != 0) {
                    ip += registers.get(rvalue);
                    continue;
                }
                break;
        }
        ip++;
    }
    console.log(registers.v);
    return mul;
}


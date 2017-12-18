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

const RUN = 0;
const WAIT = 1;

read(args[0], function (data) {
    var instructions = data.split('\n');
    var program = [];
    for (inst of instructions) {
        let match = inst.match(/(\w+)\s+(.*?)(\s+(.*)|$)/);
        if(match) {
            let ins = {
                i:match[1], 
                lvalue:match[2].trim(), 
                rvalue:match[3].trim()
            };
            program.push(ins);
        } 
    }
    console.log('Last frequency: ' + run(0, program));
});

function run(id, program) {
    var registers = {v: [], 
        get: function(x) { 
            if(Object.keys(this.v).indexOf(x) > -1) {
                return this.v[x];
            }
            return parseInt(x);
        }
    };
    var ip = 0;
    var freq = 0;
    var queue = [];
    var state = RUN;
    while(ip < program.length) {
        let p = program[ip];
        let i = p.i;
        let lvalue = p.lvalue;
        let rvalue = p.rvalue;
        if(i == 'rcv') {
            if(registers.get(lvalue) > 0) return freq;
            //    TODO Check my queue
            //    var val = queue.shift();
            //    registers.v[lvalue] = val;
        }
        switch(i) {
            case 'snd': 
                freq = registers.get(lvalue); 
                // TODO Send to other [1-id]
                break;
            case 'set': 
                registers.v[lvalue] = registers.get(rvalue);
                break;
            case 'add': 
                registers.v[lvalue] += registers.get(rvalue);
                break;
            case 'mul': 
                registers.v[lvalue] *= registers.get(rvalue);
                break;
            case 'mod':
                registers.v[lvalue] %= registers.get(rvalue);
                break;
            case 'jgz': 
                if(registers.get(lvalue) > 0) {
                    ip += registers.get(rvalue);
                    continue;
                }
                break;
        }
        ip++;
    }
}


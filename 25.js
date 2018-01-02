const fs = require('fs');
const args = process.argv.slice(2);

function read(file, callback) {
    if (!file) file = 'data/25-example';
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

read(args[0], function (data) {
    var lines = data.split('\n');
    let state = '';
    let diagnostic = 0;
    for (let i = 0; i < 3; i++) {
        const line = lines[i];
        if (line.length == 0) continue;
        let match = line.match(/Begin in state (.*)\./);
        if(match) state = match[1];
        match = line.match(/Perform a diagnostic checksum after (\d+) steps./);
        if(match) diagnostic = parseInt(match[1]);
    }
    let states = {};
    for (let i = 3; i < lines.length; i++) {
        const line = lines[i];
        if (line.length == 0) continue;
        let match = line.match(/In state (.*):/);
        if(match) {
            let state = match[1];
            match = lines[i+1].match(/.*If the current value is (\d+):/);
            let cv = parseInt(match[1]);
            match = lines[i+2].match(/.*Write the value (\d+)./);
            let wv = parseInt(match[1]);
            match = lines[i+3].match(/.*Move one slot to the (.*)./);
            let dirs = match[1];
            let step = dirs == 'right'?+1:-1;
            match = lines[i+4].match(/.*Continue with state (.*)./);
            let newstate = match[1];
            let cvlogic0 = {wv:wv, step:step, newstate:newstate};

            match = lines[i+5].match(/.*If the current value is (\d+):/);
            cv = parseInt(match[1]);
            match = lines[i+6].match(/.*Write the value (\d+)./);
            wv = parseInt(match[1]);
            match = lines[i+7].match(/.*Move one slot to the (.*)./);
            dirs = match[1];
            step = dirs == 'right'?+1:-1;
            match = lines[i+8].match(/.*Continue with state (.*)./);
            newstate = match[1];
            let cvlogic1 = {wv:wv, step:step, newstate:newstate};

            let logic = {state: state, cv: [cvlogic0, cvlogic1]};

            states[state] = [cvlogic0, cvlogic1];
        }
    }

    let tape = {};
    let cursor = 0;

    // Run machine
    for(let i=0;i<diagnostic;i++) {
        let cv = tape[cursor] ? tape[cursor] : 0;
        let logic = states[state][cv];
        tape[cursor] = logic.wv;
        cursor += logic.step;
        state = logic.newstate;
    }

    let ones = Object.values(tape).filter(x => x == 1);

    console.log('There are ' + ones.length + ' ones after ' + diagnostic + ' steps');

});


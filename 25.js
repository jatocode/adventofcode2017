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
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length == 0) continue;

    }

});


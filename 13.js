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
    var lines = data.split('\n');
    var layers = [];
    for(l of lines) {
        if(l.length == 0) continue;
        let match = l.match(/(\d+):\s+(\d+)/);
        let layer = parseInt(match[1]);
        let range = parseInt(match[2]);
        layers[layer] = ({layer:layer, range:range, scandir:1, scanpos:0, caught:0});
    }
    var time = 0;
    for(i=0; i<layers.length; i++) {
        var layer = layers[i];
        if(layer) {
            if(0 == layer.scanpos) layer.caught++;
        }
        for(l of layers) {
            if(l) {
                l.scanpos = l.scanpos + l.scandir;
                if(l.scanpos==l.range-1 || l.scanpos==0) l.scandir *= -1;
            }
        }
        time++;
    }
    var sum = 0;
    for(l of layers) {
        if(l) sum += l.caught > 0? l.layer*l.range:0;
    }
    console.log('severity: ' + sum);
});

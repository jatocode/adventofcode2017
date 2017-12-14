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
    for (l of lines) {
        if (l.length == 0) continue;
        let match = l.match(/(\d+):\s+(\d+)/);
        let layer = parseInt(match[1]);
        let range = parseInt(match[2]);
        layers[layer] = ({ layer: layer, range: range, scandir: 1, scanpos: 0, caught: 0 });
    }

    // Part 1
    var time = 0;
    for (i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer) {
            if (0 == layer.scanpos) layer.caught++;
        }
        for (l of layers) {
            if (l) {
                l.scanpos = l.scanpos + l.scandir;
                if (l.scanpos == l.range - 1 || l.scanpos == 0) l.scandir *= -1;
            }
        }
        time++;
    }
    var sum = 0;
    for (l of layers) {
        if (l) sum += l.caught > 0 ? l.layer * l.range : 0;
        if (l && l.caught) {
            var la = l.layer == 0?1:l.layer;
        }
    }
    console.log('Del 1, severity = ' + sum);

    // Part 2
    // Jag optimerade skiten ur del 1 lösningen, gjorde en lookup för att räkna ut skanner
    // och tog bort alla loopar

    var scanners = [];
    // Create scanner lookups
    for(l of layers) {
        if (l) {
            var scanner = [];
            for(i=0;i<l.range;i++) {
                scanner.push(i);
            }
            for(i=l.range-2;i>=0;i--) {
                scanner.push(i);
            }
            scanners[l.layer] = scanner;
        }
    }

    var delay = 0;
    while (true) {
        var time = delay;
        time++;

        // Test with this delay
        var caught = false;
        for (i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer) {
                var lid = layer.layer;
                var pos = (time-1) % (scanners[lid].length-1); 
                var calc = scanners[lid][pos];
                if (0 == calc) {
                    caught = true;
                    delay++;
                    break;
                }
            }
            time++;
        }
        if (!caught) break;
    }
    console.log('Del 2, perfekt fördröjning:' + delay);
});

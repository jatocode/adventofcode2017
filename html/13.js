var data = '0: 3, 1: 2, 2: 4, 4: 4, 6: 5, 8: 6, 10: 6, 12: 8, 14: 6, 16: 6, 18: 9, 20: 8, 22: 8, 24: 8, 26: 12, 28: 8, 30: 12, 32: 12, 34: 12, 36: 10, 38: 14, 40: 12, 42: 10, 44: 8, 46: 12, 48: 14, 50: 12, 52: 14, 54: 14, 56: 14, 58: 12, 62: 14, 64: 12, 66: 12, 68: 14, 70: 14, 72: 14, 74: 17, 76: 14, 78: 18, 84: 14, 90: 20, 92: 14';

var c = document.getElementById('advent-canvas');
var ctx = c.getContext("2d");
var scanners = [];
var layers = [];

start();

function start() {
    var lines = data.split(',');
    for (l of lines) {
        if (l.length == 0) continue;
        let match = l.match(/(\d+):\s+(\d+)/);
        let layer = parseInt(match[1]);
        let range = parseInt(match[2]);
        layers[layer] = ({ layer: layer, range: range, scandir: 1, scanpos: 0, caught: 0 });
    }

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
    drawSolution(delay);
};

function drawSolution(delay) {
    drawLoop(layers.length, 0, delay);
}

function drawLoop(loops, time, delay) {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "30px Helvetica";
    ctx.fillStyle = 'black';
    ctx.fillText('Delay: ' + delay + ', time: ' + time, 20,50);
    printLayers(time+delay, layers);
    print(20+time*8,100, 'blue');
    time++;
    if(loops-- > 0) setTimeout(function() { drawLoop(loops, time, delay)}, 150);
}

function printLayers(time, layers) {
    var x = 20;
    var y = 100;
    for(l of layers) {
        y = 100;
        if(l) {
            for(r=0;r<l.range;r++) {
                print(x, y, 'grey');
                y += 12;
            }   
        } else {
            print(x,y, 'lightgrey');
        }
        x+=8;
    }
    // Print scanners
    x = 20;
    for(l of layers) {
        y = 100;
        if(l) {
            var lid = l.layer;
            var pos = (time-1) % (scanners[lid].length-1); 
            var calc = scanners[lid][pos];
            print(x, y+calc*12, 'red');
        }
        x += 8;
    }
}

function print(x,y, mark) {
    ctx.fillStyle = mark;
    ctx.fillRect(x,y,5,10);
    ctx.stroke();
}


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
    var maze = data.split('\n').map(x => { return parseInt(x)});
    var current = 0;
    var steps = 1;
    while(steps < 500000) { // Hängslen & livrem
        var jump = maze[current];
        if(current + jump >= maze.length) break;
        maze[current]++;
        current += jump;

        steps++;
    }
    console.log('Part 1, number of steps ' + steps);

    // Copy paste för del 2
    var maze = data.split('\n').map(x => { return parseInt(x)});    
    var current = 0;
    var steps = 1;
    while(steps < 100000000) { // Hängslen & livrem
        var jump = maze[current];
        if(current + jump >= maze.length) break;
        if(jump >= 3) {
            maze[current]--;
        } else {
            maze[current]++;
        }
        current += jump;
        
        steps++;
    }
    console.log('Part 2, number of steps ' + steps);
});


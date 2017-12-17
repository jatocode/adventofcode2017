let steps = 324;
//let steps = 3;

var cp = 0;
var buffer = [cp];
for(let i=1;i<2018;i++) {
    let index = (cp+steps) % buffer.length + 1;
    buffer.splice(index, 0, i);
    cp = index;
}
var indexAfter = buffer.indexOf(2017);
console.log('Del 1: ' + buffer[(indexAfter + 1) % buffer.length]);

// Del 2
cp = 0;
after = 0;
for(let i=1;i<=50E6;i++) {
    let index = (cp+steps) % i + 1;
    cp = index;
    if(index == 1) {
        after = i;
    }
}
console.log('Del 2: ' + after);

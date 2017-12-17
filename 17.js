let steps = 324;
//let steps = 3;

var cp = 0;
var buffer = [cp];
for(let i=1;i<2018;i++) {
    let index = (cp+steps) % buffer.length + 1;
    //pb(cp, buffer);
    buffer.splice(index, 0, i);
    cp = index;
}
var i2017 = buffer.indexOf(2017);
console.log(buffer[(i2017 + 1) % buffer.length]);

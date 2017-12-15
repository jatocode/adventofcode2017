var input = [703,516];
//var input = [65, 8921];

var pairs = 40000000;

var prevA = input[0]; 
var prevB = input[1];
var judge = 0;
while(pairs-- > 0) {
    var prevA = (prevA * 16807) % 2147483647;
    var prevB = (prevB * 48271) % 2147483647;

    if((prevA & 0xffff) == (prevB & 0xffff)) judge++;

}
console.log('Part 1. The judge has counted: ' + judge);

// Part 2
prevA = input[0]; 
prevB = input[1];
pairs = 5000000;
var judge = 0;
for(i=0;i<pairs;i++) {
    do { prevA = (prevA * 16807) % 2147483647; } while(prevA % 4 !=0);
    do { prevB = (prevB * 48271) % 2147483647; } while(prevB % 8 !=0); 

    if((prevA & 0xffff) == (prevB & 0xffff)) judge++;

}
console.log('Part 2. The judge has counted: ' + judge);

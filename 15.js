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

//    if(pairs % 10000 == 0) console.log(pairs);

}
console.log('The judge has counted: ' + judge);


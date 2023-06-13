let a = 50;
let b = 20;

let c ='my name';
let d = ' is Ade';

let e = 'Thank God'
//you can change the name of the car
const car = ['honda', 'audi', 'toyota'];
car[0] = 'masda'

//you can add more cars,
car.push('benz', 'volvo', 'lamborghini','ferrari')
car[5] = 'austmatin'
car[3] = 'range rover'

const _cloth ={name:'Gucci',size: 30 ,color:'red and green' };
//you can change the property of objects
_cloth.name = 'fendi'
_cloth.size = 50
_cloth.color = 'blue'
//you can add to the properties of object
_cloth.owner = 'Adekunle Yusuf'

//you can do arithemetic operations
var x = 10;
x = (x += 5) * 2;

let p = 10;
let y = Math.pow(p,2);

let time = new Date();

let ade = 10, kunle = 10, shade  = 50;





function calculate(){
    
    let calculator = a++;
document.getElementById('calc').innerHTML = calculator;

    
    
 }
function submit(){
    
    let equal  = c + d;
document.getElementById('first').innerHTML = equal;
 }

document.getElementById('second').innerHTML = e;

document.getElementById('fourth'). innerHTML = car;


document.getElementById('cloth').innerHTML = 'The product'
+ ' of the dress is '+  _cloth.name + '. It has a size of ' + _cloth.size + ', and the color is ' + _cloth.color + '. The name of the owner is ' + _cloth.owner

document.getElementById('take').innerHTML = x;

document.getElementById('leave'). innerHTML = y;

document.getElementById('bring').innerHTML = time;


  
document.getElementById('talk').innerHTML = (shade!=kunle) + '<br>' + (ade ==shade);
 

function tryit(){
let point;
point = me.value; 
let type = point < 80 ? 'Poor':'Excellent';
you.innerHTML = 'this grade is' + '<br>' + type;

}
let me = document.getElementById('hey')

let you = document.getElementById('ade')

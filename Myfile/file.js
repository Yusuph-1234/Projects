
let a , b , c

a = 5;
b = 6;
c = 10;
console.log(a)

let g =6   //this is a literal//
  g++
console.log(g)

let h = 10%3  //this is a module//
console.log(h)

let y = 20    //this is a literal also//
y--
console.log(y)

let person = 'ade'  //this is a string//
console.log(person)


let v , t , u
v = 10;
t = 20; 
u = 60;

if (v > t){
    console.log("successful");
}else
if(v < t){
    console.log("unsuccessful")
}

let age;
age = 30

if(age < 18){
    console.log("deny")   //Deny user voting proccess//
}else;
if (age =>18){
    console.log("accept")   //Accept user voting proccess//
}



//to convert from fahrenheit to
function toCelsius(){
    let result= 5/9 *((calc.value-32));
ans.innerHTML= result;

}
let calc =document.getElementById('yes');
let ans = document.getElementById('ok');


// to check if you are eligible to vote or not
let  verification = document.getElementById("age")
    
function submit(){
    
if(verification.value < 18){
   alert("you are not eligible to vote")
}else
if (verification.value>= 18){
    alert("you are eligible to vote")
}

}

document.getElementById("demo") .innerHTML = 'BIG BROTHER NAIJA 2022/2023 VOTING SLOT';
    

// let me = new Date()
// let you =getDay()
// let  daniel = document.getElementById("call")
// let text;
// switch(me.you){
//     case 6:
//         text= "today is saturday";
//         break;

//         case 0:
//             text =  "today is sunday";
//             break;
//            default:
//             text = "we are looking forward to weekend";
//             break;
// }
// daniel.innerHTML = text;

let shade = document.getElementbyId('okay').text
let fruits = document.getElementbyId('now')
fruits.innerHTML = shade;

switch(fruits){
    case "banana":
    alert ('goodbye')
        break;
        case "mango":
        alert('welcome')
            break;
}

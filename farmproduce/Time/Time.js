let date = new Date();
let hour = date.getHours();

function reset(){

  document.getElementById('first').innerHTML = date
if (hour=0 || hour <12){
  alert('Good morning')
}else if (hour >=12 || hour < 18){
    alert('Good afternoon')
}else{
  alert('Good evening')
}

}
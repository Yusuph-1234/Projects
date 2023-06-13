let pin = Math.floor(Math.random()*900000000000+1000);
function generate(){
    
document.getElementById("enter") .innerHTML = pin + '<br>';
}

function save(){

    let demy = document.getElementById('demo');
    demy.innerHTML = pin + '<br>'
}


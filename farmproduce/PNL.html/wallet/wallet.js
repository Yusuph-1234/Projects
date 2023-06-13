

function deposit(){
    const amount = document.getElementById("amount").value
    const initialBal = 0
    
   let point = (initialBal ==='' || amount ==='') ? 'wallet is empty': ''
     document.getElementById('point').innerHTML = point
    const balance = Number(initialBal) + Number(amount)
    document.getElementById('bal').innerHTML = 'balance =' + balance
}

function withdraw(){
    const finalBal = document.getElementById("final").value
    const amount =document.getElementById("amount").value

    let point = ((amount <= finalBal) && (amount ===''|| finalBal ==='') )? 'Not sufficient fund': ''
    document.getElementById('point').innerHTML =  point

    const balance =Number(finalBal) - Number(amount)
    document.getElementById('bal').innerHTML = 'balance =' + balance

    
}

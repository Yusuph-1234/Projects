
var costPrice 
var sellingPrice;
var lose;

function profit(){
    const totalRevenue = document.getElementById('tr').value
    const totalExpense = document.getElementById('te').value

if(totalRevenue === "" || totalExpense === ""){
   return document.getElementById('err').innerHTML = "All input is required"
}else if(totalRevenue != "" & totalExpense != ""){
     document.getElementById('err').innerHTML = ""
}
    

const gain = Number(totalRevenue) - Number(totalExpense)

document.getElementById('result').innerHTML = "gain -" + gain

}
function loss(){
    const totalRevenue = document.getElementById('tr').value
    const totalExpense = document.getElementById('te').value

    if(totalRevenue==="" || totalExpense===""){
        return document.getElementById('err').innerHTML = "All input is required"
 }else if(totalRevenue != "" & totalExpense != ""){
    document.getElementById('err').innerHTML = ""
 }

    const loss = Number(totalExpense)- Number(totalRevenue)
    document.getElementById('result').innerHTML = "Loss -" + loss
}
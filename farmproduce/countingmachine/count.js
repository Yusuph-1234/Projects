let county= document.getElementById("counter");
    
     let entries=  document.getElementById("entries");
     let increment =0;
    
     function count(){
     increment+=1;
     county.textContent=increment;

    }
    
     function save(){
        let enter = increment + "-"

        entries.textContent= enter;
        increment=0;
        county.textContent=0;
      
     }
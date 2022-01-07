function addToCart(proId){
    
  var size = document.querySelector('input[name="size"]:checked').value;  
  console.log(size)
$.ajax({
    url:'/add-to-cart/',
    data:{
        proId:proId,
        size:size

    },
    method:'post',
    success:(response)=>{
        
        console.log(response);
        
        if(response.status){
            
            console.log(response);
            let count = $('#cartcount').html()
            count = parseInt(count)+1
            $('#cartcount').html(count)

        }
        else{
            location.href="/login"
        }
        
    }
})
}


 //number vallidation
 function validateNumber(e) {
    const pattern = /^[0-9]$/;
    return pattern.test(e.key )
}

 var loader = document.getElementById('preloader')
 window.addEventListener("load", function(){
     loader.style.display = "none"
 })






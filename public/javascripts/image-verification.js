
  function validate(){
      var name = document.getElementById('Name').value
        var fuData = document.getElementById('image1');
        var FileUploadPath = fuData.value;
        var fuData2 = document.getElementById('image2');
        var FileUploadPath2 = fuData2.value;
        var fuData3 = document.getElementById('image3');
        var FileUploadPath3 = fuData3.value;
        var fuData4 = document.getElementById('image4');
        var FileUploadPath4 = fuData4.value;
      
       
    if(name.trim()=="")
    {
      document.getElementById('message').innerHTML="product cannot be empty"
      window.location.href = "#add-product";
      return false;
    }
    else if(FileUploadPath == '') {
            document.getElementById('message').innerHTML="please upload an image"
            window.location.href = "#add-product";
            return false

        }
        else if(FileUploadPath2 == '') {
            document.getElementById('message').innerHTML="please upload an image"
            window.location.href = "#add-product";
            return false

        }
        else if(FileUploadPath3 == '') {
            document.getElementById('message').innerHTML="please upload an image"
            window.location.href = "#add-product";
            return false

        }
        else if(FileUploadPath4 == '') {
            document.getElementById('message').innerHTML="please upload an image"
            window.location.href = "#add-product";
            return false

        }
    
    else if(name.value.length.trim()<4)
    {
        document.getElementById('message').innerHTML="password is too short";
        password.style.border="2px solid red"
        return false;
    }
    
  }



    
    function ValidateFileUpload() {
        
        var fuData = document.getElementById('image1');
        var FileUploadPath = fuData.value;
        var Extension = FileUploadPath.substring(
                    FileUploadPath.lastIndexOf('.') + 1).toLowerCase();

//To check if user upload any file
        if (FileUploadPath == '') {
            alert("Please upload an image");
            return false

        } else {
            var Extension = FileUploadPath.substring(
                    FileUploadPath.lastIndexOf('.') + 1).toLowerCase(); 

//The file uploaded is an image

if (Extension == "gif" || Extension == "png" || Extension == "webp"
                    || Extension == "jpeg" || Extension == "jpg") {

// To Display
                if (fuData.files && fuData.files[0]) {
                    document.getElementById('imgview1').src=URL.createObjectURL(event.target.files[0])
                }

            } 

//The file upload is NOT an image
            else {
                document.getElementById('message').innerHTML="Photo only allows file types of GIF, PNG, JPG, JPEG . ";
                return false
                

            }
        }
    }



    function ValidateFileUpload2() {
        
        var fuData2 = document.getElementById('image2');
        var FileUploadPath2 = fuData2.value;
        var Extension2 = FileUploadPath2.substring(
                    FileUploadPath2.lastIndexOf('.') + 1).toLowerCase();

//To check if user upload any file
        if (FileUploadPath2 == '') {
            alert("Please upload an image");

        } else {
            var Extension2 = FileUploadPath2.substring(
                    FileUploadPath2.lastIndexOf('.') + 1).toLowerCase(); 

//The file uploaded is an image

if (Extension2 == "gif" || Extension2 == "png" || Extension2 == "webp"
                    || Extension2 == "jpeg" || Extension2 == "jpg") {

// To Display
                if (fuData2.files && fuData2.files[0]) {
                    document.getElementById('imgview2').src=URL.createObjectURL(event.target.files[0])
                }

            } 

//The file upload is NOT an image
            else {
                document.getElementById('message').innerHTML="Photo only allows file types of GIF, PNG, JPG, JPEG . ";
                return false

            }
        }
    }
    //third function
        function ValidateFileUpload3() {
        
        var fuData3 = document.getElementById('image3');
        var FileUploadPath3 = fuData3.value;
        var Extension3 = FileUploadPath3.substring(
                    FileUploadPath3.lastIndexOf('.') + 1).toLowerCase();

//To check if user upload any file
        if (FileUploadPath3 == '') {
            alert("Please upload an image");

        } else {
            var Extension3 = FileUploadPath3.substring(
                    FileUploadPath3.lastIndexOf('.') + 1).toLowerCase(); 

//The file uploaded is an image

if (Extension3 == "gif" || Extension3 == "png" || Extension3 == "webp"
                    || Extension3 == "jpeg" || Extension3 == "jpg") {

// To Display
                if (fuData3.files && fuData3.files[0]) {
                    document.getElementById('imgview3').src=URL.createObjectURL(event.target.files[0])
                }

            } 

//The file upload is NOT an image
            else {
                document.getElementById('message').innerHTML="Photo only allows file types of GIF, PNG, JPG, JPEG . ";

            }
        }
    }

        //fourth function
        function ValidateFileUpload4() {
        
        var fuData4 = document.getElementById('image4');
        var FileUploadPath4 = fuData4.value;
        var Extension4 = FileUploadPath4.substring(
                    FileUploadPath4.lastIndexOf('.') + 1).toLowerCase();

//To check if user upload any file
        if (FileUploadPath4 == '') {
            alert("Please upload an image");

        } else {
            var Extension4 = FileUploadPath4.substring(
                    FileUploadPath4.lastIndexOf('.') + 1).toLowerCase(); 

//The file uploaded is an image

if (Extension4 == "gif" || Extension4 == "png" || Extension4 == "webp"
                    || Extension4 == "jpeg" || Extension4 == "jpg") {

// To Display
                if (fuData4.files && fuData4.files[0]) {
                    document.getElementById('imgview4').src=URL.createObjectURL(event.target.files[0])
                }

            } 

//The file upload is NOT an image
            else {
                document.getElementById('message').innerHTML="Photo only allows file types of GIF, PNG, JPG, JPEG . ";

            }
        }
    }


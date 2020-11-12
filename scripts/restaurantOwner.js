$('body').children().filter(".loading-bg").css("position","fixed").css("top","0").css("left","0").css("z-index","6").css("width","100vw").css("height","100vh");

$(document).ready(function(){
  $('body').children().filter(".loading-bg").delay(900).fadeOut(800);

  
  $("button").on("click",function(event){

    var files = document.getElementById("restaurant-image").files;
    var imgArr = [];
    for(i = 0; i < files.length;i++){
      imgArr.push(files[i]["name"]);
    }
    
    var submission = {
      REST_NAME: $("#restaurant-name").parent().parent().find("input").val(),
      RESTBIO: $("#restaurant-bio").parent().parent().find("input").val(),
      CONTACT: {
        ADDRESS: $("#restaurant-address").parent().parent().find("input").val(),
        EMAIL: $("#restaurant-email").parent().parent().find("input").val(),
        PHONE: $("#restaurant-phone").parent().parent().find("input").val(),
      },
      SAFETY_PROTOCOL: {
        MASK_REQ: "true" == $("#restaurant-mask-req").parent().parent().find("select").val(),
        MAX_CUST:  parseInt($("#restaurant-max-cust").parent().parent().find("input").val()),
        TABLE_SPACE: parseInt($("#restaurant-table-space").parent().parent().find("input").val()),
      },
      TRAITS: {
        ONLINE_RESERVE: "true" == $("#restaurant-online-reserve").parent().parent().find("select").val(),
        TABLE_TRACK: "true" == $("#restaurant-table-track").parent().parent().find("select").val(),
        VERIFIED: "true" == $("#restaurant-verified").parent().parent().find("select").val(),
      },
      MENU: JSON.parse($(".restaurant-menu").val()),
      IMG_URL: imgArr,
      HOURS: {
        Mon: $("#restaurant-mon-from").val() +"-"+ $("#restaurant-mon-to").val(),
        Tue: $("#restaurant-tue-from").val() +"-"+ $("#restaurant-tue-to").val(),
        Wed: $("#restaurant-wed-from").val() +"-"+ $("#restaurant-wed-to").val(),
        Thu: $("#restaurant-thu-from").val() +"-"+ $("#restaurant-thu-to").val(),
        Fri: $("#restaurant-fri-from").val() +"-"+ $("#restaurant-fri-to").val(),
        Sat: $("#restaurant-sat-from").val() +"-"+ $("#restaurant-sat-to").val(),
        Sun: $("#restaurant-sun-from").val() +"-"+ $("#restaurant-sun-to").val(),
      }
    }
    db.collection("restaurants")
    .add(submission)
    .then(async function(docRef){
      var restaurantID = docRef.id;

      for(imgUrl in imgArr){
        // Create a root reference
        var storageRef = firebase.storage().ref();

        var imgRef = storageRef.child("restaurants/"+restaurantID+'/'+imgArr[imgUrl]);

        await imgRef.put(files[imgUrl]);
      }

      alert("added restaurantID: "+ restaurantID);
    },function(error){
      console.log(error);
    })
    
  });
});
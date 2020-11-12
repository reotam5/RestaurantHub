$('body').children().filter(".loading-bg").css("position","fixed").css("top","0").css("left","0").css("z-index","6").css("width","100vw").css("height","100vh");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uid = user.uid;
    var custRef = db.collection("users").doc(uid);
    
    listenReservation(custRef);
    listenNewName(uid);


    $("#profile-img").on("click",function(event){
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = "image/png, image/jpg"
      input.onchange = async selected => { 
        //uploading image file
        var file = selected.target.files[0];
        if(file.type == "image/png" || file.type == "image/jpg"){
          // Create a root reference
          var storageRef = firebase.storage().ref();
          var imgRef = storageRef.child("users/"+uid+'/profile.jpg');
          await imgRef.put(file);
        }else{
          alert("File type not allowed");
        }
  
        //downloading image file url and display
        //restaurant images 
        var storageRef = firebase.storage().ref().child("users/"+uid);
        var imgRef = storageRef.child("profile.jpg");
        await imgRef.getDownloadURL().then(function(url){
          $("#profile-img").attr("src",url);
        });
      }
      input.click();
  
    });
  
  
    var storageRef = firebase.storage().ref().child("users/"+uid);
    var imgRef = storageRef.child("profile.jpg");
    imgRef.getDownloadURL().then(function(url){
      $("#profile-img").attr("src",url);
    }, function(){
      console.log("User have not uploaded profile picture yet.");
    });
    
    $("div.user-name").on("click",function(event){
      
      if($(event.target).attr("id") == "editing-name"){
        return;
      }
      var currentName = $("#entered-name").html().trim();
      $("#entered-name").html($("<input id='editing-name' type='text'/>"));
      $("#editing-name").val(currentName);
      $("#editing-name").focus();
      $("#editing-name").on("blur keypress",function(event){
        if($("#editing-name").val().length < 2){
          alert("name length has to be bigger than 1");
          return;
        }
        if((event.which == 13 || event.which == 0)){
          var newName = $("#editing-name").val();
          $("#entered-name").html(newName);
          $("#editing-name").remove();
          db.collection("users").doc(uid).update("NAME",newName);
        }
      });
    });



    loadingDisable();
  } else {
    signInPrompt();
    loadingDisable();
    window.location.href = "login.html?url="+window.location.href;
  }
});

$(document).ready(function(){
  $('body').children().filter(".loading-bg").delay(900).fadeOut(800);
  


  


  var endThreshold = 70;
  $(window).scroll(function() {

    var scroll = $(window).scrollTop();
    if(scroll <=endThreshold){
      $("#profile").children().removeClass("invis");
      $("#profile").removeClass("profile-transform");
      $("#profile").children().filter("ul").removeClass("ul-transform");
      $("#tab-content-wrapper").css("margin-top","0");
    }else if(scroll >endThreshold){
      $("#profile").addClass("profile-transform");
      $("#profile").children().addClass("invis");
      $("#profile").children().filter("ul").removeClass("invis");
      $("#profile").children().filter("ul").addClass("ul-transform");
      $("#tab-content-wrapper").css("margin-top","160px");
    }
  });
  $("#pills-history-tab").on("click",function(){
    $("#profile").children().removeClass("invis");
    $("#profile").removeClass("profile-transform");
    $("#profile").children().filter("ul").removeClass("ul-transform");
    $("#tab-content-wrapper").css("margin-top","0");
  });
  $("#pills-upcoming-tab").on("click",function(){
    $("#profile").children().removeClass("invis");
    $("#profile").removeClass("profile-transform");
    $("#profile").children().filter("ul").removeClass("ul-transform");
    $("#tab-content-wrapper").css("margin-top","0");
  });

});


function listenNewName(uid){
  db.collection("users").doc(uid).onSnapshot(function (snap){
    $("#entered-name").html(snap.data()["NAME"]);
  });
}


function listenReservation(custRef){
  db.collection("reservations").where("CUST_ID","==",custRef).orderBy("DATE","asc").startAt(firebase.firestore.Timestamp.now())
  .onSnapshot(function(snapQuery){
    snapQuery.forEach(async snap => {
      //these are upcoming reservations
      var time = snap.data()["DATE"].toDate();
      await snap.data()["REST_ID"].get().then(async function(doc){
        var storageRef = firebase.storage().ref().child("restaurants/"+doc.id);
        var imgRef = storageRef.child(doc.data()["IMG_URL"][0]);
        await imgRef.getDownloadURL().then(function(imgUrl){
          createReservationBlock($("#upcoming-reservations"),"/restaurant.html?req="+doc.id,imgUrl,doc.data()["REST_NAME"],time.toUTCString());
        });
      });
      
    });
  });
  db.collection("reservations").where("CUST_ID","==",custRef).orderBy("DATE","asc").endAt(firebase.firestore.Timestamp.now())
  .onSnapshot(function(snapQuery){
    snapQuery.forEach(async snap => {
      //these are past reservations
      var time = snap.data()["DATE"].toDate();
      await snap.data()["REST_ID"].get().then(async function(doc){
        var storageRef = firebase.storage().ref().child("restaurants/"+doc.id);
        var imgRef = storageRef.child(doc.data()["IMG_URL"][0]);
        await imgRef.getDownloadURL().then(function(imgUrl){
          createReservationBlock($("#past-reservations"),"/restaurant.html?req="+doc.id,imgUrl,doc.data()["REST_NAME"],time.toUTCString());
        });
      });
    });
  });
}

function createReservationBlock(target,url,imgUrl,name,time){
  block =  '<div class="restaurant-section col-12 col-sm-12 col-md-6">';
  block += '  <img class="restaurant-img" src="'+imgUrl+'" />';
  block += '  <div class="restaurant-img-blur"></div>';
  block += '  <div class="restaurant-overwrap">';
  block += '    <a href="'+url+'" class="restaurant-url"></a>';
  block += '    <div class="restaurant-name">';
  block += '      '+name;
  block += '    </div>';
  block += '    <div class="restaurant-reservation">';
  block += '      '+time;
  block += '    </div>';
  block += '  </div>';
  block += '</div>';

  target.append(block);

}
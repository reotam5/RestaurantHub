//profile feature is only supported for logged in users
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uid = user.uid;
    var custRef = db.collection("users").doc(uid);
    
    //listen to reservation collection
    listenReservation(custRef);

    //listen to user collection so that it displays new name if user changed user name.
    listenNewName(uid);

    //clicking profile image allows user to upload user profile image.
    $("#profile-img").on("click",function(event){
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = "image/png, image/jpg"
      input.onchange = async selected => { 
        //uploading image file
        var file = selected.target.files[0];
        //dont allow none image files
        if(file.type == "image/png" || file.type == "image/jpg"){
          // Create a root reference
          var storageRef = firebase.storage().ref();
          //path to save
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
          //change displayed users image
          $("#profile-img").attr("src",url);
        });
      }

      //force open file choosing window
      input.click();

    });
  
    //initial load for user profile image
    var storageRef = firebase.storage().ref().child("users/"+uid);
    var imgRef = storageRef.child("profile.jpg");
    imgRef.getDownloadURL().then(function(url){
      $("#profile-img").attr("src",url);
    }, function(){
      console.log("User have not uploaded profile picture yet.");
    });
    
    //eidt user nanem
    $("div.user-name").on("click",function(event){
      
      if($(event.target).attr("id") == "editing-name"){
        return;
      }
      var currentName = $("#entered-name").html().trim();
      //create input form and focus that element
      $("#entered-name").html($("<input id='editing-name' type='text'/>"));
      $("#editing-name").val(currentName);
      $("#editing-name").focus();
      $("#editing-name").on("blur keypress",function(event){

        //enter or on blur(opposite of focus in jquery event)
        if((event.which == 13 || event.which == 0)){
          var newName = $("#editing-name").val();
          $("#entered-name").html(newName);
          $("#editing-name").remove();

          //update firestore name
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

  //threshold for css animation
  var endThreshold = 70;

  //animation on scroll event
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

//listen user name change
function listenNewName(uid){
  db.collection("users").doc(uid).onSnapshot(function (snap){
    $("#entered-name").html(snap.data()["NAME"]);
  });
}

//There are two parts that this functin is listening to.
//reservation that its DATE timestamp starts in the future.
//in that case, display block in upcoming-resevation div.
//if the reservation is in the past, display inpast-reservaitons div
function listenReservation(custRef){
  //order query by timestamp and cuts at current time
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
  //order query by timestamp and cuts at current time
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
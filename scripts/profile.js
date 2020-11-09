$('body').children().filter(".loading-bg").css("position","fixed").css("top","0").css("left","0").css("z-index","6").css("width","100vw").css("height","100vh");
var uid = "Ti1AGHZKdfhC7Wu2edpe";
var custRef = db.collection("users").doc(uid);
$(document).ready(function(){
  $('body').children().filter(".loading-bg").delay(900).fadeOut(800);
  
  listenReservation();


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

function listenReservation(){
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
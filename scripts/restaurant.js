/******************************************/
/* This is javascript for restaurant.html */
/******************************************/
var urlParams = new URLSearchParams(window.location.search);
var restID = urlParams.get("req");
if(restID == null){
  alert("Enter reataurantID param(?req=restaurantID)(THIS ALERT IS FOR DEBUGGING PURPOSE)");
}
uid = "Ti1AGHZKdfhC7Wu2edpe";
var custRef = db.collection("users").doc(uid);
var restRef = db.collection("restaurants").doc(restID);

$(document).ready(function() {

  $(function () {
    $('[data-toggle="popover"]').popover();
  })

  /* simulate click to go to reserve tab directly */
  var tarTab = urlParams.get("tab");
  if(tarTab != null){
    $("#"+tarTab).click()
  }


  checkFav();
  $(".setFav").on("click",function(event){
    setFav();
  });

  
  listenRestaurant(restID);

  listenReviews(restID);

  //signInPrompt();
});

function setFav(){

  db.collection("fav_restaurant")
  .where("CUST_ID","==", custRef)
  .where("REST_ID","==",restRef)
  .get()
  .then(function(query){
    if(!query.empty){
      $(".setFav").css("filter","invert(0.5)").attr("data-content","Click to set as a favorite");
      query.forEach(doc =>{
        db.collection("fav_restaurant").doc(doc.id).delete();
      });
    }else{
      $(".setFav").css("filter","invert(1)").attr("data-content","Click to remove from favorite");
      var favInfo = {
        CUST_ID: custRef,
        DATE: firebase.firestore.FieldValue.serverTimestamp(),
        REST_ID: restRef
      }
      db.collection("fav_restaurant").add(favInfo);
    }
  });
}
function checkFav(){
  db.collection("fav_restaurant")
  .where("CUST_ID","==", custRef)
  .where("REST_ID","==",restRef)
  .get()
  .then(function(query){
    if(!query.empty){
      $(".setFav").css("filter","invert(1)").attr("data-content","Click to remove from favorite");
    }else{
      $(".setFav").css("filter","invert(0.5)").attr("data-content","Click to set as a favorite");
    }
  });
}


function setStar(stars){
  if(stars <= 5 && stars >=0){
    for(i = 0; i <= stars; i++){
      $("#star"+i).attr("src","images/darkStar.png");
    }
  }
}

function listenRestaurant(restID){
  db.collection("restaurants").doc(restID)
  .onSnapshot(function(snap){
    var name = snap.data()["REST_NAME"];
    var bio = snap.data()["REST_BIO"];
    var image = snap.data()["IMG_URL"];
    var hours = snap.data()["HOURS"];
    var safety = snap.data()["SAFETY_PROTOCOL"];
    var traits = snap.data()["TRAITS"];
    var contact = snap.data()["CONTACT"];
    var menu = snap.data()["MENU"];
    updatePage(restID,name,bio,image,hours,safety,traits,contact,menu);
  });
}

function updatePage(restID,name,bio,image,hours,safety,traits,contact,menu){
  var storageRef = firebase.storage().ref().child("restaurants/"+restID);

  //hours
  $(".days.mon").find(".hours").html(hours["Mon"]);
  $(".days.tue").find(".hours").html(hours["Tue"]);
  $(".days.wed").find(".hours").html(hours["Wed"]);
  $(".days.thu").find(".hours").html(hours["Thu"]);
  $(".days.fri").find(".hours").html(hours["Fri"]);
  $(".days.sat").find(".hours").html(hours["Sat"]);
  $(".days.sun").find(".hours").html(hours["Sun"]);

  //restaurant images 
  if(image.length > 0){
    var block = '<div class="carousel-item">';
    block +=    '  <img src="images/restaurant.jpg" class="d-block w-100" alt="...">';
    block +=    '</div>';
    var is_first = true;
    for(url in image){
      var targetUrl = image[url];
      var imgRef = storageRef.child(targetUrl);
      imgRef.getDownloadURL().then(function(url){
        if(is_first){
          is_first = false;
          var carousel = $(block).addClass("active");
        }else{
          var carousel = $(block)
        }
        carousel.find("img").attr("src",url)
        $(".carousel-inner").append(carousel);
      });
    }
  }else{
    $(".restaurant-pictures").remove();
  }
  
  //traits
  if(!traits["ONLINE_RESERVE"]){
    $("img.reserveIcon").remove();
  }
  if(!traits["TABLE_TRACK"]){
    $("img.tableTracker").remove();
  }
  if(!traits["VARIFIED"]){
    $("img.verifiedHours").remove();
  }

  //name
  $(".restaurantName").html(name);
  
  //contact
  $("#rest-address").html("Address:&nbsp;"+contact["ADDRESS"]);
  $("#rest-email").html("Email:&nbsp;"+contact["EMAIL"]);
  $("#rest-phone").html("Phone:&nbsp;"+contact["PHONE"]);

  //bio
  $(".restaurant-bio").append(bio)

  //menu
  var menuBlock = '<div class="card">';
  menuBlock +=    ' <div class="card-header">';
  menuBlock +=    '   <h2 class="mb-0">';
  menuBlock +=    '     <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" aria-expanded="false">';
  menuBlock +=    '       ';
  menuBlock +=    '     </button>';
  menuBlock +=    '   </h2>';
  menuBlock +=    ' </div>';
  menuBlock +=    ' <div class="collapse" data-parent="#restaurantMenu">';
  menuBlock +=    '   <div class="card-body">';
  menuBlock +=    '     <ul>';
  menuBlock +=    '     </ul>';
  menuBlock +=    '   </div>';
  menuBlock +=    ' </div>';
  menuBlock +=    '</div>';

  
  for(let category in menu){
    editBlock = $(menuBlock);
    
    editBlock.find(".card-header").attr("id",category);
    editBlock.find(".collapse")
      .attr("aria-labelledby",category)
      .attr("id","collapse-"+category);
    editBlock.find("button")
      .attr("data-target","#collapse-"+category)
      .attr("aria-controls","collapse-"+category)
      .html(category);
    
    for(let food in menu[category]){
      var price = menu[category][food];
      editBlock.find("ul")
        .append($("<li>"+food+" ----- "+price+"</li>"));
    }
    $("#restaurantMenu").append(editBlock);
  }
}


function listenReviews(restID){
  var restRef = db.collection("restaurants").doc(restID);
  var starArr = [];
  db.collection("reviews")
  .where("REST_ID","==",restRef)
  .onSnapshot(function(snapQuery){
    snapQuery.forEach(snap =>{
      var cust_name = snap.data()["CUST_NAME"];
      var date = snap.data()["DATE"];
      var review = snap.data()["REVIEW"];
      var stars = snap.data()["STARS"];
      starArr.push(stars);
      updateReviews(cust_name,date,review,stars);
    });

    var sum = 0;
    for(star in starArr){
      sum += starArr[star];
    }
    var avg = sum / starArr.length;
    setStar(avg);
  });
}
function updateReviews(cust_name,date,review,stars){
  //review (dont list more than 5)
  var reviewBlock = '<div class="media" style="border-radius: 5px; padding: 10px; margin-bottom:10px; border: gray 2px solid;">';
  reviewBlock +=    '  <div class="media-body review-div">';
  reviewBlock +=    '    <h5 class="mt-0 review-author"></h5>';
  reviewBlock +=    '  </div>';
  reviewBlock +=    '</div>';
    
  var editBlock = $(reviewBlock);
  editBlock.find(".review-author").html(cust_name);
  editBlock.find(".review-div").append(review);
  $(".restaurant-reviews").append(editBlock);
}


var info = {
  CONTACT:{
    ADRESS: "hello St",
    EMAIL: "dummy@dum.com",
    PHONE: "423-234-2341"
  },
  HOURS:{
    Mon: "XX:XX-XX:XX",
    Tue: "XX:XX-XX:XX",
    Wed: "XX:XX-XX:XX",
    Thu: "XX:XX-XX:XX",
    Fri: "XX:XX-XX:XX",
    Sat: "XX:XX-XX:XX",
    Sun: "XX:XX-XX:XX",
  },
  IMG_URL: ["images/restaurant1.jpg","sample.jpg"],
  REST_BIO: "short description goes here",
  REST_NAME: "Restaurant 2",
  MENU: {
    "Desert": {
      sample1:"$1",
      sample2:"$1",
      sample3:"$1",
      sample4:"$1",
      sample5:"$1",
    },
    "Drink": {
      sample1:"$1",
      sample2:"$1",
      sample3:"$1",
      sample4:"$1",
      sample5:"$1",
    },
    "Food": {
      sample1:"$1",
      sample2:"$1",
      sample3:"$1",
      sample4:"$1",
      sample5:"$1",
    },
    "Something else": {
      sample1:"$1",
      sample2:"$1",
      sample3:"$1",
      sample4:"$1",
      sample5:"$1",
    },

  },
  SAFETY_PROTOCOL: {
    MASK_REQ: true,
    MAX_CUST: 15,
    TABLE_SPACE: 2
  },
  TRAITS: {
    ONLINE_RESERVE: false,
    TABLE_TRACK: true,
    VARIFIED: false
  }
}
//db.collection("restaurants").add(info);
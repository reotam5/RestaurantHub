/******************************************/
/* This is javascript for restaurant.html */
/******************************************/
var urlParams = new URLSearchParams(window.location.search);
var restID = urlParams.get("req");
if(restID == null){
  alert("Enter reataurantID param(?req=restaurantID)(THIS ALERT IS FOR DEBUGGING PURPOSE)");
}else{
  var restRef = db.collection("restaurants").doc(restID);
}


$(document).ready(async function() {
  //enable loading screen
  loadingEnable();
  var uid;
  await firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid;
      var custRef = db.collection("users").doc(uid);
      //check if the restaurant is in favorite list
      checkFav(custRef);
      //toggle farovite on click
      $(".setFav").on("click",function(event){
        toggleFav(custRef);
      });
    } else {
      $(".setFav").on("click",function(event){
        signInPrompt();
      });
    }
  });
  

  //enable boostrap popover
  $('[data-toggle="popover"]').popover();

  // simulate click to go to reserve tab directly
  var tarTab = urlParams.get("tab");
  if(tarTab != null){
    $("#"+tarTab).click()
  }

  //create restaurant object for current page
  var restaurant = new Restaurant(restID);
  //await so until all instance variables are ready to use.
  await restaurant.updateVariables(false);

  //updating html
  restaurant.updatePage();

  

  //listner for reviews and stars
  listenReviews(restaurant);

  //loading screen disabled.
  loadingDisable();
  //signInPrompt();
});

function toggleFav(custRef){

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
function checkFav(custRef){
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

function listenReviews(Restaurant){
  var restRef = Restaurant.ref;
  db.collection("reviews")
  .where("REST_ID","==",restRef)
  .onSnapshot(snapQuery=>{
    //initialize reviews and stars
    var starArr = [];
    $(".restaurant-reviews").children().filter(".media").remove();

    //loop through all reviews
    snapQuery.forEach(snap =>{
      var cust_name = snap.data()["CUST_NAME"];
      var date = snap.data()["DATE"];
      var review = snap.data()["REVIEW"];
      var stars = snap.data()["STARS"];
      starArr.push(stars);
      updateReviews(cust_name,date,review,stars);
    });

    //changing stars.
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

function setStar(stars){
  if(stars <= 5 && stars >=0){
    $(".restaurantStars").children().filter("img").attr("src","images/star.png");
    for(i = 0; i <= stars; i++){
      $("#star"+i).attr("src","images/darkStar.png");
    }
  }
}


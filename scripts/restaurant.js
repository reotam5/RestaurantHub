/******************************************/
/* This is javascript for restaurant.html */
/******************************************/
var urlParams = new URLSearchParams(window.location.search);

//restaurnt page url has to have parameter req=REST_ID
//so that page and display corresponding restaurnt information
var restID = urlParams.get("req");
var form = document.querySelector("#reservation");
if (restID == null) {
  alert("Enter reataurantID param(?req=restaurantID)(THIS ALERT IS FOR DEBUGGING PURPOSE)");
} else {
  var restRef = db.collection("restaurants").doc(restID);
}



$(document).ready(async function () {

  var uid;
  await firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      var custRef = db.collection("users").doc(uid);
      //check if the restaurant is in favorite list
      checkFav(custRef);
      //toggle farovite on click
      $(".setFav").on("click", function (event) {
        //set or unset favorite depending on current status
        toggleFav(custRef);
      });
    } else {
      //if user clicked setFav(setting as farovite restaurant, it prompts to login)
      $(".setFav").on("click", function (event) {
        signInPrompt();
      });
    }
  });


  //enable boostrap popover
  $('[data-toggle="popover"]').popover();

  // simulate click to go to reserve tab directly
  var tarTab = urlParams.get("tab");
  if (tarTab != null) {
    $("#" + tarTab).click()
  }

  //create restaurant object for current page
  var restaurant = new Restaurant(restID);
  //await so until all instance variables are ready to use.
  await restaurant.updateVariables(false);

  //listen to changes and updates html
  restaurant.updateListner();

  //setup review modal for this restaurant
  restaurant.setUpReview();
  


  //listner for reviews and stars
  listenReviews(restaurant);

  //loading screen disabled.
  loadingDisable();
  //signInPrompt();

  //submit reservation on click
  $("#reserve-submit").on("click", function (event) {
    var user = firebase.auth().currentUser;

    if (user) {
      db.collection("reservations").add({
          DATE: new Date($("#datepickerf").val()),
          REST_ID: db.collection("restaurants").doc(restID),
          CUST_ID: db.collection("users").doc(user.uid)
        })
        .then(function (docRef) {
          alert("Reservation has been made successfully.")
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    } else {
      signInPrompt();
    }
  })
});

//if this restaurnt was already in favorite list, remove from favorite.
//if not, set this restaurnt as favorite
function toggleFav(custRef) {
  db.collection("fav_restaurant")
    .where("CUST_ID", "==", custRef)
    .where("REST_ID", "==", restRef)
    .get()
    .then(function (query) {
      if (!query.empty) {
        $(".setFav").css("filter", "invert(0.5)").attr("data-content", "Click to set as a favorite");
        query.forEach(doc => {
          db.collection("fav_restaurant").doc(doc.id).delete();
        });
      } else {
        $(".setFav").css("filter", "invert(1)").attr("data-content", "Click to remove from favorite");
        var favInfo = {
          CUST_ID: custRef,
          DATE: firebase.firestore.FieldValue.serverTimestamp(),
          REST_ID: restRef
        }
        db.collection("fav_restaurant").add(favInfo);
      }
    });
}

//this is called initially when page is loaded
//to check current favorite status
function checkFav(custRef) {
  db.collection("fav_restaurant")
    .where("CUST_ID", "==", custRef)
    .where("REST_ID", "==", restRef)
    .get()
    .then(function (query) {
      if (!query.empty) {
        $(".setFav").css("filter", "invert(1)").attr("data-content", "Click to remove from favorite");
      } else {
        $(".setFav").css("filter", "invert(0.5)").attr("data-content", "Click to set as a favorite");
      }
    });
}

//listen to review collection where REST_ID is this restaurant
//updates page if changed
function listenReviews(Restaurant) {
  var restRef = Restaurant.ref;
  db.collection("reviews")
    .where("REST_ID", "==", restRef)
    .onSnapshot(snapQuery => {
      //initialize reviews and stars
      var starArr = [];
      $(".restaurant-reviews").children().filter(".media").remove();

      //loop through all reviews
      snapQuery.forEach(snap => {
        var cust_name = snap.data()["CUST_NAME"];
        var cust_ID = snap.data()["CUST_ID"];
        var date = snap.data()["DATE"].toDate();
        var review = snap.data()["REVIEW"];
        var stars = snap.data()["STARS"];
        starArr.push(stars);
        updateReviews(cust_ID,cust_name, date, review, stars);
      });

      //changing stars.
      var sum = 0;
      for (star in starArr) {
        sum += starArr[star];
      }
      var avg = sum / starArr.length;

      //check if avg is valid
      if (avg <= 5 && avg >= 0) {
        $(".restaurantStars").children().filter("img").attr("src", "images/star.png");

        //loop through (avg) times and change those images
        for (i = 0; i <= avg; i++) {
          $("#star" + i).attr("src", "images/darkStar.png");
        }
      }
    });
}

//write review from information in parameter
function updateReviews(cust_ID,cust_name, date, review, stars) {

  var reviewBlock = '<div class="media" style="border-radius:10px; background-color:rgb(220,220,220); padding: 10px; margin-bottom:10px;">';
  reviewBlock += '    <img class="customer-profile-pic align-self-center mr3" src="images/person.png" style="height:60px; margin:10px;"/>';
  reviewBlock += '    <div class="media-body review-div" style="font-size:15pt;">';
  reviewBlock += '      <h5 class="mt-0 review-author"></h5>';
  reviewBlock += '      <div class="customerReviewStar">';
  reviewBlock += '        <img class="rStar" id="crStar1" src="images/star.png">';
  reviewBlock += '        <img class="rStar" id="crStar2" src="images/star.png">';
  reviewBlock += '        <img class="rStar" id="crStar3" src="images/star.png">';
  reviewBlock += '        <img class="rStar" id="crStar4" src="images/star.png">';
  reviewBlock += '        <img class="rStar" id="crStar5" src="images/star.png">';
  reviewBlock += '      </div>';
  reviewBlock += '      <span class="review-date" style="font-weight:bold; font-size:10pt;"></span><br/>';
  reviewBlock += '      <div class="review-content"></div><br/>';
  reviewBlock += '    </div>';
  reviewBlock += '</div>';

  var editBlock = $(reviewBlock);
  editBlock.find(".review-author").html(cust_name);
  editBlock.find(".review-content").append(review);
  editBlock.find(".review-date").html(new Date(date).toUTCString());
  if (stars <= 5 && stars >= 0) {
    editBlock.find(".rStar").attr("src", "images/star.png");
    for (i = 0; i <= stars; i++) {
      editBlock.find("#crStar" + i).attr("src", "images/darkStar.png");
    }
  }

  //getting profile.jpg from firebase storage
  var storageRef = firebase.storage().ref().child("users/"+cust_ID.id);
  var imgRef = storageRef.child("profile.jpg");
  imgRef.getDownloadURL().then(function(url){
    editBlock.find(".customer-profile-pic").attr("src",url);
  },function(error){
    //console.log("No user icon uploaded yet.");
  });

  $(".restaurant-reviews").append(editBlock);
}

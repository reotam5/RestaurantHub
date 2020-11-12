/******************************************/
/* This is javascript for main.html */
/******************************************/
$(document).ready(function () {
  // let listHours1 = "<p>Monday - 10:00AM - 10:00PM</p>" +
  //   "<p>Tuesday - 10:00AM - 10:00PM</p>" +
  //   "<p>Wednesday - Closed</p>" +
  //   "<p>Thursday - 10:00AM - 10:00PM</p>" +
  //   "<p>Friday - 10:00AM - 10:00PM</p>" +
  //   "<p>Saturday - 10:00AM - 10:00PM</p>" +
  //   "<p>Sunday - 12:00AM - 8:00PM</p>"
  // let rest1 = ["keg", "/images/keg.jpg", true, true, false, listHours1]
  // createPanel(rest1[0], rest1[1], rest1[2], rest1[3], rest1[4], rest1[5]);
  // createPanel("joeys", rest1[1], rest1[2], rest1[3], rest1[4], rest1[5]);

  db.collection("restaurants").get().then(function(querySnapshot) {
    querySnapshot.forEach(async function(doc) {
      console.log(doc.id, " => ", doc.data());
      var name = doc.get("REST_NAME");

      var restID = doc.id;
      var storageRef = firebase.storage().ref().child("restaurants/" + restID);
      var img = doc.get("IMG_URL");
      var imgRef = storageRef.child(img[0]);
      var imgURL = await imgRef.getDownloadURL();
      console.log(imgURL);
      
      // imgRef.getDownloadURL().then(function(url){
      //   imgURL = url;
      // });

      var traits = doc.get("TRAITS");
      var reserve = traits["ONLINE_RESERVE"];
      var tracker = traits["TABLE_TRACK"];
      var verified = traits["VERIFIED"];

      var hours = doc.get("HOURS");
      let listHours = "<p>Monday - " + hours["Mon"] + "</p>" +
        "<p>Tuesday - " + hours["Tue"] + "</p>" +
        "<p>Wednesday - " + hours["Wed"] + "</p>" +
        "<p>Thursday - " + hours["Thu"] + "</p>" +
        "<p>Friday - " + hours["Fri"] + "</p>" +
        "<p>Saturday - " + hours["Sat"] + "</p>"  +
        "<p>Sunday - " + hours["Sun"] + "</p>" 

      createPanel(restID, name, imgURL, reserve, tracker, verified, listHours);
    });
});
});

function createPanel(id, name, img, reserve, tracker, verified, hours) {
  $(".wrapper").append($(".restaurant-info").clone().removeClass("restaurant-info").addClass("restaurant-panel-" + id));
  let x = ".restaurant-panel-" + id;
  $(x + " .restaurant-image > img").attr("src", img).attr("alt", "the-keg");
  $(x + " .restaurant-name").append(name);
  $(x + " .restaurant-image").append($("<a href='restaurant.html?req="+id+"'></a>").css("display","block").css("height","100%").css("width","90%").css("transform","translateY(-100%)"));
  if (reserve == true) {
    $(x + " .restaurant-details .restaurant-icons").append("<img class=\"icon\" src=\"images/calendar.png\"/>")
  }
  if (tracker == true) {
    $(x + " .restaurant-details .restaurant-icons").append("<img class=\"icon\" src=\"images/tableTracker.png\"/>")
  }
  if (verified == true) {
    $(x + " .restaurant-details .restaurant-icons").append("<img class=\"icon\" src=\"images/verifiedHours.png\"/>")
  }
  $(x + " .restaurant-details .hours").append(hours);
}

//Temporary/scuffed script for sortby dropdown active class

$('#sortby1').on('click', function (e) {
  $('#sortby1').each(function () {
    $(this).addClass('active');
    $("#sortby2").removeClass('active');
    $("#sortby3").removeClass('active');
  })

});

$('#sortby2').on('click', function (e) {
  $('#sortby2').each(function () {
    $(this).addClass('active');
    $("#sortby1").removeClass('active');
    $("#sortby3").removeClass('active');
  })

  $('#sortby3').on('click', function (e) {
    $('#sortby3').each(function () {
        $(this).addClass('active');
        $("#sortby1").removeClass('active');
        $("#sortby2").removeClass('active');
    })

});  
});
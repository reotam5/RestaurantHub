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

  //get all restaurants
  db.collection("restaurants").get().then(function(queryDoc) {
    queryDoc.forEach(function(doc) {
      makeBlock(doc);
    });
  });

  //when filter is applied, simulate search button.
  $("#filter-apply").on('click',function(){
    $("#keySearching").trigger("submit");
  });


  $('#keySearching').submit(async function (e) {
    e.preventDefault();
    var query = db.collection("restaurants");
    //reading through all restaurant
    await query.get().then(querySnapshot => {
      querySnapshot.forEach(async doc => {
        var name = await doc.data()["REST_NAME"];

        //N-Gram is a search algorithm.
        //tri-gram will separate name into list of words consisting of 3 letters.restaurant-panel
        //restaurant becomes -> ["res","est","eta","tau","aur","ura","ran","ant","restaurant"].
        var keywords = triGram(name);
        
        var keyMap = {};
        for(key in keywords){
          keyMap[keywords[key]] = true;
        }
        //upload keymap for searching next step
        await query.doc(doc.id).update("tokenMap",keyMap);
      });
    });

    //trigram of the search keyword
    var keywords = triGram(document.getElementById("restaurant_search").value);

    $(".restaurant-panel").remove();

    var restDocs = {};
    if(keywords.length == 1 && keywords[0] == ""){
      //empty keyword => display all restaurant
      var docQuery = await query.get();
      docQuery.forEach(doc =>{
        makeBlock(doc);
      });
    }else{

      //display restaurant if any of trigram of search word and restaurant name matched
      keywords.forEach(async word =>{
        var targetQuery = query.where(`tokenMap.${word}`, "==", true);
        var docQuery = await targetQuery.get();

        docQuery.forEach(doc =>{
          if(restDocs[doc.id] != "visited"){
            restDocs[doc.id] = "visited";
            makeBlock(doc);
          }
        });
      });
    }
    searchNoMatching();

  });

  //sorting 
  $(".dropdown-menu > .dropdown-item").on("click", async function(){

    //sort price low to high
    if($(".dropdown-menu > .active").hasClass("price-l-h")){
      var length = $(".restaurant-panel").length;
      var info = [];
      for(var i = 0; i < length; i++){
        var id = $($(".restaurant-panel")[i]).attr("id");
        var ref = db.collection("restaurants").doc(id);
        //get price range for the displayed restaurants
        await ref.get().then(async function(doc){
          var price = doc.data()["PRICE_RANGE"];
          info.push({
            element: $($(".restaurant-panel")[i]),
            price: price
          });
        });
      }
      //sort by price range
      info.sort(function(a,b){
        return a.price - b.price;
      });
      $(".restaurant-panel").remove();

      //display restaurants
      info.forEach(block =>{
        $(".container").append(block["element"]);
      });

    //sort restaurant price high to low
    }else if($(".dropdown-menu > .active").hasClass("price-h-l")){
      var length = $(".restaurant-panel").length;
      var info = [];
      for(var i = 0; i < length; i++){
        var id = $($(".restaurant-panel")[i]).attr("id");
        var ref = db.collection("restaurants").doc(id);
        //get displayed restaurants price range
        await ref.get().then(async function(doc){
          var price = doc.data()["PRICE_RANGE"];
          info.push({
            element: $($(".restaurant-panel")[i]),
            price: price
          });
        });
      }

      //sort by rice range
      info.sort(function(a,b){
        return b.price - a.price;
      });
      $(".restaurant-panel").remove();

      //diaplay list in price order
      info.forEach(block =>{
        $(".container").append(block["element"]);
      });

    //sort by rating
    }else if($(".dropdown-menu > .active").hasClass("rating")){
      var length = $(".restaurant-panel").length;
      var info = [];
      for(var i = 0; i < length; i++){
        var id = $($(".restaurant-panel")[i]).attr("id");
        var ref = db.collection("restaurants").doc(id);
        //get all ratings from reviews collection
        await db.collection("reviews").where("REST_ID","==",ref).get().then(function(queryDoc){
          var size = queryDoc.size;
          var count = 0;
          queryDoc.forEach(doc =>{
            count += parseInt(doc.data()["STARS"]);
          });
          //calculate avg of the rating
          var avg = Math.round(count/size);
          if(Number.isNaN(avg)){
            avg = 0;
          }
          info.push({
            element: $($(".restaurant-panel")[i]),
            avg: avg
          });
        });
      }
      //sort by avg rating
      info.sort(function(a,b){
        return b.avg - a.avg
      });

      //display in terms of rating
      $(".restaurant-panel").remove();
      info.forEach(block =>{
        $(".container").append(block["element"]);
      });
      
    }else if($(".dropdown-menu > .active").hasClass("table-availability")){
      //this feature need collaboration with resutarnt owners
      console.log("this feature needs some functionality to track current restaurant availability");
    }

    //checks if restaurnt exists in the page, and if not, display "not found" message
    searchNoMatching();
  });

});

//this function prepares necessary information to display restuarnt list divs 
//and calls createPanel to actually display block
async function makeBlock(doc){
  //parameter doc consists of restaurnt information from firebase.

  var filter_verified = $("#verified-hours-check").is(":checked");
  var filter_table = $("#table-tracker-check").is(":checked");
  var filter_mask = $("#require-mask-check").is(":checked");
  var filter_reserve = $("#online-reservation-check").is(":checked");
  var filter_max = $("#max-customer-check").val();
  var filter_space = $("#table-spacing-check").val();

  var traits = doc.get("TRAITS");
  var reserve = traits["ONLINE_RESERVE"];
  var tracker = traits["TABLE_TRACK"];
  var verified = traits["VERIFIED"];

  var safetySet = doc.get("SAFETY_PROTOCOL");
  var mask = safetySet["MASK_REQ"];
  var max = safetySet["MAX_CUST"];
  var space = safetySet["TABLE_SPACE"];


  //return to exit without any block for not mathcnig case.
  //for example, if restaurnt does not require mask but user is looking for restaurnt 
  //that requires masks, that restauant will not be displayed.
  if(filter_verified){
    if(!verified){
      return;
    }
  }
  if(filter_table){
    if(!tracker){
      return;
    }
  }
  if(filter_mask){
    if(!mask){
      return;
    }
  }
  if(filter_reserve){
    if(!reserve){
      return;
    }
  }
  if(filter_space>0){
    if(space > filter_space){
      return;
    }
  }
  if(filter_max>0){
    if(max > filter_max){
      return;
    }
  }

  //prepare variables for future need
  var name = doc.get("REST_NAME");
  var restID = doc.id;
  var storageRef = firebase.storage().ref().child("restaurants/" + restID);
  var img = doc.get("IMG_URL");
  var imgRef = storageRef.child(img[0]);
  var imgURL = await imgRef.getDownloadURL();

  //make block for hours
  var hours = doc.get("HOURS");
  let listHours = "<p>Monday - " + hours["Mon"] + "</p>" +
    "<p>Tuesday - " + hours["Tue"] + "</p>" +
    "<p>Wednesday - " + hours["Wed"] + "</p>" +
    "<p>Thursday - " + hours["Thu"] + "</p>" +
    "<p>Friday - " + hours["Fri"] + "</p>" +
    "<p>Saturday - " + hours["Sat"] + "</p>"  +
    "<p>Sunday - " + hours["Sun"] + "</p>" 

  //display block
  createPanel(restID, name, imgURL, reserve, tracker, verified, listHours);
}

//N-Gram is a search algorithm.
//tri-gram will separate name into list of words consisting of 3 letters.restaurant-panel
//restaurant becomes -> ["res","est","eta","tau","aur","ura","ran","ant","restaurant"].
function triGram(word){
  var set = 3;
  var arr = [];
  var words = word.toLowerCase().trim().split(" ");
  for(key in words){
    var length = words[key].length;
    arr.push(words[key]);
    for(var i = 0; i < length-set+1; i++){
      arr.push(words[key].substring(i,i+set));
    }
  }
  //output is [""]
  return arr;
}

//display resutanrt list
function createPanel(id, name, img, reserve, tracker, verified, hours) {
  $("#no-matching").remove();

  $(".container").append($(".restaurant-info").clone().removeClass("restaurant-info").addClass("restaurant-panel-" + id).addClass("restaurant-panel").attr('id',id));
  let x = ".restaurant-panel-" + id;
  $(x + " .restaurant-image > img").attr("src", img).addClass("imgScale").attr("alt", "the-keg");
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

//make sure only one item in dropdown is active.
$(".dropdown-item").on("click",function(e){
  $(".dropdown-item").removeClass("active");
  $(e.target).addClass("active");
});

//checks if there is no restaurnt panel displayed in the list.
//If there is none, display "no matching found" message.
function searchNoMatching(){
  if($(".restaurant-panel").length == 0){
    $(".restaurant-panel").remove();
    $("#no-matching").remove();
    $(".container").append($("<div id='no-matching' style='color:white;'>No matcing found. Please try using other words.</div>"));
  }
}

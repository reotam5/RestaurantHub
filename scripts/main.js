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
    querySnapshot.forEach(function(doc) {
      makeBlock(doc);
    });
  });

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
        var keywords = triGram(name);
        var keyMap = {};
        for(key in keywords){
          keyMap[keywords[key]] = true;
        }
        //upload token map for searching next step
        await query.doc(doc.id).update("tokenMap",keyMap);
      });
    });

    var keywords = triGram(document.getElementById("restaurant_search").value);

    $(".restaurant-panel").remove();
    var restDocs = {};
    if(keywords.length == 1){
        var docQuery = await query.get();
        docQuery.forEach(doc =>{
          makeBlock(doc);
        });
    }else{
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

  });

});


async function makeBlock(doc){

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
    if(space < filter_space){
      return;
    }
  }
  if(filter_max>0){
    if(max < filter_max){
      return;
    }
  }



  var name = doc.get("REST_NAME");
  var restID = doc.id;
  var storageRef = firebase.storage().ref().child("restaurants/" + restID);
  var img = doc.get("IMG_URL");
  var imgRef = storageRef.child(img[0]);
  var imgURL = await imgRef.getDownloadURL();    
  // imgRef.getDownloadURL().then(function(url){
  //   imgURL = url;
  // });

  var hours = doc.get("HOURS");
  let listHours = "<p>Monday - " + hours["Mon"] + "</p>" +
    "<p>Tuesday - " + hours["Tue"] + "</p>" +
    "<p>Wednesday - " + hours["Wed"] + "</p>" +
    "<p>Thursday - " + hours["Thu"] + "</p>" +
    "<p>Friday - " + hours["Fri"] + "</p>" +
    "<p>Saturday - " + hours["Sat"] + "</p>"  +
    "<p>Sunday - " + hours["Sun"] + "</p>" 

  createPanel(restID, name, imgURL, reserve, tracker, verified, listHours);
}

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
  return arr;
}

function createPanel(id, name, img, reserve, tracker, verified, hours) {
  $(".container").append($(".restaurant-info").clone().removeClass("restaurant-info").addClass("restaurant-panel-" + id).addClass("restaurant-panel"));
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
uid = "Ti1AGHZKdfhC7Wu2edpe";
var custRef = db.collection("users").doc(uid);
//setFavorite("bV9jtyMzI4Gu1kDdNYKb");

$(document).ready(function(){
  refreshFavList();
  
});
function refreshFavList(){
  $("#favorite-list").empty();
  getFavoriteRefs(uid).then(function(refList){
    getRestaurantsInfo(refList).then(function(infoList){
      for(id in infoList){
        writeCode(id,"restaurant.html?req="+id,infoList[id]["REST_NAME"],infoList[id]["IMG_URL"][0]);
      }
    });
  });
}

function writeCode(id,url,name,image){
  var block = '<div class="favorite-content col-sm-12 col-md-6" id="favorite-'+id+'">';
  block +=    '  <img src="'+image+'" class="favorite-img" alt="restaurant image"/>';
  block +=    '  <div class="favorite-img-blur"></div>';
  block +=    '  <div class="favorite-details">';
  block +=    '    <a type="button" href="'+url+'" class="favorite-details-a"></a>';
  block +=    '    <div class="favorite-name">';
  block +=    '      '+name;
  block +=    '    </div>';
  block +=    '    <a type="button" href="'+url+'#reserve-tab" class="favorite-reserve">';
  block +=    '      Reserve Now';
  block +=    '    </a>';
  block +=    '  </div>';
  block +=    '  <img type="button" class="favorite-delete" id="favorite'+id+'" src="images/delete.png" alt="delete" data-toggle="modal" data-target="#deleteModal">';
  block +=    '</div>';

  $("#favorite-list").append($(block));
  $(".favorite-delete").on("click",function(event){
    var deleteId = $(event.target).attr("id");
    var gettingName = deleteId.substr(0,8) + "-" + deleteId.substr(8);
    var restName = $("#"+gettingName).find(".favorite-name").html().trim();
    $(".modal-body").html("You are about to remove<br/>"+ restName +"<br/>from your favorite list.");
    $("#faovrite-delete-confirm").attr("onClick","deleteFavorite('"+deleteId.substr(8)+"')");
  })
}

function deleteFavorite(id){
  db.collection("fav_restaurant").doc(id).delete();
  refreshFavList();
}



function getFavoriteRefs(uid){
  //if(loggedin){
    var restList = {};
    var deffer = $.Deferred();
    db.collection("fav_restaurant").where("CUST_ID","==",custRef)
    .get()
    .then(function(multiple){
      multiple.forEach(doc => {
        var restRef = doc.data()["REST_ID"];
        restList[doc.id] = restRef;
      });
      deffer.resolve(restList);
    });
    return deffer.promise();
  //}
}

function getRestaurantsInfo(refList){
  var restsInfo = {};
  var deffer = $.Deferred();
  var count = 0;
  var length = Object.keys(refList).length;
  for (let ref in refList) {
    refList[ref].get()
    .then(function(doc){
      restsInfo[ref] = doc.data();
      if(count==length-1){
        return deffer.resolve(restsInfo);
      }
      count++;
    });
  }
  return deffer.promise();
}
function setFavorite(restID){
  var restRef = db.collection("restaurants").doc(restID)
  var table = {
    DATE: firebase.firestore.FieldValue.serverTimestamp(),
    CUST_ID: custRef,
    REST_ID: restRef
  }
  db.collection("fav_restaurant").add(table);
}

/* adding sample restaurant
var info = {
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
  REST_BIO: "This is short description",
  REST_NAME: "name here",
  SAFETY_PROTOCOL: {
    MASK_REQ: true,
    MAX_CUST: 15,
    TABLE_SPACE: 2
  }
}
db.collection("restaurants").add(info);
*/
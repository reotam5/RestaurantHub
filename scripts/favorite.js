uid = "Ti1AGHZKdfhC7Wu2edpe";
var custRef = db.collection("users").doc(uid);

$(document).ready(function(){
  $('body').children().filter(".loading-bg").css("position","fixed").css("top","0").css("left","0").css("z-index","6").css("width","100vw").css("height","100vh");
  //if(loggedin){
    refreshFavList().then(function(){
      $('body').children().filter(".loading-bg").delay(900).fadeOut(800); 
    });
  //}
  
});
function refreshFavList(){
  var deffer = $.Deferred();
  $("#favorite-list").empty();
  getFavoriteRefs(uid).then(function(refList){
    getRestaurantsInfo(refList).then( async function(infoList){
      
      for(id in infoList){
        
        var restID = infoList[id]["REST_ID"];
        var storageRef = firebase.storage().ref().child("restaurants/"+restID);
        var imgRef = storageRef.child(infoList[id]["IMG_URL"][0]);

        await imgRef.getDownloadURL().then(function(url){
          writeCode(id,"restaurant.html?req="+restID,infoList[id]["REST_NAME"],url);
        });
      }
      deffer.resolve();
    });
  });
  return deffer.promise();
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
  block +=    '    <a type="button" href="'+url+'&tab=reserve-tab" class="favorite-reserve">';
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

  for (let ref in refList) {
    refList[ref].get()
    .then(function(doc){
      restsInfo[ref] = doc.data();
      restsInfo[ref]["REST_ID"] = doc.id;
      deffer.resolve(restsInfo);
    });
  }
  return deffer.promise();
}



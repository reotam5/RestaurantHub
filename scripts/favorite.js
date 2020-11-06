$(document).ready(function(){

  CreateFavoriteBlock(1,"restaurant.html");
  CreateFavoriteBlock(2,"restaurant.html");
  CreateFavoriteBlock(3,"restaurant.html");
  CreateFavoriteBlock(4,"restaurant.html");

});

function CreateFavoriteBlock(id,url){
  $.ajax({
    url: url,
    cache: false,
    datatype: 'html',
    success: function(html){
      var result = $(html);
      var dom = $(document.createElement("html"));
      dom[0].innerHTML = html;
      image = dom.find(".restaurantImage").attr("src");
      restName = dom.find(".restaurantName").html().trim();

      writeCode(id,url,restName,image);
    }
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
    $("#faovrite-delete-confirm").attr("onClick","deleteFavorite('"+deleteId+"')");
  })
}

function deleteFavorite(id){
  console.log(id + " remove!! Write code for firestore!");
}

db.collection("restaurants").doc("Ywh4LJqPqrkfxekwdihz")
.get()
.then(function(doc){
  console.log(loggedin);
  console.log(doc.data());
});
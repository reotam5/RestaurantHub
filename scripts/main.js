$(document).ready(function() {
  var url = "restaurant.html";
  getRestaurantInfo($(".content"),url,"<p>This is added by jQuery.<br/>Look at scripts/main.js</p>");
});


function createRestaurantBlock(element,name,summary,url,imgUrl){
  var block = '<div id="' + name + '" class="card" style="width: 18rem;">';
  block += '      <img src="' + imgUrl + '" class="card-img-top" alt="...">';
  block += '      <div class="card-body">';
  block += '        <h5 class="card-title">' + name + '</h5>';
  block += "        <p class='card-text'>";
  block += "        " + summary;
  block += "        </p>";
  block += '        <a href="' + url + '" id="restaurant1" class="btn btn-primary">Visit</a>';
  block += '      </div>'
  block += '  </div>';
  element.append($(block));
}


function getRestaurantInfo(element,url,summary){
  $.ajax({
    type: 'GET',
    url: url,
    success: function(result) {
        var html = $(result);
        var imgUrl = html.find("img.restaurantImage").attr("src");
        var name = html.find('div.restaurantName').html();
        createRestaurantBlock(element,name,summary,url,imgUrl);
    }
  });
}
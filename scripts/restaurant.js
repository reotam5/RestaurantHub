/******************************************/
/* This is javascript for restaurant.html */
/******************************************/
$(document).ready(function() {

  var stars = 4;
  setStar(3);

  $(function () {
    $('[data-toggle="popover"]').popover()
  })

  /* simulate click to go to reserve tab directly */
  if(window.location.hash == "#reserve-tab") {
    $("#reserve-tab").click()
  }



});


function setStar(stars){
  if(stars <= 5 && stars >=0){
    for(i = 0; i <= stars; i++){
      $("#star"+i).attr("src","images/darkStar.png");
    }
  }
}
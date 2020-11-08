$('body').children().filter(".loading-bg").css("position","fixed").css("top","0").css("left","0").css("z-index","6").css("width","100vw").css("height","100vh");

$(document).ready(function(){
  $('body').children().filter(".loading-bg").delay(900).fadeOut(800);
  

  var endThreshold = 70;
  
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if(scroll <=endThreshold){
      $("#profile").children().removeClass("invis");
      $("#profile").removeClass("profile-transform");
      $("#profile").children().filter("ul").removeClass("ul-transform");
      $("#tab-content-wrapper").css("margin-top","0");
    }else if(scroll >endThreshold){
      $("#profile").addClass("profile-transform");
      $("#profile").children().addClass("invis");
      $("#profile").children().filter("ul").removeClass("invis");
      $("#profile").children().filter("ul").addClass("ul-transform");
      $("#tab-content-wrapper").css("margin-top","160px");
    }
  });
  $("#pills-history-tab").on("click",function(){
    $("#profile").children().removeClass("invis");
    $("#profile").removeClass("profile-transform");
    $("#profile").children().filter("ul").removeClass("ul-transform");
    $("#tab-content-wrapper").css("margin-top","0");
  });
  $("#pills-upcoming-tab").on("click",function(){
    $("#profile").children().removeClass("invis");
    $("#profile").removeClass("profile-transform");
    $("#profile").children().filter("ul").removeClass("ul-transform");
    $("#tab-content-wrapper").css("margin-top","0");
  });

});
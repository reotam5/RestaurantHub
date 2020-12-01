/***************************************/
/* This is javascript for loading.html */
/***************************************/
$(document).ready(function() {
  blink();
});

function blink() {
  $(".blink").fadeOut(2000);
  $(".blink").fadeIn(2000);
}

//display oading screen on call.
function loadingEnable(){
  setInterval(blink, 2500);
  $('body').children().filter(".loading-bg").css("position","fixed").css("top","0").css("left","0").css("z-index","6").css("width","100vw").css("height","100vh");
}


function loadingDisable(){
  $('body').children().filter(".loading-bg").delay(900).fadeOut(800)
}
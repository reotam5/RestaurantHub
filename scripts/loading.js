$(document).ready(function() {
  blink();
});

function blink() {
  $(".blink").fadeOut(2000);
  $(".blink").fadeIn(2000);
}

setInterval(blink, 2500);

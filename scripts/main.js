/******************************************/
/* This is javascript for main.html */
/******************************************/
$(document).ready(function () {
  let listHours1 = "<p>Monday - 10:00AM - 10:00PM</p>"
                 + "<p>Tuesday - 10:00AM - 10:00PM</p>"
                 + "<p>Wednesday - Closed</p>"
                 + "<p>Thursday - 10:00AM - 10:00PM</p>"
                 + "<p>Friday - 10:00AM - 10:00PM</p>"
                 + "<p>Saturday - 10:00AM - 10:00PM</p>"
                 + "<p>Sunday - 12:00AM - 8:00PM</p>"
  let rest1 = ["keg", "/images/keg.jpg", true, true, false, listHours1]
  createPanel(rest1[0], rest1[1], rest1[2], rest1[3], rest1[4], rest1[5]);
  createPanel("joeys", rest1[1], rest1[2], rest1[3], rest1[4], rest1[5]);
});

function createPanel(name, img, reserve, tracker, verified, hours) {
  $(".wrapper").append($(".restaurant-info").clone().removeClass("restaurant-info").addClass("restaurant-panel-" + name));
  let x = ".restaurant-panel-" + name;
  $(x + " .restaurant-image > img").attr("src", img).attr("alt", "the-keg");
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
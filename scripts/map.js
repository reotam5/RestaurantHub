$(document).ready(function() {
  getLocation();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    null;
  }
}

function showPosition(position) {

}
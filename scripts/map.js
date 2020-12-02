/***********************************/
/* This is javascript for map.html */
/***********************************/


$( window ).on("load", async function() {
   await getLocation()
});

var lng;
var lat;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, positionError);
  } else {
    console.log("error has occured");
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  runMap(lng, lat);
};

function positionError(error) {
  if (error.code == error.PERMISSION_DENIED || error.code == error.POSITION_UNAVAILABLE) {
    var lat = 49.24;
    var lng = -123.11;
    runMap(lng, lat);
  } else  {
    console.log("Unknown error");
  }
}

function runMap(lng, lat) {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2V2aW5uaGE5NSIsImEiOiJja2hnbzV4dzcwb3BzMndvanlhZmpyZW55In0.Q2_WdnutfaDh6-i1NPWKJQ";
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [lng, lat], // starting position [lng, lat]
    zoom: 10 
  })

  var marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    minLength: 3
  })

  map.addControl(geocoder);
}
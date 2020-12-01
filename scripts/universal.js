/******************************************/
/*** All page should import this script.***/
/* This script include header animations. */
/******************************************/
$(document).ready(function() {

  /****************************/
  /* Jquery for header starts */
  /****************************/
  var paddingTarget = $(".slidebar").next();
  var addPadding = parseFloat(paddingTarget.css("margin-top")) + 60 + "px"
  paddingTarget.css("padding-top",addPadding);
  $(window).scroll(function() {
    if($(window).scrollTop() != 0){
      $(".siteHead").addClass("transform");
      $(".fixed-head").addClass("custom-transform");
    }else{
      $(".siteHead").removeClass("transform");
      $(".fixed-head").removeClass("custom-transform");
    }
  });

  /*******************************/
  /* Jquery for slide bar starts */
  /*******************************/
  $(document).on("click", function(event) {
    var target = $(event.target);
    if (target.is(".btn-slide")) {
      $('.slidebar').toggleClass('openNav');
    }else if(target.is(".slidebar")){
      $('.slidebar').addClass('openNav');
    }else{
      $(".slidebar").removeClass("openNav");
    }
  });
  /**************************/
  /* Jquery for navbar ends */
  /**************************/

});

/************************************/
/* Check status of logged in or not */
/************************************/

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      // var emailVerified = user.emailVerified;
      // var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      // var providerData = user.providerData;
      $(".sign-in-status").text("logout");
      user.getIdToken().then(function(accessToken) {
        $(".sign-in").text("Sign out");
        if(document.getElementById('account-details') != null){
          document.getElementById('account-details').textContent = JSON.stringify({
            displayName: displayName,
            email: email,
            // emailVerified: emailVerified,
            phoneNumber: phoneNumber,
            // photoURL: photoURL,
            uid: uid,
            accessToken: accessToken,
            // providerData: providerData
          }, null, '  ');
        }
      });
    } else {
      // User is signed out.
      $(".sign-in-status").text("login");
      $(".sign-in").text("Sign in");
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp();
});

$(".sign-out-button").click(function() {
    var user = firebase.auth().currentUser;
    // is there is a user signed in
    if (user) {
      firebase.auth().signOut().then(function() {
        alert("You have been signed out.");
      }).catch(function(error) {
        alert("There was an error.");
      })
      // if user is signed out
    } else {
      window.location.href = "login.html";
    }
});



function signInPrompt(){
  block =  '<div class="modal fade" id="signinModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">';
  block += '  <div class="modal-dialog modal-dialog-centered">';
  block += '    <div class="modal-content">';
  block += '      <div class="modal-header">';  
  block += '        <h5 class="modal-title" id="signinLabel">Signed-in users only</h5>';
  block += '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">';
  block += '          <span aria-hidden="true">&times;</span>';
  block += '        </button>';  
  block += '      </div>';  
  block += '    <div class="modal-body">';  
  block += '      Please Sign In first';  
  block += '    </div>';  
  block += '    <div class="modal-footer">';  
  block += '      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';  
  block += '      <button type="button" class="btn btn-primary"><a style="display: block; color:black;">Sign-In / Sign-up</a></button>';  
  block += '    </div>';  
  block += '   </div>';  
  block += '  </div>';  
  block += '</div>';  

  block = $(block)

  $("body").append(block);
  $(".modal-footer").find("a").attr("href","login.html?url="+window.location.href);
  $("#signinModal").modal('toggle');
}

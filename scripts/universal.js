/*************************************************************************
 * This supports universal components. EX) header, slide bar...
 ************************************************************************/
//enabling loading screen
//$('body').children().filter(".loading-bg").css("position","fixed").css("top","0").css("left","0").css("z-index","6").css("width","100vw").css("height","100vh");

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

  //Disabling loading acreen
//$('body').children().filter(".loading-bg").delay(900).fadeOut(800);  
});

var loggedin = false;
var user;

firebase.auth().onAuthStateChanged(function(me) {
  if (me) {
    user = me;
    loggedin = true;
  } else {
    user = null;
    loggedin = false;
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
  block += '      <button type="button" class="btn btn-primary"><a href="login.html" style="display: block; color:black;">Sign-In / Sign-up</a></button>';  
  block += '    </div>';  
  block += '   </div>';  
  block += '  </div>';  
  block += '</div>';  

  $("body").append(block);
  $("#signinModal").modal('toggle');
}

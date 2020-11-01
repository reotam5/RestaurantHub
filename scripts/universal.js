/*************************************************************************
 * This is for script that is universal to most of the pages(EX. nav bar)
 ************************************************************************/



$(document).ready(function() {
  /****************************/
  /* Jquery for navbar starts */
  /****************************/
  $(".slidebar").next().addClass("adoptNav");

  $(window).scroll(function() {
    if($(window).scrollTop() != 0){
      $(".siteHead").addClass("transform");
    }else{
      $(".siteHead").removeClass("transform");
    }
  });
  $(document).on("click", function(event) {
    var target = $(event.target);
    if (target.is(".btn-slide")) {
      $('.slidebar').toggleClass('openNav');
    }else if(target.is(".nav")){
      $('.slidebar').addClass('openNav');
    }else{
      $(".slidebar").removeClass("openNav");
    }
  });

  /**************************/
  /* Jquery for navbar ends */
  /**************************/

});
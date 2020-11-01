/*************************************************************************
 * This is for script that is universal to most of the pages(EX. nav bar)
 ************************************************************************/



$(document).ready(function() {
  /****************************/
  /* Jquery for navbar starts */
  /****************************/
  $(".nav").next().addClass("adoptNav");

  $(window).scroll(function() {
    if($(window).scrollTop() != 0){
      $(".siteNav").addClass("transform");
    }else{
      $(".siteNav").removeClass("transform");
    }
  });
  $(document).on("click", function(event) {
    console.log($(event.target).is(".btn-nav"));
    var target = $(event.target);
    if (target.is(".btn-nav")) {
      $('.nav').toggleClass('openNav');
    }else if(target.is(".nav")){
      $('.nav').addClass('openNav');
    }else{
      $(".nav").removeClass("openNav");
    }
  });

  /**************************/
  /* Jquery for navbar ends */
  /**************************/

});
/*************************************************************************
 * This is for script that is universal to most of the pages(EX. nav bar)
 ************************************************************************/



$(document).ready(function() {
  /****************************/
  /* Jquery for navbar starts */
  /****************************/
  $(".siteNav").next().addClass("adoptNav");

  $(window).scroll(function() {
    if($(window).scrollTop() != 0){
      $(".siteNav").addClass("transform");
    }else{
      $(".siteNav").removeClass("transform");
    }
  });
  /**************************/
  /* Jquery for navbar ends */
  /**************************/


  /****************************/
  /* Jquery for footer starts */
  /****************************/
  $(".siteFooter").prev().addClass("adoptFooter");
  /**************************/
  /* Jquery for footer ends */
  /**************************/

});
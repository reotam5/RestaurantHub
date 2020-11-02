/*************************************************************************
 * This is for script that is universal to most of the pages(EX. nav bar)
 ************************************************************************/



$(document).ready(function() {
  /*******************************************/
  /* Jquery for putting universal components */
  /*******************************************/
  $.ajax({
    url: "universalContent.html",
    cache: false,
    datatype: 'html',
    success: function(html) {
        var result = $(html);
        if(!$("body").hasClass("NoUniversal")){
          var paddingTarget = $("body").children().first();
          var addPadding = parseFloat(paddingTarget.css("margin-top")) + 60 + "px"
          paddingTarget.css("padding-top",addPadding);
          var $dom = $(document.createElement("html"));
          $dom[0].innerHTML = html;
          var body = $dom.find("body");
          $("body").prepend(body.children());
        }else{
          console.log("This page's body has 'NoUniversal' class. Therefore no universal components were added.");
        }
    }
  });

  /****************************/
  /* Jquery for navbar starts */
  /****************************/

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
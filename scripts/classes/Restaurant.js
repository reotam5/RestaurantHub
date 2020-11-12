class Restaurant{
  constructor(REST_ID){
    this.REST_ID = REST_ID;
    this.ref = db.collection("restaurants").doc(this.REST_ID);
  }

  //update instance variables
  async updateVariables(initOnly){
    await this.ref.get().then(doc =>{
      //updates instance variables
      this.REST_NAME = doc.data()["REST_NAME"];
      this.REST_BIO = doc.data()["REST_BIO"];
      this.IMG_URL = doc.data()["IMG_URL"];
      this.HOURS = doc.data()["HOURS"];
      this.SAFETY_PROTOCOL = doc.data()["SAFETY_PROTOCOL"];
      this.TRAITS = doc.data()["TRAITS"];
      this.CONTACT = doc.data()["CONTACT"];
      this.MENU = doc.data()["MENU"];
    });
  }

  updatePage(){
    var restID = this.REST_ID;
    var name = this.REST_NAME;
    var bio = this.REST_BIO;
    var image = this.IMG_URL;
    var hours = this.HOURS;
    var safety = this.SAFETY_PROTOCOL;
    var traits = this.TRAITS;
    var contact = this.CONTACT;
    var menu = this.MENU;

    var mask_req = "<div>Mask required: "+safety["MASK_REQ"]+"</div>";
    var table_space = "<div>Table spacing: "+safety["TABLE_SPACE"]+" m</div>";
    var max_cust = "<div>Max Customers at once: "+safety["MAX_CUST"]+"</div>";
    $(".restaurant-safety-protocols").append(mask_req);
    $(".restaurant-safety-protocols").append(table_space);
    $(".restaurant-safety-protocols").append(max_cust);
    //hours
    $(".days.mon").find(".hours").html(hours["Mon"]);
    $(".days.tue").find(".hours").html(hours["Tue"]);
    $(".days.wed").find(".hours").html(hours["Wed"]);
    $(".days.thu").find(".hours").html(hours["Thu"]);
    $(".days.fri").find(".hours").html(hours["Fri"]);
    $(".days.sat").find(".hours").html(hours["Sat"]);
    $(".days.sun").find(".hours").html(hours["Sun"]);
  
    //restaurant images 
    var storageRef = firebase.storage().ref().child("restaurants/"+restID);
    if(image.length > 0){
      var block = '<div class="carousel-item">';
      block +=    '  <img src="images/restaurant.jpg" class="d-block w-100" alt="...">';
      block +=    '</div>';
      var is_first = true;
      for(var url in image){
        var targetUrl = image[url];
        var imgRef = storageRef.child(targetUrl);
        imgRef.getDownloadURL().then(function(url){
          if(is_first){
            is_first = false;
            var carousel = $(block).addClass("active");
          }else{
            var carousel = $(block)
          }
          carousel.find("img").attr("src",url)
          $(".carousel-inner").append(carousel);
        });
      }
    }else{
      $(".restaurant-pictures").remove();
    }
    
    //traits
    if(!traits["ONLINE_RESERVE"]){
      $("img.reserveIcon").remove();
    }
    if(!traits["TABLE_TRACK"]){
      $("img.tableTracker").remove();
    }
    if(!traits["VARIFIED"]){
      $("img.verifiedHours").remove();
    }
  
    //name
    $(".restaurantName").html(name);
    
    //contact
    $("#rest-address").html("Address:&nbsp;"+contact["ADDRESS"]);
    $("#rest-email").html("Email:&nbsp;"+contact["EMAIL"]);
    $("#rest-phone").html("Phone:&nbsp;"+contact["PHONE"]);
  
    //bio
    $(".restaurant-bio").append(bio)
  
    //menu
    var menuBlock = '<div class="card">';
    menuBlock +=    ' <div class="card-header">';
    menuBlock +=    '   <h2 class="mb-0">';
    menuBlock +=    '     <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" aria-expanded="false">';
    menuBlock +=    '       ';
    menuBlock +=    '     </button>';
    menuBlock +=    '   </h2>';
    menuBlock +=    ' </div>';
    menuBlock +=    ' <div class="collapse" data-parent="#restaurantMenu">';
    menuBlock +=    '   <div class="card-body">';
    menuBlock +=    '     <ul>';
    menuBlock +=    '     </ul>';
    menuBlock +=    '   </div>';
    menuBlock +=    ' </div>';
    menuBlock +=    '</div>';
  
    
    for(let category in menu){
      var editBlock = $(menuBlock);
      
      editBlock.find(".card-header").attr("id",category);
      editBlock.find(".collapse")
        .attr("aria-labelledby",category)
        .attr("id","collapse-"+category);
      editBlock.find("button")
        .attr("data-target","#collapse-"+category)
        .attr("aria-controls","collapse-"+category)
        .html(category);
      
      for(let food in menu[category]){
        var price = menu[category][food];
        editBlock.find("ul")
          .append($("<li>"+food+" ----- "+price+"</li>"));
      }
      $("#restaurantMenu").append(editBlock);
    }
  }
}
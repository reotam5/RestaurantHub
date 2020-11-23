//class that contains necessary restaurant information to display restaurant page.
class Restaurant{
  constructor(REST_ID){
    this.REST_ID = REST_ID;
    this.ref = db.collection("restaurants").doc(this.REST_ID);
  }

  //this is called whenever firestore of this restaurant is updated
  updateListner(){
    var that = this;
    var snap = this.ref.onSnapshot(async function(snap){

      //update indtance variable to the updated information before displaying
      await that.updateVariables();

      //update page
      that.updatePage();
    });
  }

  //update instance variables
  async updateVariables(){
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
  
  //setting up review window for this restaurant.
  setUpReview(){
    var restID = this.REST_ID;
    var name = this.REST_NAME;
    var restRef = this.ref;
    var stars = 0;
    $("#restaurantReviewModal").html(name + " :");;

    //hover star to set review  rating.
    $(".rStar").hover(event =>{
      var targetID = $(event.target).attr("id");
      stars = Number.parseInt(targetID.substr(5));
  
      $("#reviewStar").children().filter("img").attr("src", "images/star.png");
      for (var i = 0; i <= stars; i++) {
        $("#rStar" + i).attr("src", "images/darkStar.png");
      }
    });


    //submit review on click
    $("#submitReview").on("click", async function(e){
      e.preventDefault();

      var user = firebase.auth().currentUser;

      if(!user){
        window.location.href = "login.html?url="+window.location.href;
        return;
      }

      var userRef = db.collection("users").doc(user.uid);

      await db.collection("reviews").where("CUST_ID","==",userRef)
      .get()
      .then(function(docQuery){
        if(docQuery.size > 0){
          docQuery.forEach(doc => {
            doc.ref.delete();
          });
        }
      });

      var review = {
        REST_ID: restRef,
        CUST_NAME: user.displayName,
        CUST_ID: userRef,
        REVIEW: $("#review-text").val(),
        STARS: stars,
        DATE: new Date()
      };

      db.collection("reviews").add(review);
    });
  }


  //update the restaurant page based on the current instance variables.
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
    $(".restaurant-safety-protocols").empty().append(mask_req);
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
    }
    
    //traits
    if(!traits["ONLINE_RESERVE"]){
      $("img.reserveIcon").css("display","none");
    }else{
      $("img.reserveIcon").css("display","inline-block");
    }
    if(!traits["TABLE_TRACK"]){
      $("img.tableTracker").css("display","none");
    }else{
      $("img.tableTracker").css("display","inline-block");
    }
    if(!traits["VERIFIED"]){
      $("img.verifiedHours").css("display","none");
    }else{
      $("img.verifiedHours").css("display","inline-block");
    }
  
    //name
    $(".restaurantName").html(name);
    
    //contact
    $("#rest-address").html("Address:&nbsp;"+contact["ADDRESS"]);
    $("#rest-email").html("Email:&nbsp;"+contact["EMAIL"]);
    $("#rest-phone").html("Phone:&nbsp;"+contact["PHONE"]);
  
    //bio
    $(".restaurant-bio").empty().append(bio);
    $(".restaurant-bio").prepend($("<span class='restaurant-section-title'>Bio:</span>"));
  
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
  
    $("#restaurantMenu").empty();
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
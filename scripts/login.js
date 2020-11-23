var ui = new firebaseui.auth.AuthUI(firebase.auth());
var urlParams = new URLSearchParams(window.location.search);

//if url has parameter url=, it will redirect to that page after logged in.
var targetUrl = urlParams.get("url");
if(targetUrl == null){
  targetUrl = "main.html";
}

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      var user = authResult.user;
      if (authResult.additionalUserInfo.isNewUser) {
        db.collection("users").doc(user.uid).set({
          EMAIL: user.email,
          NAME: user.displayName
        }).then(function() {
          console.log("New user added to firestore.");
          window.location.href = targetUrl;
        }).catch(function (error) {
          console.log("Error adding new user: " + error); 
        })
      } else {
      return true;
      }
      return false
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: targetUrl,
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

ui.start('#firebaseui-auth-container', uiConfig);
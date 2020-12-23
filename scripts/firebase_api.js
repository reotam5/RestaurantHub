var firebaseConfig = {
  apiKey: "MyKey",
  authDomain: "restaurant-hub-451af.firebaseapp.com",
  databaseURL: "https://restaurant-hub-451af.firebaseio.com",
  projectId: "restaurant-hub-451af",
  storageBucket: "restaurant-hub-451af.appspot.com",
  messagingSenderId: "senderID",
  appId: "ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

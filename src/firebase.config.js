
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHqA9lD6ynLsb0C35tn7XQM1F7LzAgA9U",
  authDomain: "omsphoneauthentication.firebaseapp.com",
  projectId: "omsphoneauthentication",
  storageBucket: "omsphoneauthentication.firebasestorage.app",
  messagingSenderId: "134050555328",
  appId: "1:134050555328:web:9ca0b50552869d933a9425",
  measurementId: "G-VXVQNPYS80"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Debug logs
  console.log("Firebase initialized with config:", firebaseConfig);
  firebase.auth().onAuthStateChanged((user) => {
    console.log("Auth state changed. User:", user);
  });
  
  // Enable Firebase logging
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  firebase.auth().useDeviceLanguage();
  // Conditionally use emulator for local development
//     if (window.location.hostname === "localhost") {
//         firebase.auth().useEmulator("http://127.0.0.1:3000");
//   }
  

export default firebase;

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
firebase.initializeApp(firebaseConfig);

export default firebase;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebase from 'firebase'
const auth = getAuth();
auth.languageCode = auth.useDeviceLanguage();;
// To apply the default browser preference instead of explicitly setting it.
// auth.useDeviceLanguage();
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
const firebase = initializeApp(firebaseConfig);

export default firebase
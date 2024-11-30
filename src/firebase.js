// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyBHqA9lD6ynLsb0C35tn7XQM1F7LzAgA9U",
    authDomain: "omsphoneauthentication.firebaseapp.com",
    projectId: "omsphoneauthentication",
    storageBucket: "omsphoneauthentication.appspot.com",
    messagingSenderId: "134050555328",
    appId: "1:134050555328:web:9ca0b50552869d933a9425",
    measurementId: "G-VXVQNPYS80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
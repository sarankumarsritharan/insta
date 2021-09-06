// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyCDkAw0A4YnhUaIV71tZKSCmQr8_N41LXQ",
    authDomain: "instagram-5b180.firebaseapp.com",
    databaseURL: "https://instagram-5b180-default-rtdb.firebaseio.com",
    projectId: "instagram-5b180",
    storageBucket: "instagram-5b180.appspot.com",
    messagingSenderId: "1062788344614",
    appId: "1:1062788344614:web:063c5291710cf579baafe7",
    measurementId: "G-N9S128YY8H"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
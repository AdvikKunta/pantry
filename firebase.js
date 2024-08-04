// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbk6kA3hmAYO5QE9xPpul-NsIt3dy2YKg",
  authDomain: "inventory-management-bb6cc.firebaseapp.com",
  projectId: "inventory-management-bb6cc",
  storageBucket: "inventory-management-bb6cc.appspot.com",
  messagingSenderId: "347834980242",
  appId: "1:347834980242:web:7999d839bf33cdd627934b",
  measurementId: "G-Z97Y8D5GM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};
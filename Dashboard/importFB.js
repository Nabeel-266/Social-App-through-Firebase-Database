//        ------------------------- For Firebase ------------------------- 

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
// Import Authentication of Firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// Import Firestore Database of Firebase
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDyQQzrrye6T_qvcd7dUFwA6q4jESHBsl0",
    authDomain: "postmate-social-application.firebaseapp.com",
    projectId: "postmate-social-application",
    storageBucket: "postmate-social-application.appspot.com",
    messagingSenderId: "847480270284",
    appId: "1:847480270284:web:237dc3ae12b9c6e05bc169"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Firebase Firestore Database and get a reference to the service
const db = getFirestore(app);
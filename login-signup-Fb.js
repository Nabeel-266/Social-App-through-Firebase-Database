//        ------------------------- For Firebase ------------------------- 

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
// Import Authentication of Firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// Import Firestore Database of Firebase
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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


// For Signup User
const signupButton = document.querySelector('.signUpBtn');
const signupEmail = document.querySelector('#signupEmail');
const signupPassword = document.querySelector('#signUpPassword');

signupButton.addEventListener('click', signupUser);

async function signupUser() {
    try {
        const response = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
        const userUniqueId = response.user.uid;
        addUserDetails(userUniqueId);
    }
    catch (error) {
        const errorMessage = error.code;
        if (errorMessage === "auth/invalid-email") {
            alert("Your email address is invalid");
        }
        else if (errorMessage === "auth/missing-password") {
            alert("Please entered a password");
        }
        else if (errorMessage === "auth/weak-password") {
            alert("Weak Password! password should be atleast 6 characters");
        }
        else {
            console.error(error.code);
        }
    }
}

// For Add User Data in Firestore Database
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const signupPhoneNumber = document.querySelector('#signupPhoneNumber');
const dateOfBirth = document.querySelector('#dateOfBirth');
const gender = document.querySelector('input[type="radio"]:checked');

async function addUserDetails(userID) {

    // For Proper User Date of Birth
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const getDateOfBirth = dateOfBirth.value.split('-');
    const monthName = months[getDateOfBirth[1] - 1];
    const userDateOfBirth = `${monthName}-${getDateOfBirth[2]}-${getDateOfBirth[0]}`;

    try {
        // Add a new document in collection "Postmate-Users"
        await setDoc(doc(db, "Postmate-Users", userID), {
            firstName: firstName.value,
            lastName: lastName.value,
            email: signupEmail.value,
            contactNumber: signupPhoneNumber.value,
            gender: gender.value,
            dateOfBirth: userDateOfBirth,
        });

        createAccountModal.style.transform = `translateY(-110%)`;
        loginForm.classList.remove('hide');
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }
}


// For Login User
const loginButton = document.querySelector('.logInBtn');
const loginEmail = document.querySelector('#loginEmail');
const loginPassword = document.querySelector('#loginPassword');

loginButton.addEventListener('click', loginUser);

async function loginUser() {
    try {
        const response = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
        const userFind = response.user;
        if (userFind) {
            window.location.href = "./Dashboard/index.html";
        }
    }
    catch (error) {
        const errorMessage = error.code;
        if (errorMessage === "auth/invalid-email") {
            alert("Your email address is invalid");
        }
        else if (errorMessage === "auth/missing-password") {
            alert("Please entered a password");
        }
        else if (errorMessage === "auth/wrong-password") {
            alert("Your password is wrong");
        }
        else if (errorMessage === "auth/user-not-found") {
            alert("User not found");
        }
        else {
            console.error(error.code);
        }
    }
}
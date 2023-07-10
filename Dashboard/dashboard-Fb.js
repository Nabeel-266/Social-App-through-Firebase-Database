//        ------------------------- For Firebase ------------------------- 

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
// Import Authentication of Firebase
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// Import Firestore Database of Firebase
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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


onAuthStateChanged(auth, (crntLoginUser) => {
    if (crntLoginUser) {
        const currentLoginUserUniqueID = crntLoginUser.uid;
        console.log(currentLoginUserUniqueID)
        getlogInUserData(currentLoginUserUniqueID);
    }
    else {
        window.location.href = "../index.html";
    }
});

const userName = document.querySelector(".userName");
const userEmail = document.querySelector(".userEmail");
const userDescription = document.querySelector(".userDescription");
const postInput = document.querySelector('.postInput');

async function getlogInUserData(uid) {
    try {
        const docRef = doc(db, "Postmate-Users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Login User Data:", docSnap.data());
            const { firstName, lastName, email } = docSnap.data();

            userName.innerText = `${firstName} ${lastName}`;
            userEmail.innerText = `${email}`;
            userDescription.innerText = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum expedita at illo placeat ipsam.`;
            postInput.placeholder = `What's on your mind? ${firstName} ${lastName}`;
        }
        else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    catch (error) {
        console.error(error);
    }
}

// For Logout User
const logOutBtns = document.querySelectorAll(".logOut");
console.log(logOutBtns);

logOutBtns.forEach((logoutBtn) => {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = "../index.html").catch((error) => console.error(error));
    })
})

//        ------------------------- For Firebase ------------------------- 

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
// Import Authentication of Firebase
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// Import Firestore Database of Firebase
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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


const postmateUsers = document.querySelector('.postmateUsers');

// for getting Postmate Users
async function getAllPostmateUsers() {
    const querySnapshot = await getDocs(collection(db, "Postmate-Users"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const { firstName, lastName, email } = doc.data();

        const userCard = document.createElement('div');
        userCard.setAttribute('class', 'col p-0 userCard');

        const cardContent = `<div class="card" style="width: 20rem;">
                            <img src="../Assets/users.png" class="card-img-top" alt="user">
                            <div class="card-body">
                                <h5 class="card-title">${firstName} ${lastName}</h5>
                                <h6 class="card-text">${email}</h6>
                                <p class="card-text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum expedita at illo placeat ipsam.</p>
                                <a href="#" class="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>`

        userCard.innerHTML = cardContent;
        postmateUsers.appendChild(userCard);
    });
}
getAllPostmateUsers();
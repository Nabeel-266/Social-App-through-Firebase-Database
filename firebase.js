// Import Functions From firebase Configuration File 
import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setDoc,
    doc
} from './Firebase-Configuration/firebaseConfig.js';



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

const loginState = JSON.parse(localStorage.getItem("login-State"));
if (loginState) {
    window.location.href = "./Dashboard/dashboard.html";
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
            window.location.href = "./Dashboard/dashboard.html";
            const state = {
                login: true,
            }
            localStorage.setItem("login-State", JSON.stringify(state));
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


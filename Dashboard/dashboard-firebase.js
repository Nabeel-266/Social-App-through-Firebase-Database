// Import Functions From firebase Configuration File 
import {
    auth,
    db,
    onAuthStateChanged,
    signOut,
    getDoc,
    doc
} from '../Firebase-Configuration/firebaseConfig.js';



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
        localStorage.removeItem("login-State");
    })
})

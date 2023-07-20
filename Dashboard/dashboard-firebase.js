// Import Functions From firebase Configuration File 
import {
    auth,
    db,
    onAuthStateChanged,
    signOut,
    getDoc,
    getDocs,
    doc,
    collection,
    addDoc
} from '../Firebase-Configuration/firebaseConfig.js';


// For get all previous posts
const postsArea = document.querySelector('.postsArea');
getAllPosts()

// Get Current Login User ID
onAuthStateChanged(auth, (crntLoginUser) => {
    if (crntLoginUser) {
        const currentLoginUserUniqueID = crntLoginUser.uid;
        // console.log(currentLoginUserUniqueID)
        getlogInUserData(currentLoginUserUniqueID);
        logInUserId = currentLoginUserUniqueID;
    }
    else {
        window.location.href = "../index.html";
    }
});

const userName = document.querySelector(".userName");
const userEmail = document.querySelector(".userEmail");
const userDescription = document.querySelector(".userDescription");
const postInput = document.querySelector('.postInput');
const modalUserName = document.querySelector('.modalUserName');
const userImage = document.querySelectorAll('.userImage');


async function getlogInUserData(uid) {
    try {
        const docRef = doc(db, "Postmate-Users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Login User Data:", docSnap.data());
            logInUserData = docSnap.data();
            const { firstName, lastName, email, profilePicture } = docSnap.data();

            userName.innerText = `${firstName} ${lastName}`;
            userEmail.innerText = `${email}`;
            userDescription.innerText = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum expedita at illo placeat ipsam.`;
            modalUserName.innerText = `${firstName} ${lastName}`;
            postInput.placeholder = `What's on your mind? ${firstName} ${lastName}`;
            userImage.forEach((usrImg) => {
                usrImg.src = `${profilePicture || "../Assets/users.png"}`;
            })
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

logOutBtns.forEach((logoutBtn) => {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = "../index.html").catch((error) => console.error(error));
        localStorage.removeItem("login-State");
    })
})


// For Select File Image Input in Post Modal Media Options
const selectPostImageInput = document.querySelector('#input_Image');
const postImageDisplay = document.querySelector('#postImageDisplay');
const removeMediaBtn = document.querySelector('.removeMediaBtn');

// getting Selected Image URL
selectPostImageInput.addEventListener("change", () => {
    const file = selectPostImageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        postImageDisplay.src = reader.result;
        postImageSrc = postImageDisplay.src;
    })

    postImageDisplay.classList.remove('hide');
    removeMediaBtn.classList.remove('hide');
    reader.readAsDataURL(file);
})

// For Cancel Selected Image Btn in Post Modal Image Area
removeMediaBtn.addEventListener('click', () => {
    postImageDisplay.src = '';
    postImageDisplay.classList.add('hide');
    removeMediaBtn.classList.add('hide');
});


const postCreateBtn = document.querySelector('.postingBtn');
const postTextArea = document.querySelector('.postTextarea');
const overlay = document.querySelector('.overlay');
const postingModal = document.querySelector('.postingModal')

// Login User Data & User Id
let logInUserId;
let logInUserData;
let postImageSrc;

postCreateBtn.addEventListener('click', postCreation);
async function postCreation() {
    // console.log(logInUserData)
    try {
        const postInfo = {
            authorID: logInUserId,
            authorImage: logInUserData.profilePicture || "../Assets/users.png",
            authorName: `${logInUserData.firstName} ${logInUserData.lastName}`,
            authorEmail: logInUserData.email,
            postContent: postTextArea.value,
            postDate: new Date().toLocaleDateString(),
            postTime: new Date().toLocaleTimeString(),
            postImage: postImageSrc || "",
        }

        if (postTextArea.value === "") {
            alert(`Please! write a post first`);
        }
        else {
            // Add a new post in firestore database with a generated id.
            const postResponse = await addDoc(collection(db, "User-Posts"), postInfo);
            // console.log("Document written with ID: ", postResponse.id);

            getAllPosts();
            postTextArea.value = "";
            overlay.classList.add('hide');
            postingModal.classList.add('hide');
            postImageDisplay.classList.add('hide');
            removeMediaBtn.classList.add('hide');
        }

        postImageSrc = '';
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Get all posts of all users 
async function getAllPosts() {
    postsArea.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "User-Posts"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());

        const { authorID, authorImage, authorName, authorEmail, postContent, postDate, postTime, postImage } = doc.data();

        const singlePost = document.createElement('div');
        singlePost.setAttribute('class', 'post col-12');

        let singlePostInnerContent =
            `<button class="postSaveOrDeleteBtn m-0 p-0">
            <i class="fa-solid fa-ellipsis"></i>
        </button>

        <div class="postAuthorDetails">
            <div class="authorImage">
                <img src="${authorImage}" alt="Author-Image" class="userImage">
            </div>
            <div class="authorDetail">
                <h3 class="authorName m-0">${authorName}</h3>
                <h6 class="authorDescription m-0">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h6>
                <p class="authorDescription m-0"><b>${postTime}</b> ${postDate}</p>
            </div>
        </div>

        <div class="postContent">
            <div class="postTextArea">
                <p class="postText m-0">${postContent}</p>
            </div>

            <div class="postMedia">
                <img src="${postImage}" alt="" class="img-fluid">
            </div>

            <div class="postInfo">
                <span class="postLikesView">
                    <i class="fa-regular fa-heart"></i>
                    10
                </span>

                <div class="postComments_Shares">
                    <span class="postCommentsView"><b>13</b> comments</span>
                    <span class="postSharesView"><b>8</b> shares</span>
                </div>
            </div>

            <div class="likeCommentShareBtns">
                <button type="button" class="lkCmntShrBtn likeBtn">
                    <i class="fa-solid fa-heart"></i>
                    Like
                </button>
                <button type="button" class="lkCmntShrBtn commentBtn">
                    <i class="fa-solid fa-message"></i>
                    Comment
                </button>
                <button type="button" class="lkCmntShrBtn shareBtn">
                    <i class="fa-solid fa-share"></i>
                    Share
                </button>
            </div>
        </div>`

        // console.log(post);

        singlePost.innerHTML = singlePostInnerContent;
        postsArea.prepend(singlePost);

    })
};
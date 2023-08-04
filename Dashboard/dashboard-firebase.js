// Import Functions From firebase Configuration File
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  addDoc,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../Firebase-Configuration/firebaseConfig.js";

import {
  postEditBySetDocWithTextAndImage,
  postEditBySetDocWithOnlyText,
  postEditBySetDocWithOnlyImage
} from "../Firebase-Configuration/Firebase-Functions/set-Doc.js";

import {
  postEditByUpdateDocWithTextAndImage,
  postEditByUpdateDocWithOnlyText,
  postEditByUpdateDocWithOnlyImage
} from "../Firebase-Configuration/Firebase-Functions/update-Doc.js";


// For Loader
// const loaderArea = document.querySelector(".loaderArea");
// setTimeout(() => {
//   loaderArea.classList.add("hide");
// }, 5000);

// For get all previous posts
const postsArea = document.querySelector(".postsArea");
getAllPosts();

// Get Current Login User ID
onAuthStateChanged(auth, (crntLoginUser) => {
  if (crntLoginUser) {
    const currentLoginUserUniqueID = crntLoginUser.uid;
    // console.log(currentLoginUserUniqueID)
    getlogInUserData(currentLoginUserUniqueID);
    logInUserId = currentLoginUserUniqueID;
  } else {
    window.location.href = "../index.html";
  }
});

const userName = document.querySelector(".userName");
const userEmail = document.querySelector(".userEmail");
const userDescription = document.querySelector(".userDescription");
const postInput = document.querySelector(".postInput");
const modalUserName = document.querySelector(".modalUserName");
const userImage = document.querySelectorAll(".userImage");

async function getlogInUserData(uid) {
  try {
    const docRef = doc(db, "Postmate-Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Login User Data:", docSnap.data());
      logInUserData = docSnap.data();
      const { firstName, lastName, email, profilePicture } = docSnap.data();
      logInUserName = `${firstName} ${lastName}`;

      userName.innerText = `${firstName} ${lastName}`;
      userEmail.innerText = `${email}`;
      userDescription.innerText = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum expedita at illo placeat ipsam.`;
      modalUserName.innerText = `${firstName} ${lastName}`;
      postInput.placeholder = `What's on your mind? ${firstName} ${lastName}`;
      userImage.forEach((usrImg) => {
        usrImg.src = `${profilePicture || "../Assets/users.png"}`;
      });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.error(error);
  }
}

// For Logout User
const logOutBtns = document.querySelectorAll(".logOut");

logOutBtns.forEach((logoutBtn) => {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => (window.location.href = "../index.html"))
      .catch((error) => console.error(error));
    localStorage.removeItem("login-State");
  });
});

// For Select File Image Input in Post Modal Media Options
const uploadPostImageInput = document.querySelector("#input_Image");
const selectMediaFile = document.querySelector(".selectMediaFile");

// getting Selected Image URL
uploadPostImageInput.addEventListener("change", () => {
  const file = uploadPostImageInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    postImageDisplay.src = reader.result;
  });

  selectMediaFile.classList.remove("hide");
  reader.readAsDataURL(file);
  editPostImageState = true;
});

// For Cancel Selected Image Btn in Post Modal Image Area
removeMediaBtn.addEventListener("click", () => {
  postImageDisplay.src = "";
  selectMediaFile.classList.add("hide");
  uploadPostImageInput.value = "";
  editPostImageState = false;
});

const postCreateBtn = document.querySelector(".postingBtn");
const postTextArea = document.querySelector(".postTextarea");
const overlay = document.querySelector(".overlay");
const postingModal = document.querySelector(".postingModal");

// Login User Data & User Id
let logInUserId;
let logInUserData;
let logInUserName;

postCreateBtn.addEventListener("click", postCreation);
async function postCreation() {
  console.log(uploadPostImageInput.value)
  // check if user create only text post so working "if block" 
  if (postTextArea.value !== "" && uploadPostImageInput.value === "") {
    try {
      const postInfo = {
        authorID: logInUserId,
        authorName: `${logInUserData.firstName} ${logInUserData.lastName}`,
        postContent: postTextArea.value.trim(),
        postDate: new Date().toLocaleDateString(),
        postTime: new Date().toLocaleTimeString()
      };
      // Add a new post in firestore database with a generated id.
      const postResponse = await addDoc(collection(db, "User-Posts"), postInfo);
      // console.log("Document written with ID: ", postResponse.id);
      postTextArea.value = "";
      getAllPosts();
    }
    catch (error) {
      console.error("Error adding document: ", error);
    }
  }
  // check if user create only image post so working "else if block" 
  else if (postTextArea.value === "" && uploadPostImageInput.value !== "") {
    const file = uploadPostImageInput.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "Post-Images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            // User canceled the upload
            console.log("User canceled the upload");
            break;

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          try {
            const response = await addDoc(collection(db, "User-Posts"), {
              authorID: logInUserId,
              authorName: `${logInUserData.firstName} ${logInUserData.lastName}`,
              postDate: new Date().toLocaleDateString(),
              postTime: new Date().toLocaleTimeString(),
              postImage: downloadURL,
            });
            postTextArea.value = "";
            getAllPosts();
          }
          catch (error) {
            console.error("Error adding document: ", error);
          }
        });
      }
    )
  }
  // check if user create both text & image post so working "this if else block" 
  else if (postTextArea.value !== "" && uploadPostImageInput.value !== "") {
    const file = uploadPostImageInput.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "Post-Images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            // User canceled the upload
            console.log("User canceled the upload");
            break;

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          try {
            const response = await addDoc(collection(db, "User-Posts"), {
              authorID: logInUserId,
              authorName: `${logInUserData.firstName} ${logInUserData.lastName}`,
              postContent: postTextArea.value.trim(),
              postImage: downloadURL,
              postDate: new Date().toLocaleDateString(),
              postTime: new Date().toLocaleTimeString(),
            });
            getAllPosts();
          }
          catch (error) {
            console.error("Error adding document: ", error);
          }
        });
      }
    )
  }
  else {
    alert(`Dear ${logInUserName}! Your post is empty`);
  }

  postModalWorkingComplete();
}

function postModalWorkingComplete() {
  overlay.classList.add("hide");
  postingModal.classList.add("hide");
  selectMediaFile.classList.add("hide");
  uploadPostImageInput.value = "";
  postTextArea.value = "";
}

// Get all posts of all users
async function getAllPosts() {
  postsArea.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "User-Posts"));
  querySnapshot.forEach(async (doc) => {
    // console.log(doc.id, " => ", doc.data());
    const postId = doc.id;

    // for getting post Information
    const { authorID, authorName, postContent, postDate, postTime, postImage } =
      doc.data();
    // for getting Post Author Data
    const postAuthorInfo = await getPostAuthorData(authorID);

    const singlePost = document.createElement("div");
    singlePost.setAttribute("class", "post col-12");

    let singlePostInnerContent =
      `<div class="postAuthorDetails">
            <div class="authorImage">
                <img src="${postAuthorInfo?.profilePicture || "../Assets/users.png"
      }" alt="Author-Image" class="userImage">
            </div>
            <div class="authorDetail">
                <h3 class="authorName m-0">${authorName}</h3>
                <h6 class="authorDescription m-0">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h6>
                <p class="authorDescription m-0"><b>${postTime}</b> ${postDate}</p>
            </div>
            <div class="editDeleteSaveButtons">
                <button class="ellipsis m-0 p-0">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
                <div class="editDeleteSaveBtnsArea hide">
                    <button class="editPost" onclick="openPostEditModal('${postId}')">
                        <i class="fa-solid fa-pen"></i> 
                        Edit Post
                    </button>
                    <button class="savePost">
                        <i class="fa-solid fa-bookmark"></i> 
                        Save Post
                    </button>
                    <button class="deletePost">
                        <i class="fa-solid fa-trash-can"></i>
                        Delete Post
                    </button>
                </div>
            </div>
        </div>

        <div class="postContent">
            <div class="postTextContentArea">
                <p class="postText m-0">${postContent || ""}</p>
            </div>

            <div class="postMedia">
                <img src="${postImage || ""}" alt="" class="img-fluid">
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
        </div>`;

    // console.log(post);

    singlePost.innerHTML = singlePostInnerContent;
    postsArea.prepend(singlePost);

    const postTextContentArea = document.querySelector(".postTextContentArea");
    if (!postContent) {
      postTextContentArea.classList.add("hide");
    }

    const ellipsis = document.querySelector(".ellipsis");
    const editDeleteSaveBtnsArea = document.querySelector(".editDeleteSaveBtnsArea");
    const editPost = document.querySelector(".editPost");
    const deletePost = document.querySelector(".deletePost");

    ellipsis.addEventListener("click", () => {
      editDeleteSaveBtnsArea.classList.toggle("hide");
      if (authorID !== logInUserId) {
        editPost.classList.add("hide");
        deletePost.classList.add("hide");
      }
    });

  });
}

// for getting Post Author Data
async function getPostAuthorData(authorID) {
  try {
    const docRef = doc(db, "Postmate-Users", authorID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      return docSnap.data();
    }
    else {
      // docSnap.data() will be undefined in this case
      console.log("Sorry! don't find your post author data");
    }
  }
  catch (error) {
    console.error(error);
  }
};

const closingPostingModalBtn = document.querySelector(".closePostingModalBtn");
const modalHeading = document.querySelector(".modalHd");

async function openPostEditModal(editPostId) {
  overlay.classList.remove("hide");
  postingModal.classList.remove("hide");
  postCreateBtn.innerText = "Save";
  modalHeading.innerText = "Edit Post"
  postCreateBtn.removeEventListener("click", postCreation);
  postCreateBtn.addEventListener("click", editPostHandler);

  try {
    const docRef = doc(db, "User-Posts", editPostId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      const { postContent, postImage } = docSnap.data();

      isEditPostContentAvailable = postContent === undefined ? false : true;
      isEditPostImageAvailable = postImage === undefined ? false : true;
      selectedEditPostDetails = [editPostId, postContent, postImage];

      if (postContent !== undefined) {
        postTextArea.value = postContent;
      };

      if (postImage !== undefined) {
        postImageDisplay.src = postImage;
        selectMediaFile.classList.remove("hide");
      };
    }
    else {
      // docSnap.data() will be undefined in this case
      console.log("Sorry! don't find your post author data");
    }
  }
  catch (error) {
    console.error(error);
  }
}


// this variables help to define the status of post
let selectedEditPostDetails;
let isEditPostContentAvailable;
let isEditPostImageAvailable;
let editPostImageState;

const editPostHandler = async () => {
  // console.log(selectedEditPostDetails, "Edit post working properly");
  // console.log(uploadPostImageInput.value);

  if (isEditPostContentAvailable === true && isEditPostImageAvailable === false) {
    if (postTextArea.value !== selectedEditPostDetails[1] && postTextArea.value !== "" && !editPostImageState) {
      console.log("post text are edited");
      const updatePost = await postEditByUpdateDocWithOnlyText(selectedEditPostDetails[0], postTextArea.value);
    }
    else if (postTextArea.value === selectedEditPostDetails[1] && editPostImageState === true) {
      console.log("post text not changed but post image is added");
    }
    else if (postTextArea.value !== selectedEditPostDetails[1] && postTextArea.value !== "" && editPostImageState === true) {
      console.log("post text and post image both are added");
    }
    else if (!postTextArea.value && editPostImageState === true) {
      console.log("post text remove and post image is added");
    }
    else if (postTextArea.value === selectedEditPostDetails[1] && !editPostImageState) {
      console.log("Your post is remain unchanged");
    }
    else {
      console.log("Your edit post is empty");
    }
  }

  else if (isEditPostContentAvailable === false && isEditPostImageAvailable === true) {
    if (editPostImageState === true && postTextArea.value === "") {
      console.log("post Image are edited");
    }
    else if (postImageDisplay.src === selectedEditPostDetails[2] && postTextArea.value !== "") {
      console.log("post Image not changed but post text is added");
    }
    else if (editPostImageState === true && postTextArea.value !== "") {
      console.log("post image and post text both are added");
    }
    else if (editPostImageState === false && postTextArea.value !== "") {
      console.log("post image remove and post text is added");
    }
    else if (postImageDisplay.src === selectedEditPostDetails[2] && !postTextArea.value) {
      console.log("Your post is remain unchanged");
    }
    else {
      console.log("Your edit post is empty");
    }
  }

  else {
    if (postTextArea.value !== selectedEditPostDetails[1] && postTextArea.value !== "" && editPostImageState === true) {
      console.log("post image and post text both are edited");
    }
    else if (!postTextArea.value && postImageDisplay.src === selectedEditPostDetails[2]) {
      console.log("post text is remove but post image remain unchanged");
    }
    else if (postTextArea.value === selectedEditPostDetails[1] && editPostImageState === false) {
      console.log("post image is remove but post text remain unchanged");
    }
    else if (postTextArea.value !== selectedEditPostDetails[1] && postTextArea.value !== "" && postImageDisplay.src === selectedEditPostDetails[2]) {
      console.log("post text is edit but post image remain unchanged");
    }
    else if (postTextArea.value === selectedEditPostDetails[1] && editPostImageState === true) {
      console.log("post image is edit but post text remain unchanged");
    }
    else if (postTextArea.value !== selectedEditPostDetails[1] && postTextArea.value !== "" && editPostImageState === false) {
      console.log("post text is edit or post image is remove");
    }
    else if (!postTextArea.value && editPostImageState === true) {
      console.log("post image is edit and post text is remove");
    }
    else if (postTextArea.value === selectedEditPostDetails[1] && postImageDisplay.src === selectedEditPostDetails[2]) {
      console.log("Your post is remain unchanged");
    }
    else {
      console.log("Your edit post is empty");
    }
  }

  getAllPosts();
  postModalWorkingComplete();
}

// For Close Modal Button
closingPostingModalBtn.addEventListener("click", () => {
  overlay.classList.add("hide");
  postingModal.classList.add("hide");
  selectMediaFile.classList.add("hide")
  postCreateBtn.removeEventListener("click", editPostHandler);
  postCreateBtn.addEventListener("click", postCreation);
  postTextArea.value = "";
  uploadPostImageInput.value = "";
});

window.openPostEditModal = openPostEditModal;
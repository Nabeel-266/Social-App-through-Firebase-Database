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
  addDoc,
  setDoc,
  query,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../Firebase-Configuration/firebaseConfig.js";

// For Loader
const loaderArea = document.querySelector(".loaderArea");
setTimeout(() => {
  loaderArea.classList.add("hide");
}, 4000);

// Get all previous posts
const postsArea = document.querySelector(".postsArea");
getAllMyPosts();

// Get Current Login User ID
onAuthStateChanged(auth, (crntLoginUser) => {
  if (crntLoginUser) {
    const currentLoginUserUniqueID = crntLoginUser.uid;
    getlogInUserData(currentLoginUserUniqueID);
    logInUserId = currentLoginUserUniqueID;
  } else {
    window.location.href = "../index.html";
  }
});

const userName = document.querySelector(".profileUserName");
const modalUserName = document.querySelector(".modalUserName");
const postInput = document.querySelector(".postInput");
const userImage = document.querySelectorAll(".userImage");

async function getlogInUserData(uid) {
  try {
    const docRef = doc(db, "Postmate-Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Login User Data:", docSnap.data());
      logInUserData = docSnap.data();
      const { firstName, lastName, profilePicture } = docSnap.data();

      userName.innerText = `${firstName} ${lastName}`;
      modalUserName.innerHTML = `${firstName} ${lastName}`;
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
const postImageDisplay = document.querySelector("#postImageDisplay");
const removeMediaBtn = document.querySelector(".removeMediaBtn");

// getting Selected Image URL
uploadPostImageInput.addEventListener("change", () => {
  const file = uploadPostImageInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    postImageDisplay.src = reader.result;
  });

  postImageDisplay.classList.remove("hide");
  removeMediaBtn.classList.remove("hide");
  reader.readAsDataURL(file);
});

// For Cancel Selected Image Btn in Post Modal Image Area
removeMediaBtn.addEventListener("click", () => {
  postImageDisplay.src = "";
  postImageDisplay.classList.add("hide");
  removeMediaBtn.classList.add("hide");
});

const postCreateBtn = document.querySelector(".postingBtn");
const postTextArea = document.querySelector(".postTextarea");
const overlay = document.querySelector(".overlay");
const postingModal = document.querySelector(".postingModal");

// Login User Data & User Id
let logInUserId;
let logInUserData;

postCreateBtn.addEventListener("click", postCreation);
async function postCreation() {
  if (postTextArea.value !== "") {
    // check if user create without image post so working "if block" 
    if (!uploadPostImageInput.value) {
      try {
        const postInfo = {
          authorID: logInUserId,
          authorName: `${logInUserData.firstName} ${logInUserData.lastName}`,
          postContent: postTextArea.value,
          postDate: new Date().toLocaleDateString(),
          postTime: new Date().toLocaleTimeString()
        };
        // Add a new post in firestore database with a generated id.
        const postResponse = await addDoc(collection(db, "User-Posts"), postInfo);
        // console.log("Document written with ID: ", postResponse.id);
        postTextArea.value = "";
        getAllMyPosts();
      } 
      catch (error) {
        console.error("Error adding document: ", error);
      }
    } 
    // check if user create a image post so working "else block" 
    else {
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
                postContent: postTextArea.value,
                postDate: new Date().toLocaleDateString(),
                postTime: new Date().toLocaleTimeString(),
                postImage: downloadURL,
              });
              postTextArea.value = "";
              getAllMyPosts();
            } 
            catch (error) {
              console.error("Error adding document: ", error);
            }
          });
        }
      )
    };
    
    overlay.classList.add("hide");
    postingModal.classList.add("hide");
    postImageDisplay.classList.add("hide");
    removeMediaBtn.classList.add("hide");
    uploadPostImageInput.value = "";
  } 
  else {
    alert(`Your post is empty`);
  }
}

// Get All posts of Login User
async function getAllMyPosts() {
  postsArea.innerHTML = "";

  const q = query(collection(db, "User-Posts"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    // console.log(doc.id, " => ", doc.data());

    // for getting post Information
    const { authorID, authorName, postContent, postDate, postTime, postImage } =
      doc.data();
    // for getting Post Author Data
    const postAuthorInfo = await getPostAuthorData(authorID);

    if (authorID === logInUserId) {
      const singlePost = document.createElement("div");
      singlePost.setAttribute("class", "post col-12");

      let singlePostInnerContent = `<button class="postSaveOrDeleteBtn m-0 p-0">
                <i class="fa-solid fa-ellipsis"></i>
            </button>

            <div class="postAuthorDetails">
                <div class="authorImage">
                    <img src="${
                      postAuthorInfo?.profilePicture || "../Assets/users.png"
                    }" alt="Author-Image" class="userImage">
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
    }
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
    } else {
      // docSnap.data() will be undefined in this case
      console.log("Sorry! don't find your post author data");
    }
  } catch (error) {
    console.error(error);
  }
}

const editUserProfilePictureBtn = document.querySelector(".editUserPicBtn");
const changeProfilePictureModal = document.querySelector(
  ".changeProfilePictureModal"
);
const closeChangeProfilePictureModalBtn = document.querySelector(
  ".closeChangeProfilePictureModalBtn"
);
const selectedProfilePic = document.querySelector(".selectedProfilePic");
const cancelProfilePicBtn = document.querySelector(".cancelProfilePicBtn");
const profilePictureDisplay = document.querySelector("#profilePicture");
const uploadPictureInput = document.querySelector("#uploadPicture");
const savePhotoBtn = document.querySelector(".savePhotoBtn");
const saveProfilePicArea = document.querySelector(".saveProfilePicArea");

editUserProfilePictureBtn.addEventListener(
  "click",
  openEditProfilePictureModal
);

function openEditProfilePictureModal() {
  overlay.classList.remove("hide");
  changeProfilePictureModal.classList.remove("hide");
}

closeChangeProfilePictureModalBtn.addEventListener("click", () => {
  overlay.classList.add("hide");
  changeProfilePictureModal.classList.add("hide");
  profilePictureDisplay.src = "";
  selectedProfilePic.classList.add("hide");
  saveProfilePicArea.classList.add("hide");
});

// getting Selected Image URL
uploadPictureInput.addEventListener("change", () => {
  const file = uploadPictureInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    profilePictureDisplay.src = reader.result;
    // postImageSrc = postImageDisplay.src;
    saveProfilePicArea.classList.remove("hide");
  });

  selectedProfilePic.classList.remove("hide");
  reader.readAsDataURL(file);
});

// For Cancel Selected Image Btn in Upload Profile Picture Area
cancelProfilePicBtn.addEventListener("click", () => {
  profilePictureDisplay.src = "";
  selectedProfilePic.classList.add("hide");
  saveProfilePicArea.classList.add("hide");
});

savePhotoBtn.addEventListener("click", editProfilePicture);

function editProfilePicture() {
  const file = uploadPictureInput.files[0];

  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: "image/jpeg",
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, "Profile-Images/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        await setDoc(doc(db, "Postmate-Users", logInUserId), {
          firstName: logInUserData.firstName,
          lastName: logInUserData.lastName,
          email: logInUserData.email,
          contactNumber: logInUserData.contactNumber,
          dateOfBirth: logInUserData.dateOfBirth,
          gender: logInUserData.gender,
          profilePicture: downloadURL,
        });
      });
    }
  );

  overlay.classList.add("hide");
  changeProfilePictureModal.classList.add("hide");
  profilePictureDisplay.src = "";
  selectedProfilePic.classList.add("hide");
  saveProfilePicArea.classList.add("hide");
}

// To display dropdown by click on Profile Icon in Header.
const profileIconDropdown = document.querySelector(".profileBtnDropdown");

function showDropdown() {
  profileIconDropdown.classList.toggle("hide");
}

// // For getting Login User
// const Login_User = JSON.parse(localStorage.getItem('Login_User'));
// // console.log(Login_User);

// if(!Login_User){
//     window.location.href = `../index.html`;
// }

// // For Logout Buttons
// const logOutBtn = document.querySelector('.logOut');
// // console.log(logOutBtns);

// logOutBtn.addEventListener('click', () => {
//     localStorage.removeItem('Login_User');
//     window.location.href = '../index.html';
// })

// const userName = document.querySelector('.profileUserName');
// const modalUserName = document.querySelector('.modalUserName');
// const postInput = document.querySelector('.postInput');

// userName.innerHTML = `${Login_User.firstName} ${Login_User.lastName}`;
// modalUserName.innerHTML = `${Login_User.firstName} ${Login_User.lastName}`;
// postInput.placeholder = `What's on your mind, ${Login_User.firstName} ${Login_User.lastName}?`;

// For Close Modal Button
const overlay = document.querySelector(".overlay");
const postingModal = document.querySelector(".postingModal");
const closingPostingModalBtn = document.querySelector(".closePostingModalBtn");

function postModalOpen() {
  overlay.classList.remove("hide");
  postingModal.classList.remove("hide");
}

closingPostingModalBtn.addEventListener("click", () => {
  overlay.classList.add("hide");
  postingModal.classList.add("hide");
});

// // For getting Local Storage Posts Array
// const multiplePosts = JSON.parse(localStorage.getItem('Posts')) || [];

// const postsArea = document.querySelector('.postsArea');

// multiplePosts.filter((post) => post.authorEmail === Login_User.emailAddress).forEach((post) => {

//     let singlePost = document.createElement('div');
//     singlePost.setAttribute('class', 'post col-12');

//     let postContent = `<button class="postSaveOrDeleteBtn m-0 p-0">
//                             <i class="fa-solid fa-ellipsis"></i>
//                         </button>

//                         <div class="postAuthorDetails">
//                             <div class="authorImage">
//                                 <img src="../Assets/Avatar.jpg" alt="Author-Image">
//                             </div>
//                             <div class="authorDetail">
//                                 <h3 class="authorName m-0">${post.authorName}</h3>
//                                 <h6 class="authorDescription m-0">${post.authorDescription || "Lorem ipsum dolor sit amet consectetur adipisicing elit"}.</h6>
//                                 <p class="authorDescription m-0"><b>${post.postTime}</b> ${post.postDate}</p>
//                             </div>
//                         </div>

//                         <div class="postContent">
//                             <div class="postTextArea">
//                                 <p class="postText m-0">${post.postText}</p>
//                             </div>

//                             <div class="postMedia">
//                                 <img src="${post.postImage}" alt="" class="img-fluid">
//                             </div>

//                             <div class="postInfo">
//                                 <span class="postLikesView">
//                                     <i class="fa-regular fa-heart"></i>
//                                     10
//                                 </span>

//                                 <div class="postComments_Shares">
//                                     <span class="postCommentsView"><b>13</b> comments</span>
//                                     <span class="postSharesView"><b>8</b> shares</span>
//                                 </div>
//                             </div>

//                             <div class="likeCommentShareBtns">
//                                 <button type="button" class="lkCmntShrBtn likeBtn">
//                                     <i class="fa-solid fa-heart"></i>
//                                     Like
//                                 </button>
//                                 <button type="button" class="lkCmntShrBtn commentBtn">
//                                     <i class="fa-solid fa-message"></i>
//                                     Comment
//                                 </button>
//                                 <button type="button" class="lkCmntShrBtn shareBtn">
//                                     <i class="fa-solid fa-share"></i>
//                                     Share
//                                 </button>
//                             </div>
//                         </div>`

//     // console.log(post);

//     singlePost.innerHTML = postContent;
//     postsArea.prepend(singlePost);
// })

// // For Select File Image Input in Post Modal Media Options
// const selectPostImageInput = document.querySelector('#input_Image');
// const postImageDisplay = document.querySelector('#postImageDisplay');
// const removeMediaBtn = document.querySelector('.removeMediaBtn');

// // getting Selected Image URL
// selectPostImageInput.addEventListener("change", () => {
//     const file = selectPostImageInput.files[0];
//     const reader = new FileReader();

//     reader.addEventListener("load", () => {
//         postImageDisplay.src = reader.result;
//         postImageSrc = postImageDisplay.src;
//     })

//     postImageDisplay.classList.remove('hide');
//     removeMediaBtn.classList.remove('hide');
//     reader.readAsDataURL(file);
// })

// // For Cancel Selected Image Btn in Post Modal Image Area
// removeMediaBtn.addEventListener('click', () => {
//     postImageDisplay.src = '';
//     postImageDisplay.classList.add('hide');
//     removeMediaBtn.classList.add('hide');
// });

// // For Post Creation Function
// const postTextArea = document.querySelector('.postTextarea');
// let postImageSrc;

// const postCreation = () => {

//     if(!postTextArea.value){
//         alert("Sorry! Your Post is empty");
//         overlay.classList.add('hide');
//         postingModal.classList.add('hide');
//     }
//     else {
//         let randomImageNum = Math.ceil(Math.random() * 4);
//         let randomImage = `../Assets/post_${randomImageNum.toString()}.jpg`;
//         // console.log(randomImageNum);

//         const postInfo = {
//             authorName: `${Login_User.firstName} ${Login_User.lastName}`,
//             authorEmail: Login_User.emailAddress,
//             authorDescription: Login_User.description,
//             postText: postTextArea.value,
//             postDate: new Date().toLocaleDateString(),
//             postTime: new Date().toLocaleTimeString(),
//             postImage: postImageSrc || randomImage,
//         };

//         let post = document.createElement('div');
//         post.setAttribute('class', 'post col-12');

//         let postContent = `<button class="postSaveOrDeleteBtn m-0 p-0">
//                                 <i class="fa-solid fa-ellipsis"></i>
//                             </button>

//                             <div class="postAuthorDetails">
//                                 <div class="authorImage">
//                                     <img src="../Assets/Avatar.jpg" alt="Author-Image">
//                                 </div>
//                                 <div class="authorDetail">
//                                     <h3 class="authorName m-0">${postInfo.authorName}</h3>
//                                     <h6 class="authorDescription m-0">${postInfo.authorDescription || "Lorem ipsum dolor sit amet consectetur adipisicing elit"}.</h6>
//                                     <p class="authorDescription m-0"><b>${postInfo.postTime}</b> ${postInfo.postDate}</p>
//                                 </div>
//                             </div>

//                             <div class="postContent">
//                                 <div class="postTextArea">
//                                     <p class="postText m-0">${postInfo.postText}</p>
//                                 </div>

//                                 <div class="postMedia">
//                                     <img src="${postInfo.postImage}" alt="" class="img-fluid">
//                                 </div>

//                                 <div class="postInfo">
//                                     <span class="postLikesView">
//                                         <i class="fa-regular fa-heart"></i>
//                                         10
//                                     </span>

//                                     <div class="postComments_Shares">
//                                         <span class="postCommentsView"><b>13</b> comments</span>
//                                         <span class="postSharesView"><b>8</b> shares</span>
//                                     </div>
//                                 </div>

//                                 <div class="likeCommentShareBtns">
//                                     <button type="button" class="lkCmntShrBtn likeBtn">
//                                         <i class="fa-solid fa-heart"></i>
//                                         Like
//                                     </button>
//                                     <button type="button" class="lkCmntShrBtn commentBtn">
//                                         <i class="fa-solid fa-message"></i>
//                                         Comment
//                                     </button>
//                                     <button type="button" class="lkCmntShrBtn shareBtn">
//                                         <i class="fa-solid fa-share"></i>
//                                         Share
//                                     </button>
//                                 </div>
//                             </div>`

//         // console.log(post);

//         post.innerHTML = postContent;
//         postsArea.prepend(post);

//         multiplePosts.push(postInfo);
//         localStorage.setItem('Posts', JSON.stringify(multiplePosts));

//         overlay.classList.add('hide');
//         postingModal.classList.add('hide');

//         postTextArea.value = '';
//         postImageDisplay.src = '';
//         postImageDisplay.classList.add('hide');
//         removeMediaBtn.classList.add('hide');
//         postImageSrc = '';
//     }
// }

// For Eye Button Function
function toggleEyeBtn(eye) {
    if(eye.classList.contains('fa-eye')){
        eye.parentElement.previousElementSibling.setAttribute("type", "password");
        eye.classList.replace('fa-eye', 'fa-eye-slash');
    } 
    else if (eye.classList.contains('fa-eye-slash')){
        eye.parentElement.previousElementSibling.setAttribute("type", "text");
        eye.classList.replace('fa-eye-slash', 'fa-eye');
    }
};

const loginForm = document.querySelector('.loginForm');
const createAccountModal = document.querySelector('.createAccountModal');

// For Open Create Account Modal by clicked to Create Account Link in Login Form.
function openCreateAccountModal() {
    loginForm.classList.add('hide');
    createAccountModal.style.transform = `translateY(0%)`;
};

// For Close Create Account Modal by clicked to Close Button in Signup Form.
function closeCreateAccountModal() {
    loginForm.classList.remove('hide');
    createAccountModal.style.transform = `translateY(-110%)`;
};






































// const postmateUsers = JSON.parse(localStorage.getItem('Postmate Users')) || [];
// // console.log(postmateUsers);


// const loginButton = document.querySelector('.logInBtn');
// const loginEmailOrPhone = document.querySelector('#loginEmailOrPhone');
// const loginPassword = document.querySelector('#loginPassword');
// const emailMessage = document.querySelector('.emailMessage'); 
// const passwordMessage = document.querySelector('.passwordMessage'); 


// // For Login User
// loginButton.addEventListener('click', loginUser);

// function loginUser() {
//     // console.log(loginEmailOrPhone.value);
//     // console.log(loginPassword.value);

//     // If Login Email or Phone Input is Empty
//     if(loginEmailOrPhone.value.length == 0){
//         emailMessage.classList.remove('hide');
//         loginEmailOrPhone.parentElement.style.border = `2px solid #ff2a23`;
//     } 
//     else{
//         emailMessage.classList.add('hide');
//         loginEmailOrPhone.parentElement.style.border = `none`;
//     };

//     // If Login Password Input is Empty
//     if(loginPassword.value.length == 0){
//         passwordMessage.classList.remove('hide');
//         loginPassword.parentElement.style.border = `2px solid #ff2a23`;
//     }
//     else if(loginPassword.value.length > 0){
//         passwordMessage.classList.add('hide');
//         loginPassword.parentElement.style.border = `none`;
//     };

//     // Check! Is user Email Address match from any Postmate Users Account Email?   
//     const postmateUserFind = postmateUsers.filter((user) => {
//         if (user.emailAddress === loginEmailOrPhone.value){
//             return user.emailAddress === loginEmailOrPhone.value
//         }
//         else if (user.phoneNumber === loginEmailOrPhone.value){
//             return user.phoneNumber === loginEmailOrPhone.value
//         }    
//     })
//     // console.log(postmateUsersFind);

//     if(!postmateUserFind.length){
//         return alert('This user is not registered, kindly create an account first');
//     }


//     if(postmateUserFind[0].password === loginPassword.value) {
//         alert('Logged In');
//         localStorage.setItem('Login_User', JSON.stringify(postmateUserFind[0]));

//         window.location.href = "./Dashboard/index.html";
//     }
//     else{
//         alert('Please! entered a correct Password');
//     }
// }

 
// const signupButton = document.querySelector('.signUpBtn');
// const firstName = document.querySelector('#firstName');
// const lastName = document.querySelector('#lastName');
// const signupEmail = document.querySelector('#signupEmail');
// const signupPhoneNumber = document.querySelector('#signupPhoneNumber');
// const signupPassword = document.querySelector('#signUpPassword');
// const signupConfirmPassword = document.querySelector('#signupConfirmPassword');
// const dateOfBirth = document.querySelector('#dateOfBirth');

// // For Signup User
// signupButton.addEventListener('click', signupUser);

// function signupUser() {
//     // console.log(loginEmailOrPhone.value);
//     // console.log(loginPassword.value);

//     // Check! Is user Email Address doesn't match to different users Email Addresses?   
//     const postmateUsersFindEmail = postmateUsers.filter((user) => {
//         return user.emailAddress === signupEmail.value;     
//     })
//     if(postmateUsersFindEmail.length) return alert('Email Address already in use, please use another Email Address')

//     // Check! Is user Phone Number doesn't match to different users Phone Numbers? 
//     const postmateUsersFindPhoneNumber = postmateUsers.filter((user) => {  
//         return user.phoneNumber === signupPhoneNumber.value;  
//     })
//     if(postmateUsersFindPhoneNumber.length) return alert('Sorry! this Phone Number is already has been use in another account')


//     // Check all fields of Signup form are filled 
//     if(firstName.value !== '' && lastName.value !== '' && signupEmail.value !== '' && signupPhoneNumber.value !== '' && signupPassword.value !== '' && signupConfirmPassword.value !== '' && dateOfBirth.value !== '') {

//         // Checking for Correct Signup Email
//         if(signupEmail.value.match(/[@]/) && signupEmail.value.match(/[.]/)){

//             // Checking for Correct Phone Number Length
//             if(signupPhoneNumber.value.length === 11){

//                 // Checking for Correct Signup Password
//                 if(signupPassword.value.length >= 8 && signupPassword.value === signupConfirmPassword.value){

//                     // For Selected Gender
//                     let getGender = document.querySelector('input[type="radio"]:checked').value;
                    
//                     // For Proper User Date of Birth
//                     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//                     const getDateOfBirth = dateOfBirth.value.split('-');
//                     const monthName = months[getDateOfBirth[1] - 1];
//                     const userDateOfBirth = `${monthName}-${getDateOfBirth[2]}-${getDateOfBirth[0]}` 

//                     // User Details Object
//                     const userAccountDetails = {
//                         firstName: firstName.value,
//                         lastName: lastName.value,
//                         emailAddress: signupEmail.value,
//                         phoneNumber: signupPhoneNumber.value,
//                         password: signupPassword.value,
//                         dateOfBirth: userDateOfBirth,
//                         gender: getGender,
//                     }
//                     console.log(userAccountDetails);

//                     postmateUsers.push(userAccountDetails);
//                     localStorage.setItem('Postmate Users', JSON.stringify(postmateUsers));
//                     allFieldsClear();

//                     createAccountModal.style.transform = `translateY(-110%)`;
//                     loginForm.classList.remove('hide');
//                 } 
//                 else {
//                     alert('1. Please entered a minimum 8 digit Password.\n2. Ensure your password and confirm password is same')
//                 }

//                 signupPhoneNumber.style.border = `none`
//             }
//             else{
//                 alert(`Please entered a correct Phone Number`)
//                 signupPhoneNumber.style.border = `2px solid #ff2a23`;
//             }
 
//             signupEmail.style.border = `none`;
//         } 
//         else {
//             signupEmail.style.border = `2px solid #ff2a23`;
//         }

//     }
//     else {
//         alert('Please! Fill out all fields')
//     }
// }

// function allFieldsClear(){
//     firstName.value = '';
//     lastName.value = '';
//     signupEmail.value = '';
//     signupPhoneNumber.value = '';
//     signupPassword.value = '';
//     signupConfirmPassword.value = '';
//     dateOfBirth.value = '';
// }
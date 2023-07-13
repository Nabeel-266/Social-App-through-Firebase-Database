// Import Functions From firebase Configuration File 
import {
    db,
    collection,
    getDocs
} from '../Firebase-Configuration/firebaseConfig.js';


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
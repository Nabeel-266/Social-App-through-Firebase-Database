import {
    db,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    doc,
    setDoc
} from "../firebaseConfig.js";

// ------------------> POst Edit By Set Document <------------------


// ----- Post Edit By Set Doc With Text And Image -----
function postEditBySetDocWithTextAndImage(postID, authID, authName, postContent, postImage, postDate, postTime) {
    const file = postImage.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                try {
                    // Add a new document in collection "cities"
                    const response = await setDoc(doc(db, "User-Posts", postID), {
                        authorID: logInUserId,
                        authorName: `${logInUserData.firstName} ${logInUserData.lastName}`,
                        postContent: postTextArea.value,
                        postImage: downloadURL,
                        postDate: new Date().toLocaleDateString(),
                        postTime: new Date().toLocaleTimeString(),
                    });
                }
                catch (error) {
                    console.error("Error adding document: ", error);
                }
            });
        }
    );
}


// ----- Post Edit By Set Doc With Only Text -----
async function postEditBySetDocWithOnlyText(postID, authID, authName, postContent, postDate, postTime) {
    try {
        // Add a new document in collection "cities"
        const response = await setDoc(doc(db, "User-Posts", postID), {
            authorID: authID,
            authorName: authName,
            postContent: postContent,
            postDate: postDate,
            postTime: postTime,
        });
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
}


// ----- Post Edit By Set Doc With Only Image -----
function postEditBySetDocWithOnlyImage(postID, authID, authName, postImage, postDate, postTime) {
    const file = postImage.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                try {
                    // Add a new document in collection "cities"
                    const response = await setDoc(doc(db, "User-Posts", postID), {
                        authorID: authID,
                        authorName: authName,
                        postContent: postContent,
                        postImage: downloadURL,
                        postDate: postDate,
                        postTime: postTime,
                    });
                }
                catch (error) {
                    console.error("Error adding document: ", error);
                }
            });
        }
    );
}

export {
    postEditBySetDocWithTextAndImage,
    postEditBySetDocWithOnlyText,
    postEditBySetDocWithOnlyImage
}
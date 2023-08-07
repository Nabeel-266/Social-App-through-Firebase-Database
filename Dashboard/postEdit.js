import {
    db,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    doc,
    setDoc,
    updateDoc,
    deleteField
} from "../Firebase-Configuration/firebaseConfig.js";

import {
    postModalWorkingComplete,
    getAllPosts
} from "./dashboard-firebase.js"

// ------------------> POst Edit By Set Document <------------------


// ----- Post Edit By Set Doc With Text And Image -----
async function postEditBySetDocWithTextAndImage(postID, authID, authName, postContent, postImage, postDate, postTime, isImage) {
    if (isImage) {
        try {
            const response = await setDoc(doc(db, "User-Posts", postID), {
                authorID: authID,
                authorName: authName,
                postContent: postContent.trim(),
                postImage: postImage,
                postDate: postDate,
                postTime: postTime,
            });

            alert("Your Post edit Successfully")
            postModalWorkingComplete();
            getAllPosts();
        }
        catch (error) {
            console.error("Error adding document: ", error);
        }
    }
    else {
        const file = postImage.files[0];

        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'Post-Images/' + file.name);
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
                        const response = await setDoc(doc(db, "User-Posts", postID), {
                            authorID: authID,
                            authorName: authName,
                            postContent: postContent.trim(),
                            postImage: downloadURL,
                            postDate: postDate,
                            postTime: postTime,
                        });

                        alert("Your Post edit Successfully")
                        postModalWorkingComplete();
                        getAllPosts();
                    }
                    catch (error) {
                        console.error("Error adding document: ", error);
                    }
                });
            }
        );
    }
}


// ----- Post Edit By Set Doc With Only Text -----
async function postEditBySetDocWithOnlyText(postID, authID, authName, postContent, postDate, postTime) {
    try {
        const response = await setDoc(doc(db, "User-Posts", postID), {
            authorID: authID,
            authorName: authName,
            postContent: postContent.trim(),
            postDate: postDate,
            postTime: postTime,
        });

        alert("Your Post edit Successfully")
        postModalWorkingComplete();
        getAllPosts();
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
}


// ----- Post Edit By Set Doc With Only Image -----
async function postEditBySetDocWithOnlyImage(postID, authID, authName, postImage, postDate, postTime) {
    const file = postImage.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'Post-Images/' + file.name);
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

                    const response = await setDoc(doc(db, "User-Posts", postID), {
                        authorID: authID,
                        authorName: authName,
                        postImage: downloadURL,
                        postDate: postDate,
                        postTime: postTime,
                    });

                    alert("Your Post edit Successfully")
                    postModalWorkingComplete();
                    getAllPosts();
                }
                catch (error) {
                    console.error("Error adding document: ", error);
                }
            });
        }
    );
}


// -------------------------------------------------------------------
// -------------------------------------------------------------------
// ------------------> POst Edit By Update Document <------------------


// ----- Post Edit By Update Doc With Text And Image -----
function postEditByUpdateDocWithTextAndImage(postID, postContent, postImage) {
    const file = postImage.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'Post-Images/' + file.name);
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
                    // Update a document in collection "User-Posts"
                    const updateRef = doc(db, "User-Posts", postID);
                    const updateResponse = await updateDoc(updateRef, {
                        postContent: postContent.trim(),
                        postImage: downloadURL
                    });

                    alert("Your Post edit Successfully")
                    postModalWorkingComplete();
                    getAllPosts();
                }
                catch (error) {
                    console.error("Error adding document: ", error);
                }
            });
        }
    );
}


// ----- Post Edit By Update Doc With Only Text -----
async function postEditByUpdateDocWithOnlyText(postID, postContent) {
    try {
        // Update a document in collection "User-Posts"
        const updateRef = doc(db, "User-Posts", postID);
        const updateResponse = await updateDoc(updateRef, {
            postContent: postContent.trim(),
        });

        alert("Your Post edit Successfully")
        postModalWorkingComplete();
        getAllPosts();
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
}


// ----- Post Edit By Update Doc With Only Image -----
function postEditByUpdateDocWithOnlyImage(postID, postImage) {
    const file = postImage.files[0];

    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'Post-Images/' + file.name);
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
                    // Update a document in collection "User-Posts"
                    const updateRef = doc(db, "User-Posts", postID);
                    const updateResponse = await updateDoc(updateRef, {
                        postImage: downloadURL,
                    });

                    alert("Your Post edit Successfully")
                    postModalWorkingComplete();
                    getAllPosts();
                }
                catch (error) {
                    console.error("Error adding document: ", error);
                }
            });
        }
    );
}

// ----- Post Edit By Update Doc For Delete Post Content Property -----
async function postEditByUpdateDocForDeletePostText(postID) {
    const imageRef = doc(db, "User-Posts", postID);

    await updateDoc(imageRef, {
        postContent: deleteField()
    });

    alert("Your Post edit Successfully")
    postModalWorkingComplete();
    getAllPosts();
}

// ----- Post Edit By Update Doc For Delete Post Image Property -----
async function postEditByUpdateDocForDeletePostImage(postID) {
    const imageRef = doc(db, "User-Posts", postID);

    await updateDoc(imageRef, {
        postImage: deleteField()
    });

    alert("Your Post edit Successfully")
    postModalWorkingComplete();
    getAllPosts();
}

export {
    postEditBySetDocWithTextAndImage,
    postEditBySetDocWithOnlyText,
    postEditBySetDocWithOnlyImage,
    postEditByUpdateDocWithTextAndImage,
    postEditByUpdateDocWithOnlyText,
    postEditByUpdateDocWithOnlyImage,
    postEditByUpdateDocForDeletePostText,
    postEditByUpdateDocForDeletePostImage
}
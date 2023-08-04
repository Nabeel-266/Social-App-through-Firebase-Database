import {
    db,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    doc,
    updateDoc
} from "../firebaseConfig.js";


// ------------------> POst Edit By Update Document <------------------


// ----- Post Edit By Update Doc With Text And Image -----
function postEditByUpdateDocWithTextAndImage(postID, postContent, postImage) {
    console.log("This is post Id", postID)
    // const file = postImage.files[0];

    // // Create the file metadata
    // /** @type {any} */
    // const metadata = {
    //     contentType: 'image/jpeg'
    // };

    // // Upload file and metadata to the object 'images/mountains.jpg'
    // const storageRef = ref(storage, 'images/' + file.name);
    // const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // // Listen for state changes, errors, and completion of the upload.
    // uploadTask.on('state_changed',
    //     (snapshot) => {
    //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log('Upload is ' + progress + '% done');
    //         switch (snapshot.state) {
    //             case 'paused':
    //                 console.log('Upload is paused');
    //                 break;
    //             case 'running':
    //                 console.log('Upload is running');
    //                 break;
    //         }
    //     },
    //     (error) => {
    //         switch (error.code) {
    //             case 'storage/unauthorized':
    //                 // User doesn't have permission to access the object
    //                 break;
    //             case 'storage/canceled':
    //                 // User canceled the upload
    //                 break;
    //             case 'storage/unknown':
    //                 // Unknown error occurred, inspect error.serverResponse
    //                 break;
    //         }
    //     },
    //     () => {
    //         // Upload completed successfully, now we can get the download URL
    //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
    //             console.log('File available at', downloadURL);
    //             try {
    //                 // Update a document in collection "User-Posts"
    //                 const updateRef = doc(db, "User-Posts", postID);
    //                 const updateResponse = await updateDoc(updateRef, {
    //                     postContent: postContent,
    //                     postImage: downloadURL
    //                 })
    //             }
    //             catch (error) {
    //                 console.error("Error adding document: ", error);
    //             }
    //         });
    //     }
    // );
}

// ----- Post Edit By Update Doc With Only Text -----
async function postEditByUpdateDocWithOnlyText(postID, postContent) {
    try {
        // Update a document in collection "User-Posts"
        const updateRef = doc(db, "User-Posts", postID);
        const updateResponse = await updateDoc(updateRef, {
            postContent: postContent,
        })
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
                    // Update a document in collection "User-Posts"
                    const updateRef = doc(db, "User-Posts", postID);
                    const updateResponse = await updateDoc(updateRef, {
                        postImage: downloadURL,
                    })
                }
                catch (error) {
                    console.error("Error adding document: ", error);
                }
            });
        }
    );
}


export {
    postEditByUpdateDocWithTextAndImage,
    postEditByUpdateDocWithOnlyText,
    postEditByUpdateDocWithOnlyImage
}
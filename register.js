
// Import the functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_dTdWejxi9Uq6qnMHFqjoL2s4_WdXfWk",
    authDomain: "smart-locker-cb27d.firebaseapp.com",
    databaseURL: "https://smart-locker-cb27d-default-rtdb.firebaseio.com",
    projectId: "smart-locker-cb27d",
    storageBucket: "smart-locker-cb27d.appspot.com",
    messagingSenderId: "507297342371",
    appId: "1:507297342371:web:a86c6839429191faf77016"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to Firebase services
const db = getDatabase(app);
const storage = getStorage(app);

document.getElementById("submit").addEventListener('click', async function(e){
    e.preventDefault();

    // Store a reference to the form and input fields
    const form = document.querySelector('form');
    const submitButton = document.getElementById("submit");

    // Disable the submit button to prevent duplicate submissions
    submitButton.disabled = true;

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const selfieFileInput = document.getElementById("selfieFile");

    // Check if any of the required fields are empty
    if (usernameInput.value === "" || emailInput.value === "" || phoneInput.value === "" || !selfieFileInput.files[0]) {
        alert("Please fill out all fields and select a selfie photo.");

        // Re-enable the submit button
        submitButton.disabled = false;
    } else {
        // Check if the username already exists
        const usernameRef = ref(db, 'User_Data/' + usernameInput.value);
        const usernameSnapshot = await get(usernameRef);

        if (usernameSnapshot.exists()) {
            alert("Username already exists. Please choose a different username.");

            // Re-enable the submit button
            submitButton.disabled = false;
            return;
        }

        // Resize the selfie photo
        const resizedPhoto = await resizeImage(selfieFileInput.files[0]);

        // Upload the selfie photo to Firebase Storage
        const selfieRef = storageRef(storage, 'User_Photo/' + usernameInput.value + '.jpg'); // Set the file type to jpg
        
        try {
            await uploadBytes(selfieRef, resizedPhoto, { contentType: 'image/jpeg' }); // Explicitly set the content type to 'image/jpeg'
        } catch (error) {
            console.error("Error uploading selfie photo:", error);
            alert("Error uploading selfie photo. Please try again.");

            // Re-enable the submit button
            submitButton.disabled = false;

            return;
        }

        // Set data in Firebase Realtime Database after validation
        set(ref(db, 'User_Data/' + usernameInput.value), {
            Username: usernameInput.value,
            Email: emailInput.value,
            PhoneNumber: phoneInput.value,
        })
        .then(() => {
            // Reset the form after successful submission
            form.reset();
            alert("Submit Successful!");
        })
        .catch((error) => {
            console.error("Error submitting data:", error);
            alert("Error submitting data. Please try again.");
        })
        .finally(() => {
            // Re-enable the submit button
            submitButton.disabled = false;
        });
    }
});

// Function to resize the image
async function resizeImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 600; // Set the maximum size for the photo

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                // Convert the canvas to a data URL
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Add event listener for back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to index.html
});
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, get, child } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

// Your web app's Firebase configuration
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
const db = getDatabase(app);

document.getElementById('retrieveBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value.trim();
    const userInfoResult = document.getElementById('userInfoResult');

    if (userInput === '') {
        userInfoResult.innerHTML = 'Please enter a valid username, phone number, or email.';
        return;
    }

    try {
        // Search for the user in User_Data based on the input
        const userSnapshot = await get(ref(db, 'User_Data'));
        let username = null;

        userSnapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            if (userData.Username === userInput || userData.PhoneNumber === userInput || userData.Email === userInput) {
                username = userData.Username;
            }
        });

        if (username) {
            // Fetch user information from Current_User using the found username
            const userInfoSnapshot = await get(child(ref(db, 'Current_User'), username));

            if (userInfoSnapshot.exists()) {
                const userInfo = userInfoSnapshot.val();
                userInfoResult.innerHTML = `OTP: ${userInfo.otp} <br> Locker Number: ${userInfo.Locker}`;
            } else {
                userInfoResult.innerHTML = 'User information not found.';
            }
        } else {
            userInfoResult.innerHTML = 'No user found with the provided input.';
        }
    } catch (error) {
        console.error('Error retrieving user information:', error);
        userInfoResult.innerHTML = 'Error retrieving user information. Please try again later.';
    }
});

document.getElementById('backButton').addEventListener('click', () => {
    // Implement the back button functionality as needed
    window.history.back();
});

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, get, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Your Firebase configuration
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
const database = getDatabase(app);

// Function to fetch usernames and populate the dropdown
async function fetchUsernames() {
    try {
        const usersRef = ref(database, 'Current_User');
        const snapshot = await get(usersRef);
        const data = snapshot.val();

        if (data) {
            const userSelect = document.getElementById('userSelect');
            for (const username in data) {
                const option = document.createElement('option');
                option.value = username;
                option.textContent = username;
                userSelect.appendChild(option);
            }
        }
    } catch (error) {
        console.error("Error fetching usernames:", error);
    }
}

// Initialize the user dropdown on page load
window.onload = function() {
    // Fetch usernames only when the dropdown is clicked
    document.getElementById('userSelect').addEventListener('click', fetchUsernames);
};


// Function to calculate fee
function calculateFee(durationMinutes) {
    let fee = 0;
    if (durationMinutes <= 60) {
        fee = 1;
    } else if (60 < durationMinutes && durationMinutes <= 360) {
        fee = Math.ceil(durationMinutes / 60);
    } else if (durationMinutes > 360 && durationMinutes <= 1440) {
        fee = 10;
    } else {
        const days = Math.floor(durationMinutes / 1440);
        const remainingMinutes = durationMinutes % 1440;
        const additionalFee = Math.ceil(remainingMinutes / 60) * 2;
        fee = (days * 24 * 2) + additionalFee;
    }
    return fee;
}

// Function to display fee
function displayFee(data) {
    const username = document.getElementById('userSelect').value;
    const paymentRef = ref(database, `Current_User/${username}/Payment`);
    const startTime = new Date(`${data.date}T${data.time}`);
    const currentTime = new Date();
    const durationMinutes = Math.floor((currentTime - startTime) / 60000);
    const fee = calculateFee(durationMinutes);
    const feeResult = document.getElementById('feeResult');

    if (data) {
        if (data.Payment === 'true') {
            feeResult.textContent = 'Payment successful';
            document.getElementById('makePaymentBtn').disabled = true;
        } else {
            feeResult.textContent = `The duration is ${durationMinutes} minutes.\nThe fee is $${fee}`;
        }
        // Enable the "Make Payment" button when fee information is displayed
        document.getElementById('makePaymentBtn').disabled = false;
    } else {
        feeResult.textContent = ""; // Clear fee result if no user is selected
    }
}

// Event listener for selecting a user
document.getElementById('userSelect').addEventListener('change', async (event) => {
    const username = event.target.value;
    const userRef = ref(database, `Current_User/${username}`);
    try {
        const snapshot = await get(userRef);
        const data = snapshot.val();
        if (data) {
            displayFee(data);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
});

// Event listener for making payment
document.getElementById('makePaymentBtn').disabled = true;
document.getElementById('makePaymentBtn').addEventListener('click', async () => {
    const username = document.getElementById('userSelect').value;
    const userRef = ref(database, `Current_User/${username}`);
    try {
        await update(userRef, { Payment: 'true' });
        document.getElementById('feeResult').textContent = 'Payment successful';
    } catch (error) {
        console.error("Error making payment:", error);
    }
});

// Initialize the user dropdown on page load
window.onload = fetchUsernames;

// Add event listener for back button
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to index.html
});
// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration
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

// Get references to each locker condition
const lockerRefs = ['Locker1', 'Locker2', 'Locker3', 'Locker4'].map(locker => ref(database, `Locker_Condition/${locker}`));

// Get the canvas element
const canvas = document.getElementById('lockerCanvas');
const ctx = canvas.getContext('2d');

// Define locker size and spacing
const lockerSize = 120;
const spacing = 10;

// Function to draw locker based on condition
function drawLocker(x, y, lockerData, lockerNumber) {
    // Draw locker
    if (lockerData.Condition === 'Used') {
        // If locker is used, draw red
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, lockerSize, lockerSize);
    } else {
        // If locker is not used, draw blue
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, y, lockerSize, lockerSize);
    }
    
    // Draw locker number in the center
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Locker ${lockerNumber}`, x + lockerSize / 2, y + lockerSize / 2);

    // Draw locker status text
    ctx.font = '16px Arial';
    if (lockerData.Condition === 'Used') {
        ctx.fillText('Occupied', x + lockerSize / 2, y + lockerSize / 2 + 20); // Below locker number
    } else {
        ctx.fillText('Available', x + lockerSize / 2, y + lockerSize / 2 + 20); // Below locker number
    }
}

// Function to draw all lockers
function drawAllLockers(lockerDataArray) {
    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lockerDataArray.forEach((lockerData, index) => {
        const row = Math.floor(index / 2); // Calculate row index
        const col = index % 2; // Calculate column index
        const x = col * (lockerSize + spacing); // Calculate x position
        const y = row * (lockerSize + spacing * 2); // Calculate y position with extra spacing for info
        drawLocker(x, y, lockerData, index + 1); // Pass locker number to drawLocker
    });
}

// Listen for changes in locker conditions and update the canvas
const lockerDataArray = new Array(lockerRefs.length).fill(null);

lockerRefs.forEach((ref, index) => {
    onValue(ref, (snapshot) => {
        lockerDataArray[index] = snapshot.val();
        drawAllLockers(lockerDataArray);
    });
});

// Set canvas size based on the number of lockers and spacing
const canvasWidth = 2 * (lockerSize + spacing);
const canvasHeight = 2 * (lockerSize + spacing * 2);
canvas.width = canvasWidth;
canvas.height = canvasHeight;

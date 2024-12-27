// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Firestore service
import { getStorage } from 'firebase/storage';     // Storage service

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAYpiuOmPsOLKMb2CxO1Id6Og16_-MlnwA",
    authDomain: "plant-disease-detection-f7737.firebaseapp.com",
    projectId: "plant-disease-detection-f7737",
    storageBucket: "plant-disease-detection-f7737.appspot.com",
    messagingSenderId: "307575253860",
    appId: "1:307575253860:web:371e9205dfef117b4d6871",
    measurementId: "G-B84YCCQ60B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);    // Firestore
const storage = getStorage(app); // Storage
    // Authentication

// Export the services to use them in other parts of your app
export { db, storage};



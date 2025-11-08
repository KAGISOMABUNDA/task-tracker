// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe9HkLaTW37zPZcFNOs4vxuCLsE-hX3t4",
  authDomain: "task-tracker-2501.firebaseapp.com",
  projectId: "task-tracker-2501",
  storageBucket: "task-tracker-2501.firebasestorage.app",
  messagingSenderId: "342196802635",
  appId: "1:342196802635:web:a446f419a315083196a9ce",
  measurementId: "G-VXBM407TW6"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 
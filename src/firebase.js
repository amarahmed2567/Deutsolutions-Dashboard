// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyC6KjyvXhAogZqL7XK9cIbCVAzpNlfcde4",
  authDomain: "deutsolutions-bc9a0.firebaseapp.com",
  projectId: "deutsolutions-bc9a0",
  storageBucket: "deutsolutions-bc9a0.appspot.com",
  messagingSenderId: "979815264049",
  appId: "1:979815264049:web:5ce75067fa5f39cee20a10",
  measurementId: "G-BGQG6W15BN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions }; 
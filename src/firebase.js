// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,//process.env.VITE_FIREBASE_API_KEY,//import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-df7d8.firebaseapp.com",
  projectId: "realestate-df7d8",
  storageBucket: "realestate-df7d8.appspot.com",
  messagingSenderId: "708693867814",
  appId: "1:708693867814:web:28daccfbfaea61ba3b95e7"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
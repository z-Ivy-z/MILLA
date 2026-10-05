// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOCJWWcTVA9PCww56lI6kCL_734hFYucU",
    authDomain: "milla-a315e.firebaseapp.com",
    projectId: "milla-a315e",
    storageBucket: "milla-a315e.firebasestorage.app",
    messagingSenderId: "447882924741",
    appId: "1:447882924741:web:78f1367a51d0bd6a8cd6ac",
    measurementId: "G-JCH8NV9C31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);
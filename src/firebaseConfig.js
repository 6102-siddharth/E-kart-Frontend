// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getFirestore } from "firebase/firestore"; // Import getFirestore for Firestore
// import { getAnalytics } from "firebase/analytics"; // If you need analytics, uncomment this

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBb6WcKlf-0WFBtXc44LpNxiBgtHlleMM", // Replace with your actual API Key -  (While you've included it here, it's generally better to store it in an environment variable in production)
  authDomain: "ecom-100c2.firebaseapp.com",
  projectId: "ecom-100c2",
  storageBucket: "ecom-100c2.firebasestorage.app",
  messagingSenderId: "484098503225",
  appId: "1:484098503225:web:75492b10286d9aa3a813e8",
  measurementId: "G-R13CYW3D2W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// const analytics = getAnalytics(app); // If you need analytics, uncomment and export this line
// export { analytics }; // If you uncommented analytics, export it as well.

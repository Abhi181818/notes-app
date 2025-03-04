// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV9ZsAAowO6MJmtJsSRRi2tRGvF2svkEk",
  authDomain: "notes-app-55651.firebaseapp.com",
  projectId: "notes-app-55651",
  storageBucket: "notes-app-55651.appspot.com",
  messagingSenderId: "225665010711",
  appId: "1:225665010711:web:b9ae3f5140e147b6f9e052",
  measurementId: "G-XS4441NM4M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
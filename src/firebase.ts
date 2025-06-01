import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBFYJwzFCJQ8gdsOtJKpsVZYW-UytcyLo",
  authDomain: "hkswap.firebaseapp.com",
  projectId: "hkswap",
  storageBucket: "hkswap.firebasestorage.app",
  messagingSenderId: "299579287455",
  appId: "1:299579287455:web:a5b2c7b6f7bc2e7e2f3faa",
  measurementId: "G-HGBZZ5KLWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

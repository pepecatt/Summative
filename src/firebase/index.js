import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
  apiKey: "AIzaSyCTUjXsP_wbhCDeOWs2Mr7mXZdpQ2sLaes",
  authDomain: "summative-80a38.firebaseapp.com",
  projectId: "summative-80a38",
  storageBucket: "summative-80a38.firebasestorage.app",
  messagingSenderId: "446910844636",
  appId: "1:446910844636:web:e0dd7897f137a7029f2e19"
};

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };
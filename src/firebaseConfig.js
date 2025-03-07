import { initializaApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDD5ceSWub77ovkPXqQHZoZLHTTSObadEI",
    authDomain: "miapp-integral-d8187.firebaseapp.com",
    projectId: "miapp-integral-d8187",
    storageBucket: "miapp-integral-d8187.firebasestorage.app",
    messagingSenderId: "262900383399",
    appId: "1:262900383399:web:e50f6e1aa8acaada8aa582",
    measurementId: "G-TW1383TTGC"
  };

const app = initializaApp(firebaseConfig);

const db = getFirestore(app);

export { db };

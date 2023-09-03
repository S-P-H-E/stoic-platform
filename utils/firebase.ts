import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGAtbzmIz05JvarSVmBJzmplXMbMBHNdw",
  authDomain: "stoic-platform-c3a0a.firebaseapp.com",
  projectId: "stoic-platform-c3a0a",
  storageBucket: "stoic-platform-c3a0a.appspot.com",
  messagingSenderId: "914322063581",
  appId: "1:914322063581:web:3eace62d69b6494d5a1b34",
  measurementId: "G-4YT8CTXFS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
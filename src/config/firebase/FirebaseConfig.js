import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBQOhCiadrlsO8rHry6Xkhb7Wo5QXonnUk",
  authDomain: "products-34db3.firebaseapp.com",
  projectId: "products-34db3",
  storageBucket: "products-34db3.firebasestorage.app",
  messagingSenderId: "490306262665",
  appId: "1:490306262665:web:f88ca48826ef43aaa65858",
  measurementId: "G-T5BPR8YS0L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
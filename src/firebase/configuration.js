// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6nNYAIHdr6vIdEE2wj3-J-YKe2u7JVqA",
  authDomain: "photo-gallery-applicatio-a3813.firebaseapp.com",
  databaseURL:
    "https://photo-gallery-applicatio-a3813-default-rtdb.firebaseio.com",
  projectId: "photo-gallery-applicatio-a3813",
  storageBucket: "photo-gallery-applicatio-a3813.appspot.com",
  messagingSenderId: "89455749644",
  appId: "1:89455749644:web:6b8bf0bb24024ab30a5c29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

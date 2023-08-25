// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtieMy2MIb7vXz0BfwvsOou9gfL5OEsMs",
  authDomain: "podcast-app-1fe38.firebaseapp.com",
  projectId: "podcast-app-1fe38",
  storageBucket: "podcast-app-1fe38.appspot.com",
  messagingSenderId: "874794761866",
  appId: "1:874794761866:web:c08b8140eceff817777773",
  measurementId: "G-YCRS5SX4LD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
const storage=getStorage(app);
const auth=getAuth(app);

export {auth,db,storage};
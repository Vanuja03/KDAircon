import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzCfKPPlbuHiSGmD3nv4CTkN1abxxt3nQ",
  authDomain: "react-firebase--auth-d2035.firebaseapp.com",
  projectId: "react-firebase--auth-d2035",
  storageBucket: "react-firebase--auth-d2035.appspot.com",
  messagingSenderId: "452560048416",
  appId: "1:452560048416:web:0fde19ed27692607f1c745"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export default app;


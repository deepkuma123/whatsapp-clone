import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyBHOlOxNGFdXIwjApywee4wUjSm3AFplyo",
    authDomain: "whatsapp-clone-196cf.firebaseapp.com",
    projectId: "whatsapp-clone-196cf",
    storageBucket: "whatsapp-clone-196cf.appspot.com",
    messagingSenderId: "366986342691",
    appId: "1:366986342691:web:9993301a0707febdb75c96",
    measurementId: "G-E1MFPTNBNY"
  };

  const app = initializeApp(firebaseConfig);
  export const firebaseAuth = getAuth(app)
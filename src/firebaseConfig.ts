import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAt5HrOY7XK1SWRXutvP247WBW1B-Ou0io",
    authDomain: "calculator-nutrients.firebaseapp.com",
    projectId: "calculator-nutrients",
    storageBucket: "calculator-nutrients.firebasestorage.app",
    messagingSenderId: "167964551269",
    appId: "1:167964551269:web:6e8a07e8de89e47867fe8c"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC58y1p9HC55KeP9j7btHfzpKPUIoFzeM0",
authDomain: "caurie-3c42c.firebaseapp.com",
projectId: "caurie-3c42c",
storageBucket: "caurie-3c42c.appspot.com",
messagingSenderId: "123456789012",
appId: "1:123456789012:web:abcdef12345678"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

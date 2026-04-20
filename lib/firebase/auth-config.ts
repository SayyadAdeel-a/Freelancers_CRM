import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3B6S0TXONp68_8MgQSqu7tuyjJHYpNyE",
  authDomain: "freelancers-crm-2f0fd.firebaseapp.com",
  projectId: "freelancers-crm-2f0fd",
  storageBucket: "freelancers-crm-2f0fd.firebasestorage.app",
  messagingSenderId: "422302146710",
  appId: "1:422302146710:web:ec5fce2629efafca2062b7",
  measurementId: "G-ZZVP2FXES3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export { app, auth, db };
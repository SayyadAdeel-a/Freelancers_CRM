import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail as rawSendPasswordResetEmail } from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const createUserWithEmailAndPassword = createUserWithEmailAndPassword;
export const signInWithEmailAndPassword = signInWithEmailAndPassword;
export const sendPasswordResetEmail = (email: string) => rawSendPasswordResetEmail(auth, email);

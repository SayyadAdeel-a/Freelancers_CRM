import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword as rawCreateUserWithEmailAndPassword, signInWithEmailAndPassword as rawSignInWithEmailAndPassword, sendPasswordResetEmail as rawSendPasswordResetEmail } from "firebase/auth";
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

export const createUserWithEmailAndPassword = (email: string, password: string) => rawCreateUserWithEmailAndPassword(auth, email, password);
export const signInWithEmailAndPassword = (email: string, password: string) => rawSignInWithEmailAndPassword(auth, email, password);
export const sendPasswordResetEmail = (email: string) => rawSendPasswordResetEmail(auth, email);

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword as rawCreateUserWithEmailAndPassword, signInWithEmailAndPassword as rawSignInWithEmailAndPassword, sendPasswordResetEmail as rawSendPasswordResetEmail } from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Map Firebase auth error codes to user-friendly messages */
function parseAuthError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed. Please try again.";
      case "auth/popup-blocked":
        return "Popup was blocked by your browser. Please allow popups for this site and try again.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized for Google sign-in. Please contact support.";
      case "auth/cancelled-popup-request":
        return "Another sign-in popup is already open.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a few minutes and try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      default:
        return "Sign-in failed. Please try again.";
    }
  }
  return "An unexpected error occurred. Please try again.";
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    // popup-closed-by-user is not a real error (user cancelled), rethrow with friendly message
    const message = parseAuthError(error);
    const friendlyError = new Error(message);
    console.error("Google sign-in:", message);
    throw friendlyError;
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

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    return await rawCreateUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(parseAuthError(error));
  }
};
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    return await rawSignInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(parseAuthError(error));
  }
};
export const sendPasswordResetEmail = async (email: string) => {
  try {
    return await rawSendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(parseAuthError(error));
  }
};

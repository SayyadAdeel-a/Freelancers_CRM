import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "freelancers-crm-2f0fd",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "dummy@freelancers-crm-2f0fd.iam.gserviceaccount.com",
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCZ...\n-----END PRIVATE KEY-----",
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "freelancers-crm-2f0fd.firebasestorage.app",
    });
  } catch (error) {
    console.warn("Failed to initialize Firebase Admin, using default app if available or ignoring during build:", error);
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null as unknown as admin.firestore.Firestore;
export const adminAuth = admin.apps.length ? admin.auth() : null as unknown as admin.auth.Auth;
export const adminStorage = admin.apps.length ? admin.storage() : null as unknown as admin.storage.Storage;

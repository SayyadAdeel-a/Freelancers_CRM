"use server";

import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/firebase/server-auth";
import { FREE_PLAN_CLIENT_LIMIT } from "@/lib/constants";

export async function addClientAction(token: string, clientData: any) {
  try {
    // 1. Verify Authentication
    const decodedToken = await verifySession(token);
    const userId = decodedToken.uid;

    // 2. Fetch User Profile for Plan Check
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const profile = userDoc.data();
    const plan = profile?.plan || "free";

    // 3. Enforce Limits for Free Plan
    if (plan === "free") {
      const clientCount = await adminDb.collection("clients")
        .where("userId", "==", userId)
        .count()
        .get();
      
      if (clientCount.data().count >= FREE_PLAN_CLIENT_LIMIT) {
        return { 
          success: false, 
          error: `Limit reached: You can only have ${FREE_PLAN_CLIENT_LIMIT} clients on the free plan.` 
        };
      }
    }

    // 4. Create the Client using Admin SDK
    const newClient = {
      ...clientData,
      userId,
      createdAt: new Date(), // Firebase Admin uses Date or Timestamp
    };

    const docRef = await adminDb.collection("clients").add(newClient);

    return { 
      success: true, 
      clientId: docRef.id 
    };
  } catch (error: any) {
    console.error("Add Client Action Error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to add client. Please try again." 
    };
  }
}

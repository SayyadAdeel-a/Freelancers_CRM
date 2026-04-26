import { adminAuth } from "./admin";
import { headers } from "next/headers";

export async function verifySession(providedToken?: string) {
  let token = providedToken;

  if (!token) {
    const headerList = await headers();
    const authHeader = headerList.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    throw new Error("Unauthorized: Missing token");
  }
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Session verification failed:", error);
    throw new Error("Unauthorized: Session expired or invalid");
  }
}

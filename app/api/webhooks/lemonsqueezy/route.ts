import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-ls-signature") || "";
    const secret = (process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "").trim();

    if (!secret) {
      console.error("CRITICAL ERROR: LEMON_SQUEEZY_WEBHOOK_SECRET is missing from environment variables!");
    }

    console.log("--- Lemon Squeezy Webhook Received ---");
    console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
    
    // 1. Verify Signature
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");

    console.log("Expected Digest:", digest.substring(0, 10) + "...");
    console.log("Received Signature:", signature.substring(0, 10) + "...");

    const digestBuffer = Buffer.from(digest, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    if (digestBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
      console.error("WEBHOOK ERROR: Signature Mismatch. Check your LEMON_SQUEEZY_WEBHOOK_SECRET in Vercel.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;
    const userId = customData?.userId;

    console.log(`EVENT DETECTED: ${eventName}`);
    console.log(`CUSTOM DATA:`, JSON.stringify(customData, null, 2));

    // Handle any event that indicates a successful payment
    const successEvents = ["order_created", "subscription_created", "subscription_updated"];
    
    if (successEvents.includes(eventName)) {
      if (userId) {
        console.log(`UPGRADING USER: ${userId} to PRO...`);
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          plan: "pro",
          updatedAt: serverTimestamp(),
        });
        console.log(`SUCCESS: User ${userId} is now PRO.`);
      } else {
        console.error("WEBHOOK ERROR: No userId found in custom_data. Payment cannot be linked to account.");
      }
    } else {
      console.log(`INFO: Ignoring event type: ${eventName}`);
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (err: any) {
    console.error("CRITICAL WEBHOOK ERROR:", err.message);
    return NextResponse.json({ error: "Internal Error", details: err.message }, { status: 500 });
  }
}

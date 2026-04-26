import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-ls-signature") || "";
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "";

    console.log("--- Lemon Squeezy Webhook Received ---");
    
    // 1. Verify Signature
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");

    // timingSafeEqual requires buffers of identical length
    const digestBuffer = Buffer.from(digest, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    if (digestBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
      console.error("Webhook Signature Mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;
    const userId = customData?.userId;

    console.log(`Event: ${eventName} | User: ${userId}`);

    if (eventName === "order_created" || eventName === "subscription_created") {
      if (userId) {
        // Upgrade user to PRO in Firestore
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          plan: "pro",
          updatedAt: serverTimestamp(),
        });
        console.log(`SUCCESS: User ${userId} upgraded to PRO.`);
      } else {
        console.warn("WARNING: Webhook received without userId in custom_data");
      }
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (err: any) {
    console.error("CRITICAL WEBHOOK ERROR:", err.message);
    return NextResponse.json({ error: "Internal Error", details: err.message }, { status: 500 });
  }
}

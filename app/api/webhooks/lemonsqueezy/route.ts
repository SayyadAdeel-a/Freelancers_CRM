import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/**
 * Webhook handler for Lemon Squeezy events.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "");
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(req.headers.get("x-signature") || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;

    console.log(`Received LS Webhook: ${eventName}`, customData);

    if (eventName === "order_created" || eventName === "subscription_created") {
      const userId = customData?.userId;
      
      if (userId) {
        // Upgrade user to PRO in Firestore
        // Note: UserProfile is stored at /users/{uid}
        await updateDoc(doc(db, "users", userId), {
          plan: "pro",
          updatedAt: new Date(),
        });
        
        console.log(`User ${userId} upgraded to PRO via Webhook.`);
      }
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

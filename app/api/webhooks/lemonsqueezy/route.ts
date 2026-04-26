import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const secret = (process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "").trim();
    const signature = req.headers.get("x-signature") || req.headers.get("x-ls-signature") || "";

    if (!secret || !signature) {
      return NextResponse.json({ error: "Missing configuration" }, { status: 401 });
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");

    const digestBuffer = Buffer.from(digest, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    if (digestBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const userId = payload.meta.custom_data?.userId;

    if (["order_created", "subscription_created", "subscription_updated"].includes(eventName)) {
      if (userId) {
        // Use adminDb to bypass Firestore rules
        await adminDb.collection("users").doc(userId).update({
          plan: "pro",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

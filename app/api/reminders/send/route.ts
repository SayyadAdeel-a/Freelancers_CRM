import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  // 0. Ensure keys exist (prevents crash during build/runtime if missing)
  if (!process.env.RESEND_API_KEY || !process.env.QSTASH_CURRENT_SIGNING_KEY) {
    console.error("Missing required environment variables for reminders.");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });
  // 1. Verify QStash Signature
  const signature = req.headers.get("upstash-signature");
  if (!signature) {
    return new NextResponse("Missing signature", { status: 401 });
  }

  const body = await req.text();
  
  const isValid = await receiver.verify({
    signature,
    body,
  });

  if (!isValid) {
    console.error("Invalid QStash signature");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Parse the payload
  const { userEmail, clientName, message } = JSON.parse(body);

  try {
    // 3. Send Email via Resend
    const { error } = await resend.emails.send({
      from: "Nudge CRM <reminders@mail.adeelsayyad.tech>",
      to: [userEmail],
      subject: `Nudge: Follow up with ${clientName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #262626;">
          <h2 style="color: #FF4C00;">Reminder for ${clientName}</h2>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 15px; border-left: 4px solid #FF4C00;">
            ${message}
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            Sent from your Nudge CRM dashboard.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Reminder Processing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

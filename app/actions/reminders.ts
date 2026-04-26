"use server";

import { qstashClient } from "@/lib/qstash";
import { verifySession } from "@/lib/firebase/server-auth";

interface ScheduleReminderParams {
  token: string;
  clientId: string;
  clientName: string;
  remindAt: string; // ISO string
  message: string;
}

export async function scheduleReminderAction(params: ScheduleReminderParams) {
  const { token, clientName, remindAt, message } = params;
  
  try {
    // 1. Authenticate the user
    const decodedToken = await verifySession(token);
    const userEmail = decodedToken.email;
    
    if (!userEmail) {
      return { success: false, error: "User email not found in session." };
    }

    // 0. Robust URL detection
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    
    // Remove trailing slash if present to avoid // in URL
    baseUrl = baseUrl.replace(/\/$/, "");

    console.log(`[QStash] Using Base URL: ${baseUrl}`);
    console.log(`[QStash] Scheduling reminder for ${userEmail} at ${remindAt}...`);

    // 2. Schedule with QStash
    if (!qstashClient) {
      console.error("[QStash] Client missing - check QSTASH_TOKEN");
      return { success: false, error: "QStash token is missing in environment variables." };
    }

    const result = await qstashClient.publishJSON({
      url: `${baseUrl}/api/reminders/send`,
      body: {
        userEmail,
        clientName,
        message,
      },
      notBefore: Math.floor(new Date(remindAt).getTime() / 1000),
    });

    console.log(`[QStash] Success! Message ID: ${result.messageId}`);
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("[QStash] Error:", message);
    return { success: false, error: message };
  }
}

"use server";

import { qstashClient } from "@/lib/qstash";
import { addReminder } from "@/lib/firebase/firestore";

interface ScheduleReminderParams {
  clientId: string;
  userId: string;
  userEmail: string;
  clientName: string;
  remindAt: string; // ISO string
  message: string;
}

export async function scheduleReminderAction(params: ScheduleReminderParams) {
  const { clientId, userId, userEmail, clientName, remindAt, message } = params;
  
  // 0. Robust URL detection
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  console.log(`[QStash] Using Base URL: ${baseUrl}`);
  console.log(`[QStash] Scheduling reminder for ${userEmail} at ${remindAt}...`);

  try {
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
  } catch (error: any) {
    console.error("[QStash] Error:", error.message);
    return { success: false, error: error.message };
  }
}

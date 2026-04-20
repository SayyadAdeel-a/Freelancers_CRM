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
  console.log(`[QStash] Scheduling reminder for ${userEmail} at ${remindAt}...`);

  try {
    // 1. Save to Firestore
    await addReminder(clientId, userId, new Date(remindAt), message);
    console.log(`[QStash] Firestore entry created.`);

    // 2. Schedule with QStash
    const result = await qstashClient.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/reminders/send`,
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
    throw new Error(error.message);
  }
}

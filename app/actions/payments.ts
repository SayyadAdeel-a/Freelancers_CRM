"use server";

import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { setupLemonSqueezy } from "@/lib/lemonsqueezy";
import { auth } from "@/lib/firebase/config";

/**
 * Creates a Lemon Squeezy checkout for the Pro plan.
 * Passing the userId in custom data ensures we can identify the user in the webhook.
 */
export async function createProCheckout(userId: string, userEmail: string) {
  try {
    setupLemonSqueezy();

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
      throw new Error("Missing Lemon Squeezy Store or Variant ID");
    }

    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: userEmail,
        custom: {
          userId: userId,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        receiptButtonText: "Go to Dashboard",
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { url: data?.data.attributes.url };
  } catch (err: any) {
    console.error("Checkout creation error:", err);
    throw new Error(err.message || "Failed to create checkout");
  }
}

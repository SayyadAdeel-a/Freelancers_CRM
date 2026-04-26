"use server";

/**
 * Creates a Lemon Squeezy checkout for the Pro plan using direct API calls.
 * This avoids Node.js version conflicts with the official SDK.
 */
export async function createProCheckout(userId: string, userEmail: string) {
  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      throw new Error("Missing Lemon Squeezy configuration (API Key, Store ID, or Variant ID)");
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: {
                userId: userId,
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
              receipt_button_text: "Go to Dashboard",
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId.toString(),
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId.toString(),
              },
            },
          },
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Lemon Squeezy API Error:", result);
      throw new Error(result.errors?.[0]?.detail || "Failed to create checkout");
    }

    return { url: result.data.attributes.url };
  } catch (err: any) {
    console.error("Checkout creation error:", err);
    throw new Error(err.message || "Internal server error");
  }
}

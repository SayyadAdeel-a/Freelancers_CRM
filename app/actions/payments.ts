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

    // Detect base URL (Vercel provides VERCEL_URL, but we prefer NEXT_PUBLIC_APP_URL if set)
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    // Fallback for local dev if both are missing
    if (!baseUrl) {
      baseUrl = "http://localhost:3000";
    }

    console.log("--- Payment Action Debug ---");
    console.log("User ID:", userId);
    console.log("Base URL:", baseUrl);
    console.log("Has API Key:", !!apiKey);

    if (!apiKey || !storeId || !variantId) {
      throw new Error(`Config Missing: API:${!!apiKey} Store:${!!storeId} Var:${!!variantId}`);
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
              redirect_url: `${baseUrl}/dashboard?payment=success`,
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
    console.log("Lemon Squeezy API Status:", response.status);

    if (!response.ok) {
      console.error("Lemon Squeezy API Detail:", JSON.stringify(result, null, 2));
      const detail = result.errors?.[0]?.detail || "Lemon Squeezy API rejected the request";
      throw new Error(detail);
    }

    return { url: result.data.attributes.url };
  } catch (err: any) {
    console.error("--- Payment Action Failure ---");
    console.error(err);
    // Throwing here triggers the 500. We'll return an object instead to catch it in the UI.
    return { error: err.message || "Internal server error" };
  }
}

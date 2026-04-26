"use server";

/**
 * Creates a Lemon Squeezy checkout for the Pro plan using direct API calls.
 * This avoids Node.js version conflicts with the official SDK.
 */
export async function createProCheckout(userId: string, userEmail: string) {
  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY?.trim();
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID?.trim();
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID?.trim();

    // Detect base URL
    let baseUrl = "https://app.adeelsayyad.tech";
    
    // Allow localhost for development
    if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    }

    // Clean trailing slash
    baseUrl = baseUrl.replace(/\/$/, "");

    console.log("--- Payment Action Debug ---");
    console.log("User ID:", userId);
    console.log("Base URL:", baseUrl);
    console.log("Store ID:", storeId);
    console.log("Variant ID:", variantId);
    console.log("Has API Key:", !!apiKey);

    if (!apiKey || !storeId || !variantId) {
      throw new Error(`Config Missing: API:${!!apiKey} Store:${!!storeId} Var:${!!variantId}`);
    }

    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          test_mode: process.env.LEMON_SQUEEZY_TEST_MODE === "true",
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
              id: storeId?.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId?.toString(),
            },
          },
        },
      },
    };

    console.log("--- Lemon Squeezy Payload ---");
    console.log(JSON.stringify(payload, null, 2));

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Lemon Squeezy API Status:", response.status);

    if (!response.ok) {
      console.error("Lemon Squeezy API Error:", JSON.stringify(result, null, 2));
      // Return the full error detail to the UI
      const detail = result.errors?.[0]?.detail || result.errors?.[0]?.title || "Request rejected";
      const pointer = result.errors?.[0]?.source?.pointer || "";
      return { error: `${detail} ${pointer}`.trim() };
    }

    return { url: result.data.attributes.url };
  } catch (err: any) {
    console.error("--- Payment Action Failure ---");
    console.error(err);
    return { error: err.message || "Internal server error" };
  }
}

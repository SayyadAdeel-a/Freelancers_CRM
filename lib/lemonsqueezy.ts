import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * Ensures Lemon Squeezy is initialized with the API key.
 */
export function setupLemonSqueezy() {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMON_SQUEEZY_API_KEY is not set");
  }

  lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      console.error("Lemon Squeezy Error:", error);
    },
  });
}

"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (token && typeof window !== "undefined") {
      // Clear any stored toolbar state to prevent unauthorized 401 API calls
      // The PostHog toolbar should only be loaded manually via the Chrome extension
      sessionStorage.removeItem("_postHogToolbarParams");
      sessionStorage.removeItem("ph_" + token + "_toolbar");

      posthog.init(token, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

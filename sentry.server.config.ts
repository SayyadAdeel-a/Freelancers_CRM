// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "https://8aee8ffe64ea2157bedebfcc5b452d8a@o4511257828327424.ingest.us.sentry.io/4511257832259584",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: process.env.NODE_ENV === "development",

  // Enable sending user PII (Personally Identifiable Information)
  // Disable sendDefaultPii to protect sensitive client CRM data (GDPR/CCPA compliant)
  sendDefaultPii: false,
});

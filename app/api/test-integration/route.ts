import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const triggerError = searchParams.get("error") === "true";
  const triggerEvent = searchParams.get("event") === "true";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    sentry: {
      initialized: false,
      dsn_configured: !!process.env.NEXT_PUBLIC_SENTRY_DSN || !!process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    },
    posthog: {
      initialized: false,
      token_configured: !!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
      host_configured: !!process.env.NEXT_PUBLIC_POSTHOG_HOST,
    },
    status: "healthy",
  };

  // 1. Diagnose Sentry
  try {
    const client = Sentry.getClient();
    diagnostics.sentry.initialized = !!client;
    if (client) {
      diagnostics.sentry.options = {
        tracesSampleRate: client.getOptions()?.tracesSampleRate,
        sendDefaultPii: client.getOptions()?.sendDefaultPii,
      };
    }

    if (triggerError) {
      // Intentionally capture a simulated error for verification
      const testError = new Error(`Nudge CRM diagnostic verification exception at ${diagnostics.timestamp}`);
      const eventId = Sentry.captureException(testError);
      diagnostics.sentry.triggered_test_error = {
        success: true,
        event_id: eventId,
        message: testError.message,
      };
    }
  } catch (err: unknown) {
    diagnostics.sentry.error = err instanceof Error ? err.message : "Unknown error";
    diagnostics.status = "degraded";
  }

  // 2. Diagnose PostHog Node SDK
  try {
    const posthog = getPostHogClient();
    diagnostics.posthog.initialized = !!posthog;

    if (posthog && triggerEvent) {
      const mockUserId = "diagnostic-test-user-12345";
      posthog.capture({
        distinctId: mockUserId,
        event: "diagnostic_verification_triggered",
        properties: {
          timestamp: diagnostics.timestamp,
          environment: process.env.NODE_ENV,
          source: "server_api_route",
        },
      });
      diagnostics.posthog.triggered_test_event = {
        success: true,
        event: "diagnostic_verification_triggered",
        distinct_id: mockUserId,
      };
    }
  } catch (err: unknown) {
    diagnostics.posthog.error = err instanceof Error ? err.message : "Unknown error";
    diagnostics.status = "degraded";
  }

  return NextResponse.json({
    message: "Nudge CRM Integration Diagnostics Node",
    diagnostics,
    manual_verifications: {
      sentry_dashboard: "https://adeel-sayyad.sentry.io/projects/javascript-nextjs/",
      posthog_dashboard: "https://us.posthog.com/project/"
    },
    instructions: {
      test_sentry_error: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/test-integration?error=true`,
      test_posthog_event: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/test-integration?event=true`,
    }
  });
}

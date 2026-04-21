<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nudge CRM project. PostHog `posthog-js` and `posthog-node` were installed. Client-side initialization was added to `instrumentation-client.ts` (the correct approach for Next.js 15.3+) alongside the existing Sentry setup. A reverse proxy was configured in `next.config.ts` via `/ingest/*` rewrites to reduce ad-blocker interference. A server-side PostHog singleton was created at `lib/posthog-server.ts`. Environment variables (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) were written to `.env.local`. User identification (`posthog.identify`) is called on login and signup with the user's email as the distinct ID. Exception capture (`posthog.captureException`) was added in all relevant error catch blocks.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completed email/password signup | `app/(auth)/signup/page.tsx` |
| `user_signed_up_google` | User completed signup via Google OAuth | `app/(auth)/signup/page.tsx` |
| `user_logged_in` | User successfully logged in with email/password | `app/(auth)/login/page.tsx` |
| `user_logged_in_google` | User successfully logged in via Google OAuth | `app/(auth)/login/page.tsx` |
| `client_added` | User successfully added a new client | `components/dashboard/AddClientModal.tsx` |
| `client_deleted` | User deleted a client and all their data | `app/dashboard/client/[id]/page.tsx` |
| `note_added` | User added a note to a client | `components/dashboard/AddNote.tsx` |
| `reminder_set` | User scheduled an email reminder for a client follow-up | `components/dashboard/SetReminderModal.tsx` |
| `upgrade_modal_viewed` | User saw the upgrade/pro modal (triggered when hitting free plan limit) | `app/dashboard/clients/page.tsx` |
| `upgrade_cta_clicked` | User clicked the 'Get Pro' CTA in the upgrade modal | `components/dashboard/UpgradeModal.tsx` |
| `client_search_performed` | User searched for a client in the clients list | `app/dashboard/clients/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/391171/dashboard/1493123
- **Signup Trend** (daily email + Google signups): https://us.posthog.com/project/391171/insights/iLbnrTmR
- **Activation Funnel: Signup → Client Added → Note Added**: https://us.posthog.com/project/391171/insights/XzmiKACu
- **Upgrade Funnel: Modal Viewed → CTA Clicked**: https://us.posthog.com/project/391171/insights/kCTBqRW3
- **Core Engagement: Clients, Notes & Reminders**: https://us.posthog.com/project/391171/insights/LrwycPU5
- **Churn Signal: Client Deletions** (weekly adds vs deletes): https://us.posthog.com/project/391171/insights/oue8BekD

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

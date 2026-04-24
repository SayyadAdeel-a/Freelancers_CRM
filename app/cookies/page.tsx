import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookies."
      lastUpdated="April 2026"
      intro="This Cookie Policy explains what cookies are, how Nudge CRM uses them, and how you can control your cookie preferences."
      sections={[
        {
          title: "What Are Cookies",
          content: [
            "Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.",
            "Cookies help us remember your preferences, understand how you use our service, and improve your overall experience.",
          ],
        },
        {
          title: "Types of Cookies We Use",
          content: [
            "We use the following categories of cookies:",
            [
              "Essential Cookies — Required for the service to function. These include authentication cookies that keep you logged in. Cannot be disabled.",
              "Analytics Cookies — Used by PostHog to understand how users interact with Nudge. Helps us improve the product. Can be disabled.",
              "Error Tracking — Used by Sentry to capture JavaScript errors and improve reliability. Can be disabled.",
            ],
          ],
        },
        {
          title: "Essential Cookies (Always Active)",
          content: [
            "These cookies are strictly necessary for the operation of our service:",
            [
              "__session — Firebase authentication session token. Expires when you log out.",
              "XSRF-TOKEN — Cross-site request forgery protection. Session-based.",
            ],
            "You cannot opt out of these cookies as they are required for the service to function.",
          ],
        },
        {
          title: "Analytics Cookies (Optional)",
          content: [
            "We use PostHog for product analytics. These cookies help us understand:",
            [
              "Which features are most used",
              "Where users encounter friction",
              "How to prioritize improvements",
            ],
            "PostHog cookies are prefixed with ph_ and are set on our domain. Data is anonymized where possible.",
          ],
        },
        {
          title: "Third-Party Cookies",
          content: [
            "When you authenticate with Google, Google may set its own cookies as part of the OAuth flow. We do not control these cookies — please refer to Google's Privacy Policy for more information.",
            "If you upgrade to Pro, Lemon Squeezy (our payment processor) may set cookies during the checkout process.",
          ],
        },
        {
          title: "Managing Your Cookie Preferences",
          content: [
            "You can control cookies through:",
            [
              "Browser settings — Most browsers allow you to view, manage, and delete cookies. Check your browser's help documentation for instructions.",
              "Opt-out tools — PostHog provides an opt-out mechanism at posthog.com/opt-out",
              "Do Not Track — We respect the Do Not Track (DNT) browser setting. When DNT is enabled, we disable analytics cookies.",
            ],
            "Note: Disabling essential cookies will prevent you from using the service.",
          ],
        },
        {
          title: "Data Retention",
          content: [
            "Cookie data is retained for the following periods:",
            [
              "Session cookies — Deleted when you close your browser",
              "Authentication cookies — Expire after 30 days of inactivity",
              "Analytics cookies — Retained for 12 months",
            ],
          ],
        },
        {
          title: "Changes to This Policy",
          content: [
            "We may update this Cookie Policy as our practices change. We will post the updated policy on this page with a new 'Last updated' date.",
          ],
        },
        {
          title: "Contact",
          content: [
            "Questions about our use of cookies? Email us at hello@mail.adeelsayyad.tech.",
          ],
        },
      ]}
    />
  );
}

import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy."
      lastUpdated="April 21, 2026"
      intro="At Nudge CRM, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application."
      sections={[
        {
          title: "Information We Collect",
          content: [
            "We collect information that you provide directly to us when you register for an account, use the application, or communicate with us.",
            [
              "Personal identification information (Name, email address)",
              "Authentication data provided by third-party identity providers (e.g., Google)",
              "Client data you enter into the application (client names, emails, companies, notes)",
              "Usage data and analytics to improve the service",
            ],
          ],
        },
        {
          title: "How We Use Your Information",
          content: [
            "We use the information we collect to:",
            [
              "Provide, operate, and maintain our application",
              "Process transactions and send related information",
              "Send administrative information, such as updates, security alerts, and support messages",
              "Respond to comments, questions, and requests",
              "Monitor and analyze trends, usage, and activities in connection with our services",
            ],
          ],
        },
        {
          title: "Data Storage & Security",
          content: [
            "Your data is stored securely using Firebase (Google Cloud Platform). We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.",
            "While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the Internet or method of electronic storage is 100% secure.",
          ],
        },
        {
          title: "Third-Party Services",
          content: [
            "We use the following third-party services:",
            [
              "Firebase (Google) — Authentication and database storage",
              "PostHog — Product analytics and error tracking",
              "Sentry — Error monitoring",
              "Lemon Squeezy — Payment processing for Pro subscriptions",
            ],
            "Each of these services has their own privacy policy and data handling practices. We recommend reviewing their policies.",
          ],
        },
        {
          title: "Your Rights",
          content: [
            "You have the right to:",
            [
              "Access the personal information we hold about you",
              "Request correction of inaccurate data",
              "Request deletion of your account and associated data",
              "Object to processing of your personal data",
              "Request restriction of processing",
            ],
            "To exercise any of these rights, contact us at hello@nudgecrm.app.",
          ],
        },
        {
          title: "Cookies",
          content: [
            "We use cookies and similar tracking technologies to track activity on our service. See our Cookie Policy for more details.",
          ],
        },
        {
          title: "Changes to This Policy",
          content: [
            "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date.",
          ],
        },
        {
          title: "Contact Us",
          content: [
            "If you have any questions about this Privacy Policy, please contact us at hello@nudgecrm.app.",
          ],
        },
      ]}
    />
  );
}

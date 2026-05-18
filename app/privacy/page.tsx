import { LegalPageLayout } from "@/components/LegalPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Nudge CRM",
  description: "Learn how Nudge CRM collects, stores, and protects your database, client lists, and invoicing data with industry-leading encryption and GDPR-compliant measures.",
  alternates: {
    canonical: "https://app.adeelsayyad.tech/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy."
      lastUpdated="April 2026"
      intro="At Nudge CRM, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our simple CRM for freelancers at app.adeelsayyad.tech."
      sections={[
        {
          title: "What data we collect",
          content: [
            "We collect information that you provide directly to us when you register for an account or use the service:",
            [
              "Basic Account Information: Name and email address.",
              "Service Data: Client names, emails, company details, notes, and payment statuses that you enter into the application.",
              "Payment Information: When you subscribe to a Pro plan, payment details are processed by Lemon Squeezy. We do not store your credit card information on our servers.",
              "Authentication Data: Data provided by Google if you choose to sign in using their services.",
            ],
          ],
        },
        {
          title: "How we use your data",
          content: [
            "We use the data we collect solely to provide and improve the Nudge service:",
            [
              "To maintain your account and provide access to the CRM features.",
              "To process your subscription payments via Lemon Squeezy.",
              "To send essential service-related emails (e.g., password resets or payment notifications).",
              "To improve the application by analyzing usage patterns (anonymized where possible).",
            ],
            "We do not sell your data to third parties.",
          ],
        },
        {
          title: "Data Storage & Security",
          content: [
            "Your data is stored and secured using industry-standard providers:",
            [
              "Database: Your client data is stored in Firebase Firestore (Google Cloud), which provides robust encryption at rest and in transit.",
              "Authentication: User authentication is handled via Firebase Auth.",
              "Backups: Regular backups are performed to ensure data integrity.",
            ],
          ],
        },
        {
          title: "Third-Party Services",
          content: [
            "Nudge utilizes the following third-party services to function:",
            [
              "Firebase (Google): Infrastructure, database, and authentication.",
              "Lemon Squeezy: Payment processing and subscription management.",
              "Resend: Sending transactional emails (notifications, resets).",
              "PostHog: Product analytics to understand how users interact with Nudge.",
              "Sentry: Error monitoring to help us fix bugs quickly.",
            ],
          ],
        },
        {
          title: "User Rights",
          content: [
            "As a user of Nudge, you have the following rights regarding your data:",
            [
              "Access: You can view all the client data you've entered at any time.",
              "Deletion: You can request account deletion by emailing us, which will remove all your data from our systems.",
              "Export: You can request an export of your client data in a machine-readable format.",
            ],
            "To exercise these rights, please contact us at the email provided below.",
          ],
        },
        {
          title: "Cookies Policy",
          content: [
            "We use essential cookies to keep you signed in and remember your preferences. These are necessary for the application to function. We may also use analytical cookies via PostHog to help us improve the service.",
          ],
        },
        {
          title: "Contact Information",
          content: [
            "If you have any questions regarding this Privacy Policy or your data, please contact Sayyad Adeel at hello@mail.adeelsayyad.tech.",
          ],
        },
      ]}
    />
  );
}

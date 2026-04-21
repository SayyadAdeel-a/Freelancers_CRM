import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms."
      lastUpdated="April 21, 2026"
      intro="By accessing or using Nudge CRM, you agree to be bound by these Terms of Service. Please read them carefully before using our service."
      sections={[
        {
          title: "Acceptance of Terms",
          content: [
            "By accessing and using Nudge CRM, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these Terms, you may not use or access this service.",
          ],
        },
        {
          title: "Description of Service",
          content: [
            "Nudge CRM is a client relationship management tool designed for freelancers. The service allows you to:",
            [
              "Add and manage client contacts",
              "Log notes and interactions with clients",
              "Set reminders for client follow-ups (Pro plan)",
              "Access your data from any device with a web browser",
            ],
          ],
        },
        {
          title: "Free & Pro Plans",
          content: [
            "Free Plan: You may use the service at no cost with up to 25 clients. Core features including client management and note-taking are included.",
            "Pro Plan: For $9/month you receive unlimited clients, email reminders, full notes history, and priority support. Billing is handled by Lemon Squeezy.",
            "We reserve the right to modify pricing with 30 days notice to existing subscribers.",
          ],
        },
        {
          title: "User Responsibilities",
          content: [
            "You are responsible for:",
            [
              "Maintaining the confidentiality of your account credentials",
              "All activity that occurs under your account",
              "Ensuring your use of the service complies with applicable laws",
              "Not uploading any unlawful, offensive, or harmful content",
              "Not attempting to reverse engineer or compromise the service",
            ],
          ],
        },
        {
          title: "Data & Privacy",
          content: [
            "Your client data belongs to you. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. See our Privacy Policy for complete details on data handling.",
          ],
        },
        {
          title: "Termination",
          content: [
            "You may cancel your account at any time from your account settings. Upon cancellation:",
            [
              "Free plan accounts: your data will be retained for 30 days before deletion",
              "Pro plan accounts: you retain access until the end of your billing period, then revert to free",
              "You may request immediate data deletion by contacting hello@nudgecrm.app",
            ],
          ],
        },
        {
          title: "Limitation of Liability",
          content: [
            "Nudge CRM shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or related to your use of the service.",
            "Our total liability shall not exceed the amounts paid by you in the twelve months prior to the claim.",
          ],
        },
        {
          title: "Governing Law",
          content: [
            "These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.",
          ],
        },
        {
          title: "Changes to Terms",
          content: [
            "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or an in-app notice. Continued use after changes constitutes acceptance.",
          ],
        },
        {
          title: "Contact",
          content: [
            "For questions regarding these Terms, contact us at hello@nudgecrm.app.",
          ],
        },
      ]}
    />
  );
}

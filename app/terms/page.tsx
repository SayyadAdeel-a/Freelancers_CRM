import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms."
      lastUpdated="April 2026"
      intro="By using Nudge CRM, you agree to these Terms of Service. Nudge is a SaaS web application built by Sayyad Adeel to help freelancers manage their client relationships effectively."
      sections={[
        {
          title: "Acceptance of Terms",
          content: [
            "By accessing app.adeelsayyad.tech ('the Service'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.",
          ],
        },
        {
          title: "Description of Service",
          content: [
            "Nudge is a minimalist CRM designed for freelancers and solo professionals. It provides tools for tracking clients, logging notes, and managing payment statuses.",
          ],
        },
        {
          title: "User Accounts",
          content: [
            "You are responsible for maintaining the security of your account and password. Nudge cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.",
            "You must provide a valid email address to complete the signup process.",
          ],
        },
        {
          title: "Plans & Pricing",
          content: [
            [
              "Free Plan: Includes client management for up to 5 clients at no cost.",
              "Pro Plan: Priced at $9/month, providing unlimited clients and advanced features.",
              "Payments: All payments are processed securely via Lemon Squeezy.",
              "Upgrades/Downgrades: You can upgrade to Pro at any time. If you downgrade to Free, access to clients beyond the 5-client limit may be restricted.",
            ],
          ],
        },
        {
          title: "Acceptable Use",
          content: [
            "You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.",
            "Spamming or harassment of any kind via the platform is strictly prohibited.",
          ],
        },
        {
          title: "Intellectual Property",
          content: [
            "Nudge (Sayyad Adeel) owns all intellectual property rights to the software, designs, and brand. You own all the data (client information, notes) that you enter into the application.",
          ],
        },
        {
          title: "Termination",
          content: [
            "We reserve the right to terminate or suspend your account if you violate these Terms. You may cancel your account at any time. Upon cancellation, your data will be handled according to our Privacy Policy.",
          ],
        },
        {
          title: "Limitation of Liability",
          content: [
            "The Service is provided on an 'as is' and 'as available' basis. We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Service.",
          ],
        },
        {
          title: "Changes to Terms",
          content: [
            "We may update these terms from time to time. Significant changes will be notified to registered users via email.",
          ],
        },
        {
          title: "Governing Law",
          content: [
            "These terms are governed by the laws applicable to independent developers in the jurisdiction of the Service provider (Sayyad Adeel).",
          ],
        },
        {
          title: "Contact Information",
          content: [
            "For any questions regarding these Terms, please contact us at hello@nudgecrm.app.",
          ],
        },
      ]}
    />
  );
}

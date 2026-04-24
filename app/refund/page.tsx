import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refunds."
      lastUpdated="April 2026"
      intro="We want you to be happy with Nudge CRM. This policy outlines our refund and cancellation practices for our Pro subscription plan."
      sections={[
        {
          title: "Try Before You Buy",
          content: [
            "Nudge offers a robust Free plan that allows you to manage up to 5 clients with no time limit. We encourage all users to use the Free plan to ensure Nudge meets their needs before upgrading to a Pro subscription.",
          ],
        },
        {
          title: "Cancellation",
          content: [
            "You can cancel your Pro subscription at any time through your account settings or via the Lemon Squeezy customer portal. After cancellation, you will continue to have access to Pro features until the end of your current billing period.",
          ],
        },
        {
          title: "Refund Eligibility",
          content: [
            "We offer a 7-day refund window for first-time Pro subscriptions. If you are not satisfied with the service, you can request a full refund within 7 days of your initial payment.",
            "Refunds are not available for recurring renewal payments once the 7-day window of the initial subscription has passed.",
          ],
        },
        {
          title: "How to Request a Refund",
          content: [
            "To request a refund, please email hello@nudgecrm.app from the email address associated with your account. Please include your transaction ID from the Lemon Squeezy receipt to help us process your request faster.",
          ],
        },
        {
          title: "Processing Time",
          content: [
            "Once approved, refunds typically take 5-10 business days to appear in your account, depending on your bank or card issuer.",
          ],
        },
        {
          title: "Contact Information",
          content: [
            "If you have any questions regarding our refund policy, please reach out to us at hello@nudgecrm.app.",
          ],
        },
      ]}
    />
  );
}

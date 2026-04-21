import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#262626] font-sans py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-[#FF4C00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 21, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <p>
            At Nudge CRM, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you register for an account, use the application, or communicate with us. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal identification information (Name, email address)</li>
            <li>Authentication data provided by third-party identity providers (e.g., Google)</li>
            <li>Client data that you enter into the CRM application</li>
            <li>Usage data and interaction metrics</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect primarily to provide, maintain, and improve our services. Specifically, we may use your information to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage your account</li>
            <li>Provide the CRM functionalities (storing client data, generating reminders)</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send administrative information and notifications</li>
            <li>Improve our website and user experience</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security and Storage</h2>
          <p>
            Your data is stored securely using Google Cloud (Firebase) infrastructure. We implement appropriate technical and organizational measures to protect your personal data and the client data you store in our CRM against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
          <p>
            We do not sell, trade, or rent your personal identification information to others.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            We may use third-party service providers (such as payment processors like Lemon Squeezy, or analytics tools like PostHog) to help us operate our business. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, including the right to access, correct, or delete the data we hold about you. You can manage your account information directly within the Nudge CRM application.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@nudgecrm.com.
          </p>
        </div>
      </div>
    </div>
  );
}

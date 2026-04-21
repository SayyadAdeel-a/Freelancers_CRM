import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: April 21, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <p>
            Welcome to Nudge CRM. By accessing or using our website, application, or services, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By registering for, accessing, or using Nudge CRM, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not use our services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
          <p>
            Nudge CRM provides a client management platform specifically designed for freelancers. Features include client tracking, reminders, and data synchronization. We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating an account.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Acceptable Use</h2>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You may not attempt to gain unauthorized access to our systems or user accounts.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by Nudge CRM and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall Nudge CRM, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@nudgecrm.com.
          </p>
        </div>
      </div>
    </div>
  );
}

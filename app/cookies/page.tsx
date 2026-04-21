import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: April 21, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <p>
            This Cookie Policy explains how Nudge CRM uses cookies and similar tracking technologies when you visit our website or use our application.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used in order to make websites work, or work more efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Cookies</h2>
          <p>
            We use cookies for several reasons. Some cookies are required for technical reasons in order for our services to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our application.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary to authenticate you and keep you logged in securely.</li>
            <li><strong>Analytics Cookies:</strong> We use PostHog to understand how users interact with our service so we can improve it.</li>
            <li><strong>Functional Cookies:</strong> Used to remember your preferences and settings.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on. Specifically, we use Firebase Authentication, which relies on cookies or similar technologies for maintaining secure user sessions.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Managing Your Cookie Preferences</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please contact us at support@nudgecrm.com.
          </p>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nudge CRM | Freelancer Client Management",
  description: "The minimalist CRM for freelancers. Manage clients, track notes, and never miss a follow-up with smart reminders.",
  keywords: ["CRM", "freelancer", "client management", "productivity", "reminders"],
  openGraph: {
    title: "Nudge CRM",
    description: "Freelancer CRM - Manage clients without the 747 cockpit",
    type: "website",
    url: "https://freelancers-crm-one.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nudge CRM",
    description: "The minimalist CRM for freelancers.",
  }
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nudge CRM | Premium Invoicing & Client Management for Freelancers",
  description: "The industrial-grade CRM for modern freelancers. Manage clients, send stunning invoices, and track projects with a high-performance, Nothing-inspired interface.",
  keywords: ["Freelancer CRM", "Free Invoicing Software", "Client Management", "Professional Invoices", "Freelance Productivity", "Nudge CRM"],
  authors: [{ name: "Adeel Sayyad" }],
  metadataBase: new URL("https://app.adeelsayyad.tech"),
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: "Nudge CRM",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Nudge CRM | Premium Invoicing for Freelancers",
    description: "Industrial-grade client management and invoicing. Built for speed, designed for impact.",
    type: "website",
    url: "https://app.adeelsayyad.tech",
    siteName: "Nudge CRM",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nudge CRM Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nudge CRM | Premium Invoicing",
    description: "Manage your freelance business with an industrial-grade interface.",
    images: ["/og-image.png"],
  }
};

import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { JsonLd } from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <JsonLd />
        <PostHogProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors />
            </AuthProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

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
  title: `${APP_CONFIG.name} | Freelancer Client Management`,
  description: APP_CONFIG.description,
  keywords: ["CRM", "freelancer", "client management", "productivity", "reminders"],
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: APP_CONFIG.name,
  },
  openGraph: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    type: "website",
    url: "https://freelancers-crm-one.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  }
};

import { PostHogProvider } from "@/components/providers/PostHogProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased">
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

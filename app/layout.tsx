import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} | Freelancer Client Management`,
  description: APP_CONFIG.description,
  keywords: ["CRM", "freelancer", "client management", "productivity", "reminders"],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

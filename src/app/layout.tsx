import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Newsletter Generator | Create Engaging Newsletters in Seconds",
  description: "Stop struggling with writer's block. Use our advanced AI to curate, write, and format stunning newsletters for your audience automatically.",
  keywords: ["AI newsletter", "content creation", "email marketing", "newsletter generator", "artificial intelligence"],
  openGraph: {
    title: "AI Newsletter Generator",
    description: "Create engaging newsletters in seconds with AI.",
    type: "website",
    locale: "en_US",
    siteName: "AI Newsletter Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Newsletter Generator",
    description: "Create engaging newsletters in seconds with AI.",
  }
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shivashree Developers | Residential Apartments in Kumbakonam & Chennai",
    template: "%s | Shivashree Developers",
  },
  description:
    "Premium RERA-registered residential apartments in Kumbakonam and Chennai by Shivashree Developers. Explore ongoing and completed projects.",
  keywords: [
    "apartments in Kumbakonam",
    "flats in Chennai",
    "real estate Kumbakonam",
    "Shivashree Developers",
    "2BHK Kumbakonam",
    "3BHK Chennai",
    "RERA apartments Tamil Nadu",
  ],
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? "https://shivashreedev.com"
  ),
  openGraph: {
    type: "website",
    siteName: "Shivashree Developers",
    locale: "en_IN",
  },
};

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
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

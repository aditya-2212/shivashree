import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
  metadataBase: new URL("https://www.shivashreedevelopers.com"),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Shivashree Developers",
    locale: "en_IN",
  },
  verification: {
    google: "C2p1IpQRnRFbWvvPGEJpcmnOOAP6tx_b1S7EpL80z4I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

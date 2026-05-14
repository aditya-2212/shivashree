import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { prisma } from "@/lib/prisma";
import { buildPublicSiteCopy } from "@/lib/site-copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const c = buildPublicSiteCopy(s);
  return {
    title: {
      default: c.homeMetaTitle,
      template: `%s | ${c.structuredOrgName}`,
    },
    description: c.homeMetaDescription,
    keywords: [
      "apartments in Kumbakonam",
      "flats in Chennai",
      "real estate Kumbakonam",
      c.structuredOrgName,
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
      siteName: c.structuredOrgName,
      locale: "en_IN",
    },
  };
}

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

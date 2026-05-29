import { headers } from "next/headers";
import { getSettings, getPublishedProperties } from "@/lib/data";
import Navbar from "@/components/public/Navbar";

import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { Toaster } from "react-hot-toast";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, publishedProperties, headerList] = await Promise.all([
    getSettings(),
    getPublishedProperties(),
    headers(),
  ]);

  // Set by middleware. Lets the navbar render in hero (transparent) mode on the
  // server for the homepage, so there's no white-bar flash on first paint.
  const isHome = headerList.get("x-pathname") === "/";

  return (
    <>
      <Navbar
        isHome={isHome}
        properties={publishedProperties}
        whatsappNumber={settings?.whatsappNumber}
      />
      <main>{children}</main>
      <Footer settings={settings} />
      {settings?.whatsappNumber && (
        <WhatsAppButton number={settings.whatsappNumber} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

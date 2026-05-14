import { getSettings, getPublishedProperties } from "@/lib/data";
import Navbar from "@/components/public/Navbar";

export const revalidate = 3600;
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { SiteUiProvider } from "@/components/public/SiteUiProvider";
import { Toaster } from "react-hot-toast";
import { buildPublicSiteCopy, enquiryCopyFrom } from "@/lib/site-copy";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, publishedProperties] = await Promise.all([
    getSettings(),
    getPublishedProperties(),
  ]);
  const copy = buildPublicSiteCopy(settings);

  return (
    <>
      <Navbar
        properties={publishedProperties}
        whatsappNumber={settings?.whatsappNumber}
        copy={copy}
      />
      <SiteUiProvider enquiryCopy={enquiryCopyFrom(copy)}>
        <main>{children}</main>
      </SiteUiProvider>
      <Footer settings={settings} copy={copy} />
      {settings?.whatsappNumber && (
        <WhatsAppButton
          number={settings.whatsappNumber}
          prefillMessage={copy.floatWhatsappPrefillMessage}
          ariaLabel={copy.floatWhatsappAriaLabel}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
}

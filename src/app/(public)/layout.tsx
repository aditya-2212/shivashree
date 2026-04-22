import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";

export const dynamic = "force-dynamic";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { Toaster } from "react-hot-toast";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, publishedProperties] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.property.findMany({
      where: { isPublished: true },
      select: { title: true, slug: true, status: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <>
      <Navbar
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

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Site settings</h1>
        <p className="text-stone-500 text-sm mt-1">
          The single source of truth for the phone numbers, addresses, social
          links and the corporate-office Google Maps embed shown on the public
          website. Change something here and it updates everywhere — footer,
          contact page, WhatsApp button.
        </p>
      </div>
      <SiteSettingsForm initialData={settings} />
    </div>
  );
}

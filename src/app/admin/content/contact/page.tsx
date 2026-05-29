import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContentForm from "@/components/admin/ContentForm";
import { CONTACT_SECTIONS } from "@/lib/content-fields";

export default async function ContactContentPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Contact page</h1>
        <p className="text-stone-500 text-sm mt-1">
          The copy on the Contact page. Office addresses, phone and email are edited
          on the Site settings page.
        </p>
      </div>
      <ContentForm
        sections={CONTACT_SECTIONS}
        initialData={settings}
        successMessage="Contact page updated! Changes are now live."
      />
    </div>
  );
}

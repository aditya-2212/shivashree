import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContentForm from "@/components/admin/ContentForm";
import { RESOURCES_SECTIONS } from "@/lib/content-fields";

export default async function ResourcesContentPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Resources pages</h1>
        <p className="text-stone-500 text-sm mt-1">
          Headers and copy for the &ldquo;Notes &amp; guides&rdquo; (blog) and FAQs
          pages. The posts and questions themselves are managed under Notes &amp;
          guides and FAQs.
        </p>
      </div>
      <ContentForm
        sections={RESOURCES_SECTIONS}
        initialData={settings}
        successMessage="Resources pages updated! Changes are now live."
      />
    </div>
  );
}

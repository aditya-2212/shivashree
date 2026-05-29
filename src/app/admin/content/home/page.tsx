import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContentForm from "@/components/admin/ContentForm";
import { HOME_SECTIONS } from "@/lib/content-fields";

export default async function HomeContentPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Home page</h1>
        <p className="text-stone-500 text-sm mt-1">
          All the editable text and images on the homepage. Boxes show the current
          text — just change what you need and save.
        </p>
      </div>
      <ContentForm
        sections={HOME_SECTIONS}
        initialData={settings}
        successMessage="Homepage updated! Changes are now live."
      />
    </div>
  );
}

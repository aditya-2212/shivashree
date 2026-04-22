import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FAQManager from "@/components/admin/FAQManager";

export default async function FAQsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const faqs = await prisma.fAQEntry.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">
          Questions buyers actually ask
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          These show up on the Resources → FAQs page on the website. Group them
          by category, write the answer the way you&rsquo;d say it on a phone
          call, and drag to reorder.
        </p>
      </div>
      <FAQManager initialFAQs={faqs} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import FAQTabs from "@/components/public/FAQTabs";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StructuredData, { faqSchema } from "@/components/StructuredData";
import { faqsPageDefaults as D } from "@/lib/site-defaults";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return {
    title: s?.faqsMetaTitle?.trim() || D.metaTitle,
    description: s?.faqsMetaDescription?.trim() || D.metaDescription,
  };
}

export default async function FAQsPage() {
  const [faqs, s] = await Promise.all([
    prisma.fAQEntry.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <>
      {/* FAQ structured data is built from the same questions managed in the
          admin FAQs section, so the schema always matches the visible list. */}
      {faqs.length > 0 && (
        <StructuredData
          data={faqSchema(
            faqs.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />
      )}
      <section className="pt-36 pb-16 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
            {s?.faqsHeroEyebrow?.trim() || D.heroEyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {s?.faqsHeroHeading?.trim() || D.heroHeading}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            {s?.faqsHeroIntro?.trim() || D.heroIntro}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FAQTabs faqs={faqs} />
        </div>
      </section>

      <section className="py-10 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-stone-700">
            {s?.faqsCtaText?.trim() || D.ctaText}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-purple-700 transition"
          >
            {s?.faqsCtaButtonLabel?.trim() || D.ctaButtonLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

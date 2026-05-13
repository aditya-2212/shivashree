import { prisma } from "@/lib/prisma";
import FAQTabs from "@/components/public/FAQTabs";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "FAQs — Shivashree Developers",
  description:
    "Booking, home loans, TNRERA, possession dates and post-possession service — answers to the questions buyers actually ask us.",
};

export default async function FAQsPage() {
  const faqs = await prisma.fAQEntry.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <>
      <section className="pt-36 pb-16 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
            FAQs
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            The questions buyers actually ask us.
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Filter by category, or scan the list — and if your question
            isn&rsquo;t here, send it across and we&rsquo;ll add an answer.
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
            Question not answered above? Ask us directly.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-purple-700 transition"
          >
            Contact us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

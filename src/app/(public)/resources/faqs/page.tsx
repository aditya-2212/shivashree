import { prisma } from "@/lib/prisma";
import FAQTabs from "@/components/public/FAQTabs";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StructuredData, { faqSchema } from "@/components/StructuredData";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Real Estate FAQs | Buying Apartments in Kumbakonam & Chennai",
  description:
    "Find answers to common questions about buying 2 & 3 BHK apartments in Kumbakonam and Chennai. Learn about pricing, legal checks, investment benefits, and property buying process with Shivashree Developers.",
};

export default async function FAQsPage() {
  const faqs = await prisma.fAQEntry.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <>
      <StructuredData data={faqSchema([
        { question: "What is the current real estate market trend in Kumbakonam?", answer: "The Kumbakonam real estate market is steadily growing with increasing demand from local buyers, NRIs, and investors looking for apartments and investment opportunities." },
        { question: "What factors affect apartment prices in Kumbakonam?", answer: "Apartment prices depend on location, infrastructure development, demand and supply, economic conditions, and government regulations." },
        { question: "Is buying a 2 & 3 BHK apartment in Kumbakonam a good investment?", answer: "Yes, investing in 2 and 3 BHK apartments in Kumbakonam offers affordability, cultural value, and strong future growth potential." },
        { question: "What additional costs should I consider when buying a flat?", answer: "Additional costs include stamp duty, registration fees, legal charges, maintenance charges, and property taxes depending on the project." },
        { question: "How can I verify the legal status of a property before buying?", answer: "You should verify property documents through legal experts, including title verification, approvals, and background checks." },
        { question: "Can Chennai buyers invest in apartments in Kumbakonam?", answer: "Yes, Chennai buyers prefer investing in Kumbakonam due to affordable pricing and strong appreciation potential." },
      ])} />
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

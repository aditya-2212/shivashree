import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { formatPrice, parseJsonField } from "@/lib/utils";
import type { Metadata } from "next";
import StructuredData, { faqSchema } from "@/components/StructuredData";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ongoing Residential Projects in Kumbakonam | 2 & 3 BHK Apartments for Sale",
  description:
    "Explore ongoing residential projects in Kumbakonam by Shivashree Developers. Premium 2 & 3 BHK apartments for sale with modern amenities, prime locations, and quality construction. Ideal for homebuyers and Chennai investors.",
};

const sections = [
  {
    key: "ONGOING" as const,
    label: "Now selling",
    sub: "Booking is open and construction is in progress.",
    anchorId: "ongoing",
    dot: "bg-brand-purple-600",
    chip: "bg-brand-purple-50 text-brand-purple-700 border-brand-purple-100",
  },
  {
    key: "PROPOSED" as const,
    label: "Coming soon",
    sub: "Designs being finalised — register interest for pre-launch pricing.",
    anchorId: "proposed",
    dot: "bg-brand-blue-500",
    chip: "bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100",
  },
  {
    key: "COMPLETED" as const,
    label: "Delivered",
    sub: "Possession-ready apartments. Walkthroughs and handovers by appointment year-round.",
    anchorId: "completed",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    key: "SOLD_OUT" as const,
    label: "Sold Out",
    sub: "All units have been sold. Contact us for resale opportunities.",
    anchorId: "sold-out",
    dot: "bg-stone-400",
    chip: "bg-stone-100 text-stone-600 border-stone-200",
  },
];

export default async function ProjectsPage() {
  const properties = await prisma.property.findMany({
    where: { isPublished: true },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      locality: true,
      status: true,
      priceStartingFrom: true,
      heroImage: true,
      heroImageAlt: true,
      bhkTypes: true,
      highlights: true,
      reraNumber: true,
    },
  });

  const grouped = properties.reduce(
    (acc, p) => {
      if (!acc[p.status]) acc[p.status] = [];
      acc[p.status].push(p);
      return acc;
    },
    {} as Record<string, typeof properties>
  );

  return (
    <>
      <StructuredData data={faqSchema([
        { question: "What ongoing apartment projects are available in Kumbakonam?", answer: "Shivashree Developers offers ongoing residential projects in Kumbakonam featuring premium 2 and 3 BHK apartments with modern amenities and quality construction." },
        { question: "Are 2 & 3 BHK apartments available for sale in Kumbakonam projects?", answer: "Yes, the projects include well-designed 2 and 3 BHK apartments for sale in Kumbakonam suitable for families and investors." },
        { question: "Why invest in ongoing projects in Kumbakonam?", answer: "Ongoing projects in Kumbakonam offer better pricing, flexible payment options, and strong appreciation potential, making them a smart investment choice." },
        { question: "What amenities are included in these apartment projects?", answer: "Projects typically include car parking, security, power backup, water supply, and proximity to schools, hospitals, and transport facilities." },
        { question: "Are these projects suitable for Chennai-based buyers?", answer: "Yes, Chennai buyers prefer investing in Kumbakonam due to affordable pricing, peaceful environment, and long-term growth potential." },
        { question: "How to book an apartment in Shivashree Developers projects?", answer: "You can book an apartment by contacting Shivashree Developers through their website or visiting the project site for consultation and booking assistance." },
      ])} />
      {/* Page header */}
      <section className="pt-36 pb-16 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
            All projects
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            What we&rsquo;re building right now.
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Three live developments — one with units already handed over, one
            on site, and one announcing soon. Skip to whichever stage matches
            where you are.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {sections.map(
              (s) =>
                grouped[s.key]?.length && (
                  <a
                    key={s.key}
                    href={`#${s.anchorId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition"
                  >
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    {s.label}
                    <span className="text-white/60">·</span>
                    <span className="text-white/70 text-xs">
                      {grouped[s.key].length}
                    </span>
                  </a>
                )
            )}
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="bg-white">
        {sections.map((section) => {
          const sectionProperties = grouped[section.key] ?? [];
          if (!sectionProperties.length) return null;

          return (
            <section
              key={section.key}
              id={section.anchorId}
              className="py-16 scroll-mt-20 border-b border-stone-100 last:border-b-0"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`w-3 h-3 rounded-full ${section.dot}`} />
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
                    {section.label}
                  </h2>
                </div>
                <p className="text-stone-600 mb-8 ml-6 max-w-xl">
                  {section.sub}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionProperties.map((property) => {
                    const bhkTypes = parseJsonField<string[]>(
                      property.bhkTypes,
                      []
                    );

                    return (
                      <Link
                        key={property.id}
                        href={`/projects/${property.slug}`}
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-brand-purple-300 hover:shadow-[0_12px_40px_-20px_rgba(90,45,133,0.45)] transition-all"
                      >
                        <div className="relative bg-brand-purple-50/60 flex items-center justify-center min-h-[180px]">
                          {property.heroImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={property.heroImage}
                              alt={property.heroImageAlt ?? property.title}
                              className="w-full h-auto object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <p className="text-brand-purple-400 text-sm py-12">
                              Image being uploaded
                            </p>
                          )}
                          <span
                            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${section.chip}`}
                          >
                            {section.label}
                          </span>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-stone-900 text-lg mb-1 group-hover:text-brand-purple-700 transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-3">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {property.locality}, {property.city}
                          </div>

                          {property.reraNumber && (
                            <p className="text-xs text-stone-500 mb-3">
                              TNRERA: {property.reraNumber}
                            </p>
                          )}

                          {bhkTypes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {bhkTypes.map((bhk) => (
                                <span
                                  key={bhk}
                                  className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md font-medium"
                                >
                                  {bhk}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto flex items-center justify-between pt-3 border-t border-stone-100">
                            <div>
                              {property.priceStartingFrom ? (
                                <>
                                  <p className="text-xs text-stone-400">
                                    Starting at
                                  </p>
                                  <p className="font-bold text-stone-900">
                                    {formatPrice(property.priceStartingFrom)}
                                  </p>
                                </>
                              ) : (
                                <p className="text-xs text-stone-500 leading-tight">
                                  Pricing on request
                                </p>
                              )}
                            </div>
                            <span className="text-brand-purple-700 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                              Project page
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

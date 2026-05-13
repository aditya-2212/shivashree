import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/public/HeroSection";
import EnquiryForm from "@/components/public/EnquiryForm";
import StructuredData, { organizationSchema } from "@/components/StructuredData";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Hammer,
  Phone,
} from "lucide-react";
import { formatPrice, parseJsonField } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Shivashree Developers | Residential apartments in Kumbakonam & Chennai",
  description:
    "Shivashree Developers builds RERA-registered 2 & 3 BHK apartments in Kumbakonam and Chennai. See projects that are now selling, coming soon, and ready to move in.",
};

const statusBadge = {
  PROPOSED: {
    label: "Coming Soon",
    chip: "bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100",
  },
  ONGOING: {
    label: "Now Selling",
    chip: "bg-brand-purple-50 text-brand-purple-700 border-brand-purple-100",
  },
  COMPLETED: {
    label: "Ready to Move",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
} as const;

export default async function HomePage() {
  const [heroSlides, properties, settings] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.property.findMany({
      where: { isPublished: true },
      orderBy: [{ status: "asc" }, { title: "asc" }],
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
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  // The hero accepts a list of slides from the CMS. If the team hasn't added
  // any yet, we fall back to the first published property's hero image so we
  // never render a flat-coloured hero.
  const fallbackHero = properties.find((p) => p.heroImage);
  const heroData =
    heroSlides.length > 0
      ? heroSlides
      : fallbackHero?.heroImage
        ? [
            {
              id: -1,
              imageUrl: fallbackHero.heroImage,
              overlayHeading: "Apartments in Kumbakonam & Chennai\nBuilt by people who live here.",
              subheading:
                "Shivashree Developers — TNRERA-registered 2 & 3 BHK homes since 2000.",
              ctaLabel: "See current projects",
              ctaUrl: "/projects",
            },
          ]
        : [];

  return (
    <>
      <StructuredData data={organizationSchema(settings ?? undefined)} />

      {/* Hero with property image background, sourced from CMS */}
      <HeroSection slides={heroData} whatsappNumber={settings?.whatsappNumber} />

      {/* Three project tiles laid out by status — the homepage is mostly here
          to send visitors straight to a relevant project, so we don't bury
          the inventory under generic marketing. */}
      <section className="py-20 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div className="max-w-xl">
              <p className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest mb-2">
                Discover Your Dream With Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                Step Into Excellence with Shivashree Developers — Where Dreams Find a Home
              </h2>
              <p className="text-stone-600 mt-3 text-base leading-relaxed">
                For over a decade, we have been creating exceptional apartments in
                Kumbakonam, blending quality, dedication, reliability, and excellence.
                Known for transforming plots into stunning homes, we&rsquo;ve earned a
                solid reputation as a trusted property developer.
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 text-brand-purple-700 font-semibold hover:text-brand-purple-800 transition text-sm"
            >
              See every project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className="text-stone-500">
              No published projects yet. The team is preparing the next
              announcement.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const badge = statusBadge[property.status];
                const bhkTypes = parseJsonField<string[]>(property.bhkTypes, []);
                const highlights = parseJsonField<string[]>(
                  property.highlights,
                  []
                ).slice(0, 3);

                return (
                  <Link
                    key={property.id}
                    href={`/projects/${property.slug}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-brand-purple-300 hover:shadow-[0_12px_40px_-20px_rgba(90,45,133,0.45)] transition-all"
                  >
                    {/*
                      The image keeps its natural aspect ratio per the
                      no-crop rule. We use a soft warm placeholder so a card
                      with no image still looks intentional rather than broken.
                    */}
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
                        className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.chip}`}
                      >
                        {badge.label}
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

                      {bhkTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
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

                      {highlights.length > 0 && (
                        <ul className="text-sm text-stone-600 space-y-1.5 mb-4">
                          {highlights.map((h) => (
                            <li key={h} className="flex gap-2">
                              <span className="text-brand-purple-500 mt-1.5 w-1 h-1 rounded-full bg-brand-purple-500 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-stone-100">
                        <div>
                          {property.priceStartingFrom ? (
                            <>
                              <p className="text-xs text-stone-400">Starting at</p>
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

                      {property.reraNumber && (
                        <p className="text-[11px] text-stone-400 mt-3">
                          TNRERA: {property.reraNumber}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-brand-purple-700 font-semibold text-sm"
            >
              See every project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/*
        "How we're different" — three concrete promises rather than the
        generic six-tile "Why Choose Us" grid that every developer site has.
        Copy is written so a buyer reads exactly what they get, not adjectives.
      */}
      <section className="py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-brand-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
              Why Us?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
              Crafting Spaces with Care and Precision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <ShieldCheck className="w-8 h-8 text-brand-purple-600 mb-4" />
              <h3 className="font-bold text-stone-900 text-lg mb-2">
                A Legacy of Trust, A Decade of Expertise
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                For over a decade, Shivashree Developers has been a trusted name in
                real estate, delivering exceptional service with integrity. We offer
                tailored solutions, ensuring a seamless experience for first-time
                buyers and seasoned investors alike.
              </p>
            </div>

            <div>
              <Hammer className="w-8 h-8 text-brand-purple-600 mb-4" />
              <h3 className="font-bold text-stone-900 text-lg mb-2">
                Building Trust, Delivering Excellence
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Trust and excellence define everything we do. We take pride in
                delivering high-quality homes that embody comfort, value, and
                reliability. Whether buying or investing, count on us to make your
                real estate journey seamless and rewarding.
              </p>
            </div>

            <div>
              <Phone className="w-8 h-8 text-brand-purple-600 mb-4" />
              <h3 className="font-bold text-stone-900 text-lg mb-2">
                Creating Spaces with Diligence and Precision
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Every space we build is planned carefully and designed thoughtfully
                to meet high standards. From the foundation to the finishing
                touches, we focus on creating homes that are comfortable,
                long-lasting, and full of value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*
        Direct CTA. The form is the focus, not "lifestyle" filler imagery.
        We deliberately keep this short — three sentences and a form.
      */}
      <section className="py-20 bg-brand-purple-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
                Enquire Now
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                At the heart of our work is a commitment to customer satisfaction.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Your dream home isn&rsquo;t just built — it&rsquo;s brought to life.
                Tell us your name and number and we&rsquo;ll call you back to find
                the right home for you.
              </p>
              {settings?.corporateOfficePhone && (
                <p className="text-white/60 text-sm">
                  Prefer to call? Dial{" "}
                  <a
                    href={`tel:${settings.corporateOfficePhone}`}
                    className="text-white font-semibold underline underline-offset-4 hover:text-brand-blue-200"
                  >
                    {settings.corporateOfficePhone}
                  </a>{" "}
                  — Monday to Saturday, 9am–6pm.
                </p>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  Request a callback
                </h3>
                <p className="text-stone-500 text-sm mb-5">
                  No spam. No mailing list. Just a phone call.
                </p>
                <EnquiryForm source="homepage-cta" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

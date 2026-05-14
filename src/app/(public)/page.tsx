import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/public/HeroSection";
import EnquiryForm from "@/components/public/EnquiryForm";
import StructuredData, { organizationSchema, faqSchema } from "@/components/StructuredData";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Hammer,
  Phone,
} from "lucide-react";
import { formatPrice, parseJsonField } from "@/lib/utils";
import type { Metadata } from "next";
import { homePageDefaults as D } from "@/lib/site-defaults";
import { normalizeHeroCtaUrl } from "@/lib/hero-cta-url";
import { buildPublicSiteCopy } from "@/lib/site-copy";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const c = buildPublicSiteCopy(s);
  return {
    title: c.homeMetaTitle,
    description: c.homeMetaDescription,
  };
}

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

  const copy = buildPublicSiteCopy(settings);

  const statusBadge = {
    PROPOSED: {
      label: copy.statusLabelProposed,
      chip: "bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100",
    },
    ONGOING: {
      label: copy.statusLabelOngoing,
      chip: "bg-brand-purple-50 text-brand-purple-700 border-brand-purple-100",
    },
    COMPLETED: {
      label: copy.statusLabelCompleted,
      chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    SOLD_OUT: {
      label: copy.statusLabelSoldOut,
      chip: "bg-stone-100 text-stone-600 border-stone-200",
    },
  } as const;

  // The hero accepts a list of slides from the CMS. If the team hasn't added
  // any yet, we fall back to the first two published properties' hero images
  // so we never render a flat-coloured hero.
  const propertiesWithImages = properties.filter((p) => p.heroImage);
  const heroData =
    heroSlides.length > 0
      ? heroSlides.map((s) => ({
          ...s,
          ctaUrl: normalizeHeroCtaUrl(s.ctaUrl),
        }))
      : propertiesWithImages.length > 0
        ? propertiesWithImages.slice(0, 2).map((p, i) => ({
            id: -(i + 1),
            imageUrl: p.heroImage!,
            overlayHeading:
              i === 0 ? copy.homeHeroFallback1Heading : copy.homeHeroFallback2Heading,
            subheading: i === 0 ? copy.homeHeroFallback1Sub : copy.homeHeroFallback2Sub,
            ctaLabel: i === 0 ? copy.homeHeroFallback1CtaLabel : copy.homeHeroFallback2CtaLabel,
            ctaUrl: normalizeHeroCtaUrl(
              i === 0 ? copy.homeHeroFallback1CtaUrl : copy.homeHeroFallback2CtaUrl
            ),
          }))
        : [];

  return (
    <>
      <StructuredData
        data={organizationSchema(settings ?? undefined, {
          name: copy.structuredOrgName,
          description: copy.structuredOrgDescription,
        })}
      />
      <StructuredData data={faqSchema(copy.homeFaqItems)} />

      {/* Hero with property image background, sourced from CMS */}
      <HeroSection
        slides={heroData}
        slideEyebrowFallback={copy.homeHeroSlideEyebrowFallback}
        emptyHeroCopy={{
          eyebrow: copy.homeHeroEmptyEyebrow,
          heading: copy.homeHeroEmptyHeading,
          ctaLabel: copy.homeHeroEmptyCtaLabel,
          ctaUrl: normalizeHeroCtaUrl(copy.homeHeroEmptyCtaUrl),
        }}
      />

      {/* Three project tiles laid out by status — the homepage is mostly here
          to send visitors straight to a relevant project, so we don't bury
          the inventory under generic marketing. */}
      <section className="py-20 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div className="max-w-xl">
              <p className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest mb-2">
                {settings?.homeProjectsEyebrow || D.projectsEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                {settings?.homeProjectsHeading || D.projectsHeading}
              </h2>
              <p className="text-stone-600 mt-3 text-base leading-relaxed">
                {settings?.homeProjectsSubheading || D.projectsSubheading}
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 text-brand-purple-700 font-semibold hover:text-brand-purple-800 transition text-sm"
            >
              {copy.homeProjectsSeeAllLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className="text-stone-500">{copy.homeProjectsEmptyMessage}</p>
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
                        <Image
                          src={property.heroImage}
                          alt={property.heroImageAlt ?? property.title}
                          width={600}
                          height={400}
                          className="w-full h-auto object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <p className="text-brand-purple-400 text-sm py-12">{copy.homeCardNoImageText}</p>
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
                              <p className="text-xs text-stone-400">{copy.homeCardStartingAtLabel}</p>
                              <p className="font-bold text-stone-900">
                                {formatPrice(property.priceStartingFrom)}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-stone-500 leading-tight">
                              {copy.homeCardPricingOnRequest}
                            </p>
                          )}
                        </div>
                        <span className="text-brand-purple-700 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          {copy.homeCardProjectPageLabel}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>

                      {property.reraNumber && (
                        <p className="text-[11px] text-stone-400 mt-3">
                          {copy.homeCardTnreraPrefix} {property.reraNumber}
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
              {copy.homeProjectsSeeAllLabel}
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
              {settings?.homeWhyEyebrow || D.whyEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
              {settings?.homeWhyHeading || D.whyHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: settings?.homeCard1Title || D.card1Title,
                body: settings?.homeCard1Body || D.card1Body,
                image: settings?.homeCard1Image,
              },
              {
                icon: Hammer,
                title: settings?.homeCard2Title || D.card2Title,
                body: settings?.homeCard2Body || D.card2Body,
                image: settings?.homeCard2Image,
              },
              {
                icon: Phone,
                title: settings?.homeCard3Title || D.card3Title,
                body: settings?.homeCard3Body || D.card3Body,
                image: settings?.homeCard3Image,
              },
            ].map(({ icon: Icon, title, body, image }) => (
              <div key={title} className="flex flex-col rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-brand-purple-50 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-brand-purple-200" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <Icon className="w-7 h-7 text-brand-purple-600 mb-3 shrink-0" />
                  <h3 className="font-bold text-stone-900 text-lg mb-2">{title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
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
                {settings?.homeCtaEyebrow || D.ctaEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                {settings?.homeCtaHeading || D.ctaHeading}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {settings?.homeCtaBody || D.ctaBody}
              </p>
              {settings?.corporateOfficePhone && (
                <p className="text-white/60 text-sm">
                  {copy.homeCtaPreferCallPrefix}{" "}
                  <a
                    href={`tel:${settings.corporateOfficePhone}`}
                    className="text-white font-semibold underline underline-offset-4 hover:text-brand-blue-200"
                  >
                    {settings.corporateOfficePhone}
                  </a>{" "}
                  {copy.homeCtaPreferCallSuffix}
                </p>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
                <h3 className="text-lg font-bold text-stone-900 mb-1">{copy.homeCtaCallbackTitle}</h3>
                <p className="text-stone-500 text-sm mb-5">{copy.homeCtaCallbackSubtitle}</p>
                <EnquiryForm source="homepage-cta" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

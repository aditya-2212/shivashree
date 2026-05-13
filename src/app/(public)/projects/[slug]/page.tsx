import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { parseJsonField, formatPrice } from "@/lib/utils";
import EnquiryForm from "@/components/public/EnquiryForm";
import PropertyFAQAccordion from "@/components/public/PropertyFAQAccordion";
import AmenityIcon from "@/components/public/AmenityIcon";
import StructuredData, { propertySchema, faqSchema } from "@/components/StructuredData";
import {
  MapPin,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

const getProperty = (slug: string) =>
  unstable_cache(
    () =>
      prisma.property.findUnique({
        where: { slug, isPublished: true },
        include: {
          galleryImages: { orderBy: { sortOrder: "asc" } },
          floorPlans: { orderBy: { sortOrder: "asc" } },
          amenities: true,
          faqs: { orderBy: { sortOrder: "asc" } },
        },
      }),
    [`property-${slug}`],
    { revalidate: 3600, tags: [`property-${slug}`, "properties"] }
  )();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return {};

  const bhkTypes = parseJsonField<string[]>(property.bhkTypes, []);
  const defaultTitle = `${property.title} — ${bhkTypes.join(" & ")} ${property.status === "COMPLETED" ? "Apartments" : "Flats"} in ${property.city}`;

  return {
    title: property.seoTitle ?? defaultTitle,
    description:
      property.seoDescription ??
      `${property.title} by Shivashree Developers — ${bhkTypes.join(", ")} in ${property.locality}, ${property.city}. ${property.reraNumber ? `RERA: ${property.reraNumber}` : ""} ${formatPrice(property.priceStartingFrom)}.`,
    openGraph: {
      images: property.heroImage ? [property.heroImage] : [],
    },
  };
}

const statusConfig = {
  PROPOSED: {
    label: "Coming Soon",
    chip: "bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100",
    accentText: "text-brand-blue-700",
    accentBg: "bg-brand-blue-50",
    accentBorder: "border-brand-blue-100",
  },
  ONGOING: {
    label: "Now Selling",
    chip: "bg-brand-purple-50 text-brand-purple-700 border-brand-purple-100",
    accentText: "text-brand-purple-700",
    accentBg: "bg-brand-purple-50",
    accentBorder: "border-brand-purple-100",
  },
  COMPLETED: {
    label: "Ready to Move",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
  },
} as const;

const specLabels: Record<string, string> = {
  building: "Building & structure",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  flooring: "Flooring",
  doors: "Doors",
  windows: "Windows",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const property = await getProperty(slug);

  if (!property) notFound();

  const bhkTypes = parseJsonField<string[]>(property.bhkTypes, []);
  const highlights = parseJsonField<string[]>(property.highlights, []);
  const keySpecs = parseJsonField<Record<string, string>>(
    property.keySpecifications,
    {}
  );
  const locationAdvantages = parseJsonField<string[]>(
    property.locationAdvantages,
    []
  );

  const status = statusConfig[property.status];
  const h1 = `${property.title} — ${bhkTypes.join(" & ")} ${
    property.status === "COMPLETED" ? "Apartments" : "Flats"
  } in ${property.city}`;

  return (
    <>
      <StructuredData
        data={propertySchema({
          title: property.title,
          slug: property.slug,
          fullAddress: property.fullAddress,
          city: property.city,
          priceStartingFrom: property.priceStartingFrom,
          heroImage: property.heroImage,
          status: property.status,
          reraNumber: property.reraNumber,
          bhkTypes,
        })}
      />
      {property.faqs.length > 0 && (
        <StructuredData
          data={faqSchema(
            property.faqs.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />
      )}

      {/* Breadcrumb */}
      <nav className="pt-24 pb-2 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-stone-500">
            <li>
              <Link href="/" className="hover:text-stone-800 transition">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-stone-300" />
            <li>
              <Link href="/projects" className="hover:text-stone-800 transition">
                Projects
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-stone-300" />
            <li className="text-stone-800 font-medium truncate max-w-xs">
              {property.title}
            </li>
          </ol>
        </div>
      </nav>

      <section className="bg-white pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Status + title */}
              <div className="mb-6">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 border ${status.chip}`}
                >
                  {status.label}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-3 tracking-tight">
                  {h1}
                </h1>
                <div className="flex items-start gap-1.5 text-stone-600">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-brand-purple-600" />
                  <address className="not-italic text-sm leading-relaxed">
                    {property.fullAddress}
                  </address>
                </div>
              </div>

              {/* Key facts row */}
              <dl className="flex flex-wrap gap-x-8 gap-y-4 p-5 bg-stone-50 rounded-xl border border-stone-200 mb-8">
                {property.priceStartingFrom !== null && property.priceStartingFrom !== undefined && (
                  <div>
                    <dt className="text-xs text-stone-500 mb-0.5">Starting at</dt>
                    <dd className="font-bold text-stone-900 text-base">
                      {formatPrice(property.priceStartingFrom)}
                    </dd>
                  </div>
                )}
                {bhkTypes.length > 0 && (
                  <div>
                    <dt className="text-xs text-stone-500 mb-0.5">Configurations</dt>
                    <dd className="font-bold text-stone-900 text-base">
                      {bhkTypes.join(" · ")}
                    </dd>
                  </div>
                )}
                {property.reraNumber && (
                  <div>
                    <dt className="text-xs text-stone-500 mb-0.5">TNRERA No.</dt>
                    <dd className="font-bold text-stone-900 text-sm">
                      {property.reraNumber}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-stone-500 mb-0.5">Location</dt>
                  <dd className="font-bold text-stone-900 text-base">
                    {property.locality}, {property.city}
                  </dd>
                </div>
              </dl>

              {/*
                Hero image — natural aspect ratio. We do NOT crop. The
                container grows to whatever the image needs. This is per the
                explicit no-crop rule.
              */}
              {property.heroImage && (
                <div className="mb-8 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={property.heroImage}
                    alt={property.heroImageAlt ?? h1}
                    className="w-full h-auto block"
                  />
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">
                    Project highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-start gap-2.5 px-4 py-3 bg-brand-purple-50/50 rounded-xl border border-brand-purple-100/60"
                      >
                        <CheckCircle className="w-4 h-4 text-brand-purple-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-stone-800">
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/*
                Gallery — column layout instead of a forced square grid so
                portrait elevation shots and landscape interior shots both
                appear at their natural aspect ratio.
              */}
              {property.galleryImages.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.galleryImages.map((img) => (
                      <div
                        key={img.id}
                        className="rounded-xl overflow-hidden bg-stone-100 border border-stone-200"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.alt ?? property.title}
                          className="w-full h-auto block"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">
                    Amenities included
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {property.amenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex flex-col items-center gap-2 p-4 bg-white border border-stone-200 rounded-xl text-center"
                      >
                        <AmenityIcon name={amenity.icon} />
                        <span className="text-xs font-medium text-stone-700">
                          {amenity.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {Object.keys(keySpecs).length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">
                    Specifications
                  </h2>
                  <dl className="bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                    {Object.entries(keySpecs).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div
                          key={key}
                          className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 px-5 py-4"
                        >
                          <dt className="text-sm text-stone-500 font-medium">
                            {specLabels[key] ?? key}
                          </dt>
                          <dd className="text-sm text-stone-800">
                            {value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              )}

              {/* Floor plans — natural image height per no-crop rule */}
              {property.floorPlans.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">
                    Floor plans
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.floorPlans.map((plan) => (
                      <figure
                        key={plan.id}
                        className="bg-white border border-stone-200 rounded-xl overflow-hidden"
                      >
                        <div className="bg-stone-50 p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={plan.imageUrl}
                            alt={plan.label}
                            className="w-full h-auto block"
                            loading="lazy"
                          />
                        </div>
                        <figcaption className="text-center text-sm font-semibold text-stone-700 py-3 border-t border-stone-100">
                          {plan.label}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {/*
                LOCATION SECTION — combines text advantages and the embedded
                Google Map. Per spec the map is rendered as a real iframe
                (not a static screenshot or click-through), and the URL is
                stored per-property in the CMS.
              */}
              {(locationAdvantages.length > 0 || property.mapEmbedUrl) && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">
                    The neighbourhood
                  </h2>

                  {locationAdvantages.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                      {locationAdvantages.map((advantage) => (
                        <li
                          key={advantage}
                          className="flex items-start gap-3 px-4 py-3 bg-white border border-stone-200 rounded-xl"
                        >
                          <MapPin className="w-4 h-4 text-brand-purple-600 shrink-0 mt-0.5" />
                          <span className="text-sm text-stone-700">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {property.mapEmbedUrl && (
                    <div className="rounded-2xl overflow-hidden border border-stone-200">
                      <iframe
                        src={property.mapEmbedUrl}
                        title={`${property.title} on Google Maps`}
                        className="w-full h-[360px] md:h-[420px] block"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {/* FAQs */}
              {property.faqs.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">
                    Questions buyers ask about this project
                  </h2>
                  <PropertyFAQAccordion faqs={property.faqs} />
                </div>
              )}

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-purple-700 text-sm mb-12 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all projects
              </Link>
            </div>

            {/* Sticky enquiry sidebar */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-stone-900 text-lg mb-1.5">
                  Speak to the {property.title.split(" ").pop()} team
                </h3>
                <p className="text-stone-500 text-sm mb-5">
                  Leave your number and a project advisor will call you back
                  the same working day.
                </p>
                <EnquiryForm
                  source={`project-${property.slug}`}
                  projectId={property.id}
                  projectName={property.title}
                />
              </div>

              <div
                className={`p-4 border rounded-xl ${status.accentBorder} ${status.accentBg}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${status.accentText}`}>
                  Project status
                </p>
                <p className="font-bold text-stone-900">{status.label}</p>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {property.status === "COMPLETED"
                    ? "Units are ready for handover. Site visits available 7 days a week with prior appointment."
                    : property.status === "ONGOING"
                      ? "Construction in progress. Floor plans and pricing are finalised — bookings open."
                      : "Designs are being finalised. Register interest now to get pre-launch pricing."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

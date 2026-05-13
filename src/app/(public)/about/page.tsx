import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import EnquiryForm from "@/components/public/EnquiryForm";

export const dynamic = "force-dynamic";

const D = {
  metaTitle: "About — Shivashree Developers",
  metaDescription:
    "Shivashree Developers builds RERA-registered apartments in Kumbakonam and Chennai. We're a small team — a single builder, a single point of contact, no franchised offices.",
  heroEyebrow: "About Shivashree Developers",
  heroTitle: "A Kumbakonam builder.\nNow also in Chennai.",
  heroLead:
    "We started with a small G+3 in Kumbakonam. Years later we're still building apartments — just two cities now, the same family running it, and the same engineer signing off on every slab.",
  storyTitle: "Why we still build only here.",
  storyBodyHtml: `<p>Kumbakonam is home. We grew up walking the lanes off Bakthapuri Street and Dabeer Street, and our first project — a small, eight-unit building near the Adi Kumbeswarar temple — was sold to families our parents knew personally. That accountability still defines how we work.</p><p>We expanded to Chennai in the 2010s because too many of our Kumbakonam buyers were sending their adult children there for jobs and asking us to build the same way in the city. We took one site at a time, hired a Chennai-based site engineer who reports to the same office, and refused to franchise.</p><p>We don't bid on government tenders, we don't do joint ventures with land aggregators, and we don't pretend to be a national brand. The math is simple — build fewer projects, finish them on time, hand them over without a punch list of complaints.</p>`,
  commitmentsTitle: "What you can hold us to.",
  c1Title: "TNRERA registration before any sale.",
  c1Body:
    "We register with the Tamil Nadu Real Estate Regulatory Authority before we accept the first booking. The number is on the project page, the brochure, and the agreement — not a closely guarded secret.",
  c2Title: "Possession date in writing, with a penalty clause.",
  c2Body:
    "The committed handover date goes into the agreement. If we slip beyond the buffer, we pay you a per-month rental compensation. We've stuck to the date on every completed project so far.",
  c3Title: "One-year defect liability — handled by us, not contracted out.",
  c3Body:
    "If something needs fixing within twelve months of possession — leakage, wiring, fittings — our own site team comes back. You don't get bounced to a sub-contractor's call centre.",
  whereTitle: "Where to find us in person.",
  whereIntro:
    "We'd much rather you walked in than filled in a form. Both offices have a model floor plan you can see on the table.",
  ctaTitle: "Tell us what you're looking for.",
  ctaBody:
    "Whether you're a first-time buyer, an NRI investor, or a parent buying for an adult child — drop us a line and the advisor who handles your city will call you back.",
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return {
    title: s?.aboutHeroTitle
      ? `About — Shivashree Developers`
      : D.metaTitle,
    description: D.metaDescription,
  };
}

export default async function AboutPage() {
  const [settings, properties] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.property.findMany({
      where: { isPublished: true },
      select: { city: true, status: true },
    }),
  ]);

  const s = settings;
  const cities = Array.from(new Set(properties.map((p) => p.city)));
  const liveProjects = properties.filter((p) => p.status !== "COMPLETED").length;

  const commitments = [
    {
      n: "01",
      title: s?.aboutC1Title ?? D.c1Title,
      body: s?.aboutC1Body ?? D.c1Body,
    },
    {
      n: "02",
      title: s?.aboutC2Title ?? D.c2Title,
      body: s?.aboutC2Body ?? D.c2Body,
    },
    {
      n: "03",
      title: s?.aboutC3Title ?? D.c3Title,
      body: s?.aboutC3Body ?? D.c3Body,
    },
  ];

  const storyHtml = s?.aboutStoryBodyHtml ?? D.storyBodyHtml;

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-20 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-4">
            {s?.aboutHeroEyebrow ?? D.heroEyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl tracking-tight whitespace-pre-line">
            {s?.aboutHeroTitle ?? D.heroTitle}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed mt-6">
            {s?.aboutHeroLead ?? D.heroLead}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6 tracking-tight">
            {s?.aboutStoryTitle ?? D.storyTitle}
          </h2>
          <div
            className="space-y-5 text-stone-700 text-base leading-relaxed prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: storyHtml }}
          />

          <div className="mt-12 grid grid-cols-3 gap-4 border-y border-stone-200 py-8">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-brand-purple-700 leading-none">
                25
              </p>
              <p className="text-stone-500 text-sm mt-2">years of experience</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-brand-purple-700 leading-none">
                {cities.length || 2}
              </p>
              <p className="text-stone-500 text-sm mt-2">
                cities — Kumbakonam &amp; Chennai
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-brand-purple-700 leading-none">
                {liveProjects || 2}
              </p>
              <p className="text-stone-500 text-sm mt-2">projects on site or launching</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-10 tracking-tight">
            {s?.aboutCommitmentsTitle ?? D.commitmentsTitle}
          </h2>
          <ol className="space-y-8">
            {commitments.map((item) => (
              <li
                key={item.n}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 md:gap-8"
              >
                <div className="text-brand-purple-700 font-bold text-2xl md:text-3xl tabular-nums">
                  {item.n}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Where to find us */}
      {settings && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2 tracking-tight">
              {s?.aboutWhereTitle ?? D.whereTitle}
            </h2>
            <p className="text-stone-600 mb-10 max-w-2xl">
              {s?.aboutWhereIntro ?? D.whereIntro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-stone-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple-700 uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
                  Corporate office — Chennai
                </div>
                <p className="text-stone-800 leading-relaxed text-sm mb-4">
                  {settings.corporateOfficeAddress}
                </p>
                <div className="text-sm text-stone-600">
                  {settings.corporateOfficePhone}
                  <br />
                  {settings.corporateOfficeEmail}
                </div>
              </div>

              <div className="border border-stone-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue-700 uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-blue-500" />
                  Registered office — Kumbakonam
                </div>
                <p className="text-stone-800 leading-relaxed text-sm mb-4">
                  {settings.registeredOfficeAddress}
                </p>
                <div className="text-sm text-stone-600">{settings.registeredOfficeTel}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-brand-purple-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {s?.aboutCtaTitle ?? D.ctaTitle}
              </h2>
              <p className="text-white/80 leading-relaxed mb-8">
                {s?.aboutCtaBody ?? D.ctaBody}
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-white font-semibold hover:text-brand-blue-200 transition"
              >
                <MapPin className="w-4 h-4" />
                Or browse our current projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
              <EnquiryForm source="about-page" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

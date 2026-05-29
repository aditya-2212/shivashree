import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import EnquiryForm from "@/components/public/EnquiryForm";
import { aboutPageDefaults as AD } from "@/lib/site-defaults";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return {
    title: s?.aboutMetaTitle?.trim() || AD.metaTitle,
    description: s?.aboutMetaDescription?.trim() || AD.metaDescription,
  };
}

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const s = settings;

  // Numbered "Our Process" steps — CMS-driven with built-in defaults.
  const PROCESS_STEPS = [
    { n: "01", title: s?.aboutProcess1Title?.trim() || AD.process1Title, body: s?.aboutProcess1Body?.trim() || AD.process1Body },
    { n: "02", title: s?.aboutProcess2Title?.trim() || AD.process2Title, body: s?.aboutProcess2Body?.trim() || AD.process2Body },
    { n: "03", title: s?.aboutProcess3Title?.trim() || AD.process3Title, body: s?.aboutProcess3Body?.trim() || AD.process3Body },
    { n: "04", title: s?.aboutProcess4Title?.trim() || AD.process4Title, body: s?.aboutProcess4Body?.trim() || AD.process4Body },
  ];

  const QUALITY_POINTS = [
    { title: s?.aboutQuality1Title?.trim() || AD.quality1Title, body: s?.aboutQuality1Body?.trim() || AD.quality1Body },
    { title: s?.aboutQuality2Title?.trim() || AD.quality2Title, body: s?.aboutQuality2Body?.trim() || AD.quality2Body },
    { title: s?.aboutQuality3Title?.trim() || AD.quality3Title, body: s?.aboutQuality3Body?.trim() || AD.quality3Body },
    { title: s?.aboutQuality4Title?.trim() || AD.quality4Title, body: s?.aboutQuality4Body?.trim() || AD.quality4Body },
    { title: s?.aboutQuality5Title?.trim() || AD.quality5Title, body: s?.aboutQuality5Body?.trim() || AD.quality5Body },
  ];

  const PROMISES = [
    { label: s?.aboutPromise1Label?.trim() || AD.promise1Label, desc: s?.aboutPromise1Desc?.trim() || AD.promise1Desc },
    { label: s?.aboutPromise2Label?.trim() || AD.promise2Label, desc: s?.aboutPromise2Desc?.trim() || AD.promise2Desc },
    { label: s?.aboutPromise3Label?.trim() || AD.promise3Label, desc: s?.aboutPromise3Desc?.trim() || AD.promise3Desc },
    { label: s?.aboutPromise4Label?.trim() || AD.promise4Label, desc: s?.aboutPromise4Desc?.trim() || AD.promise4Desc },
  ];

  const showStory = Boolean(s?.aboutStoryTitle?.trim() || s?.aboutStoryBodyHtml?.trim());
  const showCommitments = Boolean(
    s?.aboutCommitmentsTitle?.trim() ||
      s?.aboutC1Title?.trim() ||
      s?.aboutC2Title?.trim() ||
      s?.aboutC3Title?.trim()
  );

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-4">
            {s?.aboutHeroEyebrow?.trim() || AD.heroEyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl tracking-tight mb-6 whitespace-pre-line">
            {s?.aboutHeroTitle?.trim() || AD.heroTitle}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            {s?.aboutHeroLead?.trim() || AD.heroLead}
          </p>
        </div>
      </section>

      {showStory && (
        <section className="py-16 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {s?.aboutStoryTitle?.trim() && (
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6 tracking-tight">
                {s.aboutStoryTitle}
              </h2>
            )}
            {s?.aboutStoryBodyHtml?.trim() && (
              <div
                className="prose prose-stone max-w-3xl"
                dangerouslySetInnerHTML={{ __html: s.aboutStoryBodyHtml }}
              />
            )}
          </div>
        </section>
      )}

      {showCommitments && (
        <section className="py-16 bg-stone-50 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-10 tracking-tight">
              {s?.aboutCommitmentsTitle?.trim() || AD.commitmentsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(
                [
                  { t: s?.aboutC1Title, b: s?.aboutC1Body, n: "01", dt: AD.c1Title, db: AD.c1Body },
                  { t: s?.aboutC2Title, b: s?.aboutC2Body, n: "02", dt: AD.c2Title, db: AD.c2Body },
                  { t: s?.aboutC3Title, b: s?.aboutC3Body, n: "03", dt: AD.c3Title, db: AD.c3Body },
                ] as const
              ).map((row) => (
                <div key={row.n} className="rounded-2xl border border-stone-200 bg-white p-6">
                  <p className="text-brand-purple-700 font-bold text-sm mb-2">{row.n}</p>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">
                    {row.t?.trim() || row.dt}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {row.b?.trim() || row.db}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Vision & Mission ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-brand-purple-50 rounded-2xl p-8 border border-brand-purple-100">
              <p className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">
                {s?.aboutVisionLabel?.trim() || AD.visionLabel}
              </p>
              <p className="text-stone-800 text-lg leading-relaxed">
                {s?.aboutVisionBody?.trim() || AD.visionBody}
              </p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
              <p className="text-brand-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
                {s?.aboutMissionLabel?.trim() || AD.missionLabel}
              </p>
              <p className="text-stone-800 text-lg leading-relaxed">
                {s?.aboutMissionBody?.trim() || AD.missionBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Process ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">
            {s?.aboutProcessEyebrow?.trim() || AD.processEyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-12 tracking-tight max-w-2xl">
            {s?.aboutProcessHeading?.trim() || AD.processHeading}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Steps */}
            <ol className="space-y-8">
              {PROCESS_STEPS.map((step) => (
                <li key={step.n} className="flex gap-6">
                  <div className="text-brand-purple-700 font-bold text-2xl tabular-nums shrink-0 w-10">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg mb-1">{step.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Image placeholder */}
            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-brand-purple-50 flex items-center justify-center min-h-[420px]">
              {s?.homeCard1Image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.homeCard1Image}
                  alt="Our process"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center px-8 py-12">
                  <div className="w-16 h-16 rounded-full bg-brand-purple-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-brand-purple-400 text-2xl">📷</span>
                  </div>
                  <p className="text-brand-purple-400 font-medium text-sm">
                    Upload an image via CMS
                  </p>
                  <p className="text-stone-400 text-xs mt-1">
                    Site Settings → Homepage → Card 1 Image
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quality Guarantee ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">
            {s?.aboutQualityEyebrow?.trim() || AD.qualityEyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight max-w-2xl">
            {s?.aboutQualityHeading?.trim() || AD.qualityHeading}
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mb-12 leading-relaxed">
            {s?.aboutQualityIntro?.trim() || AD.qualityIntro}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* What sets us apart */}
            <div>
              <h3 className="font-bold text-stone-900 text-xl mb-6">
                {s?.aboutQualitySubheading?.trim() || AD.qualitySubheading}
              </h3>
              <ol className="space-y-6">
                {QUALITY_POINTS.map((point, i) => (
                  <li key={point.title} className="flex gap-4">
                    <div className="text-brand-purple-700 font-bold text-lg tabular-nums shrink-0 w-6">
                      {i + 1}.
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1">{point.title}</h4>
                      <p className="text-stone-600 text-sm leading-relaxed">{point.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Our Promise */}
            <div className="bg-brand-purple-900 rounded-2xl p-8 text-white">
              <h3 className="font-bold text-xl mb-6">
                {s?.aboutPromiseTitle?.trim() || AD.promiseTitle}
              </h3>
              <ul className="space-y-5">
                {PROMISES.map((p) => (
                  <li key={p.label} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-blue-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">{p.label}:</span>{" "}
                      <span className="text-white/80 text-sm">{p.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-white/60 text-sm mt-8 leading-relaxed border-t border-white/10 pt-6">
                {s?.aboutPromiseNote?.trim() || AD.promiseNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Where to find us ──────────────────────────────────────────────────── */}
      {settings && (settings.corporateOfficeAddress || settings.registeredOfficeAddress) && (
        <section className="py-20 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2 tracking-tight">
              {s?.aboutWhereTitle?.trim() || AD.whereTitle}
            </h2>
            <p className="text-stone-600 mb-10 max-w-2xl">
              {s?.aboutWhereIntro?.trim() || AD.whereIntro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.corporateOfficeAddress && (
                <div className="border border-stone-200 rounded-2xl p-6 bg-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple-700 uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
                    Corporate office — Chennai
                  </div>
                  <p className="text-stone-800 leading-relaxed text-sm mb-3">
                    {settings.corporateOfficeAddress}
                  </p>
                  <div className="text-sm text-stone-600 space-y-1">
                    {settings.corporateOfficePhone && <p>{settings.corporateOfficePhone}</p>}
                    {settings.corporateOfficeEmail && <p>{settings.corporateOfficeEmail}</p>}
                  </div>
                </div>
              )}
              {settings.registeredOfficeAddress && (
                <div className="border border-stone-200 rounded-2xl p-6 bg-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue-700 uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-brand-blue-500" />
                    Registered office — Kumbakonam
                  </div>
                  <p className="text-stone-800 leading-relaxed text-sm mb-3">
                    {settings.registeredOfficeAddress}
                  </p>
                  {settings.registeredOfficeTel && (
                    <p className="text-sm text-stone-600">{settings.registeredOfficeTel}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-purple-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {s?.aboutCtaTitle?.trim() || AD.ctaTitle}
              </h2>
              <p className="text-white/80 leading-relaxed mb-8">
                {s?.aboutCtaBody?.trim() || AD.ctaBody}
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-white font-semibold hover:text-brand-blue-200 transition"
              >
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

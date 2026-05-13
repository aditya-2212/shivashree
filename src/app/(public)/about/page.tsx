import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import EnquiryForm from "@/components/public/EnquiryForm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Shivashree Developers | Trusted Builders in Kumbakonam & Chennai",
  description:
    "Learn about Shivashree Developers, a trusted real estate company in Kumbakonam delivering premium 2 & 3 BHK apartments with quality construction, transparency, and customer satisfaction.",
};

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Explore Options",
    body: "We help you choose from a range of thoughtfully designed apartments in prime locations. Whether it's the size, layout, or amenities, we guide you in finding the perfect fit for your needs.",
  },
  {
    n: "02",
    title: "Visit and Visualize",
    body: "Take a personalized tour of our projects to experience the quality, design, and lifestyle firsthand. See your future home come to life and make an informed decision.",
  },
  {
    n: "03",
    title: "Book and Secure",
    body: "Once you've chosen your dream apartment, we ensure a smooth booking process with transparent documentation and flexible payment plans to suit your budget.",
  },
  {
    n: "04",
    title: "Handover and Support",
    body: "After construction is complete, we hand over your apartment, fully inspected and ready for you to move in. Our team remains available for any post-handover assistance you may need.",
  },
];

const QUALITY_POINTS = [
  {
    title: "Premium Materials",
    body: "We use only the finest materials, sourced from trusted suppliers, to ensure every apartment is built to the highest standards.",
  },
  {
    title: "Expert Craftsmanship",
    body: "Our team of experienced architects, engineers, and construction professionals ensures precision and excellence at every stage of development.",
  },
  {
    title: "Attention to Detail",
    body: "From structural integrity to interior finishes, we leave no detail overlooked, ensuring a perfect blend of aesthetics and functionality.",
  },
  {
    title: "Sustainable Practices",
    body: "We incorporate eco-friendly building techniques and materials to create spaces that are environmentally conscious and energy-efficient.",
  },
  {
    title: "Rigorous Quality Checks",
    body: "Every project undergoes multiple levels of inspection and quality control to meet both industry standards and our own stringent benchmarks.",
  },
];

const PROMISES = [
  { label: "Durability", desc: "Apartments designed to stand the test of time." },
  { label: "Comfort", desc: "Thoughtful layouts and modern amenities for a superior living experience." },
  { label: "Transparency", desc: "Clear communication and complete documentation at every step." },
  { label: "Customer Satisfaction", desc: "Your happiness is our top priority, even after the handover." },
];

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const s = settings;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-4">
            About Shivashree Developers
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl tracking-tight mb-6">
            About Shivashree Developers
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            At Shivashree Developers, we believe in building more than just properties — we build
            dreams, trust, and lasting relationships. With a legacy of excellence and a commitment
            to innovation, we have established ourselves as a trusted name in the real estate
            industry.
          </p>
        </div>
      </section>

      {/* ── Vision & Mission ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-brand-purple-50 rounded-2xl p-8 border border-brand-purple-100">
              <p className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">
                Our Vision
              </p>
              <p className="text-stone-800 text-lg leading-relaxed">
                To redefine urban living by creating sustainable, innovative, and luxurious spaces
                that inspire and enrich lives.
              </p>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
              <p className="text-brand-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <p className="text-stone-800 text-lg leading-relaxed">
                At Shivashree Developers, our mission is to deliver exceptional quality, value, and
                transparency in every project we undertake. We are dedicated to creating
                environments where families and businesses thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Process ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Our Process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-12 tracking-tight max-w-2xl">
            At Shivashree Developers, we understand that purchasing an apartment is more than just
            a transaction — it&rsquo;s a life-changing decision.
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
            Our Quality Guarantee
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight max-w-2xl">
            Quality isn&rsquo;t just a commitment — it&rsquo;s the foundation of everything we do.
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mb-12 leading-relaxed">
            We take pride in delivering apartments that exceed expectations, combining world-class
            craftsmanship with thoughtful design and lasting durability.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* What sets us apart */}
            <div>
              <h3 className="font-bold text-stone-900 text-xl mb-6">
                What Sets Our Quality Apart?
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
              <h3 className="font-bold text-xl mb-6">Our Promise to You</h3>
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
                At Shivashree Developers, we don&rsquo;t just build apartments; we build trust and
                long-lasting relationships with our customers.
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
              Where to find us in person.
            </h2>
            <p className="text-stone-600 mb-10 max-w-2xl">
              We&rsquo;d much rather you walked in than filled in a form. Both offices have a model
              floor plan you can see on the table.
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
                Create your dream home.
              </h2>
              <p className="text-white/80 leading-relaxed mb-8">
                Tell us what you&rsquo;re looking for — whether you&rsquo;re a first-time buyer, an
                NRI investor, or a parent buying for an adult child. The advisor who handles your
                city will call you back.
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

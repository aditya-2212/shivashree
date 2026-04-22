import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import EnquiryForm from "@/components/public/EnquiryForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Shivashree Developers",
  description:
    "Reach Shivashree Developers in Chennai (West Mambalam) or Kumbakonam (Bakthapuri Street). Phone, email, office hours and an enquiry form on one page.",
};

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <section className="pt-36 pb-14 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Two offices, one team, real phones.
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Walk in, call, or fill in the form. Whichever way you reach us,
            the same person handles the conversation from start to finish.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-5">
              {/* Corporate Office */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple-700 uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
                  Corporate office — Chennai
                </div>
                <address className="not-italic space-y-3 text-sm">
                  {settings?.corporateOfficeAddress && (
                    <div className="flex gap-2.5">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <span className="text-stone-700 leading-relaxed">
                        {settings.corporateOfficeAddress}
                      </span>
                    </div>
                  )}
                  {settings?.corporateOfficePhone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <a
                        href={`tel:${settings.corporateOfficePhone}`}
                        className="text-brand-purple-700 hover:underline font-medium"
                      >
                        {settings.corporateOfficePhone}
                      </a>
                    </div>
                  )}
                  {settings?.corporateOfficeEmail && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-stone-400" />
                      <a
                        href={`mailto:${settings.corporateOfficeEmail}`}
                        className="text-brand-purple-700 hover:underline"
                      >
                        {settings.corporateOfficeEmail}
                      </a>
                    </div>
                  )}
                </address>

                {settings?.corporateMapEmbedUrl && (
                  <div className="rounded-xl overflow-hidden border border-stone-200 mt-4">
                    <iframe
                      src={settings.corporateMapEmbedUrl}
                      title="Shivashree Developers — Chennai office on Google Maps"
                      className="w-full h-44 block"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* Registered Office */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue-700 uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-blue-500" />
                  Registered office — Kumbakonam
                </div>
                <address className="not-italic space-y-3 text-sm">
                  {settings?.registeredOfficeAddress && (
                    <div className="flex gap-2.5">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <span className="text-stone-700 leading-relaxed">
                        {settings.registeredOfficeAddress}
                      </span>
                    </div>
                  )}
                  {settings?.registeredOfficeTel && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <a
                        href={`tel:${settings.registeredOfficeTel}`}
                        className="text-brand-blue-700 hover:underline font-medium"
                      >
                        {settings.registeredOfficeTel}
                      </a>
                    </div>
                  )}
                </address>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  When we&rsquo;re in office
                </div>
                <div className="space-y-2 text-sm text-stone-700">
                  <div className="flex justify-between">
                    <span>Monday – Saturday</span>
                    <span className="font-medium">9:00am – 6:00pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">10:00am – 2:00pm</span>
                  </div>
                  <p className="text-xs text-stone-500 pt-2 leading-relaxed">
                    Site visits on Sunday are by prior appointment only — call
                    ahead so a project advisor is at the site to walk you
                    through.
                  </p>
                </div>
              </div>
            </div>

            {/* Enquiry form */}
            <div className="lg:col-span-2">
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-2 tracking-tight">
                  Send us an enquiry
                </h2>
                <p className="text-stone-600 text-sm mb-6 max-w-lg">
                  Two fields are required — your name and your number. The
                  rest help us route the call to the right project advisor.
                </p>
                <EnquiryForm source="contact-page" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

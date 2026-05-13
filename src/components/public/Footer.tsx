import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

interface FooterProps {
  settings: {
    corporateOfficeAddress: string;
    corporateOfficeEmail: string;
    corporateOfficePhone: string;
    registeredOfficeAddress: string;
    registeredOfficeTel: string;
    facebookUrl: string | null;
    instagramUrl: string | null;
    youtubeUrl: string | null;
    corporateMapEmbedUrl: string | null;
    footerText: string;
  } | null;
}

/*
  Footer is intentionally information-dense rather than decorative. Buyers do
  reach the bottom of the page when they want to call us, find our office, or
  verify which RERA we're registered under. Each block is laid out so a person
  on a mobile screen can scan it without zooming.
*/
export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-brand-purple-900 text-stone-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center justify-center bg-white rounded-xl p-3 mb-5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Shivashree Developers"
                width={160}
                height={120}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mb-5">
              A Kumbakonam-rooted developer building RERA-registered residential
              apartments in Kumbakonam and Chennai.
            </p>
            <div className="flex gap-3">
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition text-white text-xs font-bold"
                >
                  f
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition text-white text-xs font-bold"
                >
                  in
                </a>
              )}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition text-white text-xs font-bold"
                >
                  yt
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Sitemap
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
                { href: "/resources/blog", label: "Notes & guides" },
                { href: "/resources/faqs", label: "FAQs" },
                { href: "/contact", label: "Contact Us" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-300 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Office + map */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Corporate Office — Chennai
            </h3>
            <address className="not-italic space-y-3 text-sm mb-4">
              {settings?.corporateOfficeAddress && (
                <div className="flex gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-blue-300 shrink-0 mt-0.5" />
                  <span className="text-stone-300 leading-relaxed">
                    {settings.corporateOfficeAddress}
                  </span>
                </div>
              )}
              {settings?.corporateOfficePhone && (
                <div className="flex gap-2.5">
                  <Phone className="w-4 h-4 text-brand-blue-300 shrink-0 mt-0.5" />
                  <a
                    href={`tel:${settings.corporateOfficePhone}`}
                    className="text-stone-300 hover:text-white transition"
                  >
                    {settings.corporateOfficePhone}
                  </a>
                </div>
              )}
              {settings?.corporateOfficeEmail && (
                <div className="flex gap-2.5">
                  <Mail className="w-4 h-4 text-brand-blue-300 shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${settings.corporateOfficeEmail}`}
                    className="text-stone-300 hover:text-white transition"
                  >
                    {settings.corporateOfficeEmail}
                  </a>
                </div>
              )}
            </address>

            {/*
              Embedded Google Map. The src is editable via Site Settings in the
              admin so the team can paste a fresh "Share → Embed" URL without
              touching code. We render it inline (not behind a click) per
              design brief.
            */}
            {settings?.corporateMapEmbedUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src={settings.corporateMapEmbedUrl}
                  title="Shivashree Developers — corporate office on Google Maps"
                  className="w-full h-44 block"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Registered Office + RERA note */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Registered Office — Kumbakonam
            </h3>
            <address className="not-italic space-y-3 text-sm">
              {settings?.registeredOfficeAddress && (
                <div className="flex gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-blue-300 shrink-0 mt-0.5" />
                  <span className="text-stone-300 leading-relaxed">
                    {settings.registeredOfficeAddress}
                  </span>
                </div>
              )}
              {settings?.registeredOfficeTel && (
                <div className="flex gap-2.5">
                  <Phone className="w-4 h-4 text-brand-blue-300 shrink-0 mt-0.5" />
                  <a
                    href={`tel:${settings.registeredOfficeTel}`}
                    className="text-stone-300 hover:text-white transition"
                  >
                    {settings.registeredOfficeTel}
                  </a>
                </div>
              )}
            </address>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs text-brand-blue-200 font-semibold mb-1">
                TNRERA Registered
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                Each Shivashree project carries its own TNRERA number — printed
                on the project page and on every brochure we hand you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-400 text-xs">
            © {new Date().getFullYear()} Shivashree Developers.{" "}
            {settings?.footerText ?? "All rights reserved."}
          </p>
          <p className="text-stone-500 text-xs">
            Kumbakonam · Chennai
          </p>
        </div>
      </div>
    </footer>
  );
}

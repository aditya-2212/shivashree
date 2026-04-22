"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProperty {
  title: string;
  slug: string;
  status: "PROPOSED" | "ONGOING" | "COMPLETED";
}

interface Props {
  properties: NavProperty[];
  whatsappNumber?: string;
}

// We sort projects so the customer always sees buyable inventory first.
// "Coming Soon" projects deserve attention because that is where pre-launch
// pricing and unit reservations matter most.
const statusOrder: Record<string, number> = {
  ONGOING: 0,
  PROPOSED: 1,
  COMPLETED: 2,
};

const statusLabel: Record<string, string> = {
  PROPOSED: "Coming Soon",
  ONGOING: "Now Selling",
  COMPLETED: "Ready to Move",
};

const statusDot: Record<string, string> = {
  ONGOING: "bg-brand-purple-600",
  PROPOSED: "bg-brand-blue-500",
  COMPLETED: "bg-emerald-500",
};

export default function Navbar({ properties, whatsappNumber }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Only the homepage has a full-bleed hero image sitting behind the navbar.
  // Every other route renders content directly under the bar, so the bar
  // needs an opaque, brand-coloured background from the start (otherwise
  // white-on-white text disappears).
  const isHome = pathname === "/";
  // "Transparent" mode = the bar floats over a hero image and uses white text.
  // We collapse to the solid "scrolled" look on every non-home page, AND on
  // the home page once the user scrolls past the hero.
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (projectsRef.current && !projectsRef.current.contains(e.target as Node)) {
        setProjectsOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sorted = [...properties].sort(
    (a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3)
  );

  const grouped = sorted.reduce((acc, p) => {
    if (!acc[p.status]) acc[p.status] = [];
    acc[p.status].push(p);
    return acc;
  }, {} as Record<string, NavProperty[]>);

  const linkClass = (active = false) =>
    cn(
      "text-sm font-medium transition-colors",
      transparent
        ? active
          ? "text-white"
          : "text-white/85 hover:text-white"
        : active
          ? "text-brand-purple-600"
          : "text-stone-700 hover:text-brand-purple-600"
    );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        transparent
          ? "bg-gradient-to-b from-black/30 via-black/10 to-transparent"
          : "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)] border-b border-stone-200/80"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand mark — uses the supplied logo at its natural aspect ratio */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Shivashree Developers — home">
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-md p-1 transition",
                transparent ? "bg-white/95 shadow-sm" : "bg-transparent"
              )}
            >
              <Image
                src="/logo.png"
                alt="Shivashree Developers"
                width={160}
                height={120}
                priority
                className="h-12 w-auto"
              />
            </span>
          </Link>

          {/* Desktop nav: Home → Projects → Resources → Contact → About */}
          <div className="hidden lg:flex items-center gap-7">
            <Link href="/" className={linkClass()}>Home</Link>

            {/* Projects dropdown */}
            <div ref={projectsRef} className="relative">
              <button
                onClick={() => {
                  setProjectsOpen((v) => !v);
                  setResourcesOpen(false);
                }}
                className={cn("flex items-center gap-1.5", linkClass())}
                aria-expanded={projectsOpen}
              >
                Projects
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", projectsOpen && "rotate-180")}
                />
              </button>

              {projectsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 p-3">
                  <Link
                    href="/projects"
                    onClick={() => setProjectsOpen(false)}
                    className="block px-3 py-2.5 rounded-lg hover:bg-brand-purple-50 transition text-sm font-semibold text-brand-purple-700 mb-1 border-b border-stone-100 pb-3"
                  >
                    See every project →
                  </Link>

                  {(["ONGOING", "PROPOSED", "COMPLETED"] as const).map(
                    (status) =>
                      grouped[status]?.length ? (
                        <div key={status} className="mt-2">
                          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-1">
                            {statusLabel[status]}
                          </p>
                          {grouped[status].map((p) => (
                            <Link
                              key={p.slug}
                              href={`/projects/${p.slug}`}
                              onClick={() => setProjectsOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-stone-50 transition"
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[status]}`} />
                              <span className="text-sm text-stone-700 font-medium truncate">
                                {p.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : null
                  )}
                </div>
              )}
            </div>

            {/* Resources dropdown */}
            <div ref={resourcesRef} className="relative">
              <button
                onClick={() => {
                  setResourcesOpen((v) => !v);
                  setProjectsOpen(false);
                }}
                className={cn("flex items-center gap-1.5", linkClass())}
                aria-expanded={resourcesOpen}
              >
                Resources
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", resourcesOpen && "rotate-180")}
                />
              </button>
              {resourcesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 p-2">
                  <Link
                    href="/resources/blog"
                    onClick={() => setResourcesOpen(false)}
                    className="block px-3 py-2.5 rounded-lg hover:bg-brand-purple-50 transition"
                  >
                    <p className="text-sm font-semibold text-stone-900">Notes & guides</p>
                    <p className="text-xs text-stone-500">Buying tips, neighbourhood snapshots</p>
                  </Link>
                  <Link
                    href="/resources/faqs"
                    onClick={() => setResourcesOpen(false)}
                    className="block px-3 py-2.5 rounded-lg hover:bg-brand-purple-50 transition"
                  >
                    <p className="text-sm font-semibold text-stone-900">FAQs</p>
                    <p className="text-xs text-stone-500">Booking, loans, RERA, possession</p>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/contact" className={linkClass()}>Contact Us</Link>
            <Link href="/about" className={linkClass()}>About Us</Link>

            {/* Primary CTA — WhatsApp if configured, otherwise the contact page */}
            <a
              href={
                whatsappNumber
                  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      "Hi Shivashree Developers, I'd like to know more about your apartments."
                    )}`
                  : "/contact"
              }
              className="inline-flex items-center gap-2 bg-brand-purple-600 hover:bg-brand-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              Talk to a sales advisor
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition",
              transparent
                ? "text-white hover:bg-white/10"
                : "text-stone-700 hover:bg-stone-100"
            )}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — same Home → Projects → Resources → Contact → About order */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/projects", label: "All Projects" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-stone-800 font-medium hover:text-brand-purple-600 transition text-sm border-b border-stone-100"
              >
                {item.label}
              </Link>
            ))}

            {sorted.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2.5 pl-4 text-stone-600 hover:text-brand-purple-600 transition text-sm"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[p.status]}`} />
                {p.title}
              </Link>
            ))}

            {[
              { href: "/resources/blog", label: "Notes & guides" },
              { href: "/resources/faqs", label: "FAQs" },
              { href: "/contact", label: "Contact Us" },
              { href: "/about", label: "About Us" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-stone-800 font-medium hover:text-brand-purple-600 transition text-sm border-b border-stone-100"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4">
              <a
                href={
                  whatsappNumber
                    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        "Hi Shivashree Developers, I'd like to know more about your apartments."
                      )}`
                    : "/contact"
                }
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-brand-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-purple-700 transition text-sm"
              >
                Talk to a sales advisor
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

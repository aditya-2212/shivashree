"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicSiteCopy } from "@/lib/site-copy";

interface NavProperty {
  title: string;
  slug: string;
  status: "PROPOSED" | "ONGOING" | "COMPLETED" | "SOLD_OUT";
}

interface Props {
  properties: NavProperty[];
  whatsappNumber?: string;
  copy: PublicSiteCopy;
}

const statusOrder: Record<string, number> = {
  ONGOING: 0,
  PROPOSED: 1,
  COMPLETED: 2,
  SOLD_OUT: 3,
};

const statusDot: Record<string, string> = {
  ONGOING: "bg-brand-purple-600",
  PROPOSED: "bg-brand-blue-500",
  COMPLETED: "bg-emerald-500",
  SOLD_OUT: "bg-stone-400",
};

export default function Navbar({ properties, whatsappNumber, copy }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const projectsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const statusLabel: Record<string, string> = {
    PROPOSED: copy.statusLabelProposed,
    ONGOING: copy.statusLabelOngoing,
    COMPLETED: copy.statusLabelCompleted,
    SOLD_OUT: copy.statusLabelSoldOut,
  };

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  // useEffect is intentional — avoids SSR/hydration mismatch.
  // scrolled starts false so the navbar is always transparent on first paint;
  // the effect immediately reads the real scroll position and corrects if needed.
  useEffect(() => {
    const checkScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.7);
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  // Re-check on every route change (Navbar stays mounted across navigations).
  // Temporarily disable smooth-scroll so the programmatic scroll-to-top is
  // instant, ensuring scrollY reads 0 when we check on the new page.
  useEffect(() => {
    document.documentElement.classList.add("navigating");
    const id = requestAnimationFrame(() => {
      setScrolled(window.scrollY > window.innerHeight * 0.7);
      document.documentElement.classList.remove("navigating");
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const openProjects = () => {
    if (projectsTimer.current) clearTimeout(projectsTimer.current);
    setProjectsOpen(true);
    setResourcesOpen(false);
  };
  const closeProjectsDelayed = () => {
    projectsTimer.current = setTimeout(() => setProjectsOpen(false), 120);
  };

  const openResources = () => {
    if (resourcesTimer.current) clearTimeout(resourcesTimer.current);
    setResourcesOpen(true);
    setProjectsOpen(false);
  };
  const closeResourcesDelayed = () => {
    resourcesTimer.current = setTimeout(() => setResourcesOpen(false), 120);
  };

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
          ? "bg-gradient-to-b from-black/50 via-black/20 to-transparent"
          : "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)] border-b border-stone-200/80"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Brand mark */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label={`${copy.structuredOrgName} — home`}>
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-md p-1 transition",
                transparent ? "bg-white/95 shadow-sm" : "bg-transparent"
              )}
            >
              <Image
                src="/logo.png"
                alt={copy.structuredOrgName}
                width={240}
                height={180}
                priority
                className="h-20 w-auto"
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            <Link href="/" className={linkClass()}>{copy.navLabelHome}</Link>

            {/* Projects dropdown — opens on hover */}
            <div
              className="relative"
              onMouseEnter={openProjects}
              onMouseLeave={closeProjectsDelayed}
            >
              <button
                className={cn("flex items-center gap-1.5", linkClass())}
                aria-expanded={projectsOpen}
                tabIndex={0}
                onFocus={openProjects}
                onBlur={closeProjectsDelayed}
              >
                {copy.navLabelProjects}
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
                    {copy.navProjectsSeeAllLabel}
                  </Link>

                  {(["ONGOING", "PROPOSED", "COMPLETED", "SOLD_OUT"] as const).map(
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

            {/* Resources dropdown — opens on hover */}
            <div
              className="relative"
              onMouseEnter={openResources}
              onMouseLeave={closeResourcesDelayed}
            >
              <button
                className={cn("flex items-center gap-1.5", linkClass())}
                aria-expanded={resourcesOpen}
                tabIndex={0}
                onFocus={openResources}
                onBlur={closeResourcesDelayed}
              >
                {copy.navLabelResources}
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
                    <p className="text-sm font-semibold text-stone-900">{copy.navResourcesBlogTitle}</p>
                    <p className="text-xs text-stone-500">{copy.navResourcesBlogSubtitle}</p>
                  </Link>
                  <Link
                    href="/resources/faqs"
                    onClick={() => setResourcesOpen(false)}
                    className="block px-3 py-2.5 rounded-lg hover:bg-brand-purple-50 transition"
                  >
                    <p className="text-sm font-semibold text-stone-900">{copy.navResourcesFaqsTitle}</p>
                    <p className="text-xs text-stone-500">{copy.navResourcesFaqsSubtitle}</p>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/contact" className={linkClass()}>{copy.navLabelContact}</Link>
            <Link href="/about" className={linkClass()}>{copy.navLabelAbout}</Link>

            <a
              href={
                whatsappNumber
                  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(copy.navWhatsappPrefillMessage)}`
                  : "/contact"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-purple-600 hover:bg-brand-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              {copy.navWhatsappCtaLabel}
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
            aria-label={isOpen ? copy.navMobileMenuCloseA11y : copy.navMobileMenuOpenA11y}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {[
              { href: "/", label: copy.navLabelHome },
              { href: "/projects", label: copy.navMobileAllProjectsLabel },
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
              { href: "/resources/blog", label: copy.navResourcesBlogTitle },
              { href: "/resources/faqs", label: copy.navResourcesFaqsTitle },
              { href: "/contact", label: copy.navLabelContact },
              { href: "/about", label: copy.navLabelAbout },
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
                    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(copy.navWhatsappPrefillMessage)}`
                    : "/contact"
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-brand-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-purple-700 transition text-sm"
              >
                {copy.navWhatsappCtaLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

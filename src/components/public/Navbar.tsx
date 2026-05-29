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
  status: "PROPOSED" | "ONGOING" | "COMPLETED" | "SOLD_OUT";
}

interface Props {
  properties: NavProperty[];
  whatsappNumber?: string;
  /** Whether the current route is the homepage. Provided by the server (via
   *  middleware → layout) so the navbar renders in the right mode on first
   *  paint instead of flashing white before client JS runs. */
  isHome: boolean;
}

const statusOrder: Record<string, number> = {
  ONGOING: 0,
  PROPOSED: 1,
  COMPLETED: 2,
  SOLD_OUT: 3,
};

const statusLabel: Record<string, string> = {
  PROPOSED: "Coming Soon",
  ONGOING: "Now Selling",
  COMPLETED: "Ready to Move",
  SOLD_OUT: "Sold Out",
};

const statusDot: Record<string, string> = {
  ONGOING: "bg-brand-purple-600",
  PROPOSED: "bg-brand-blue-500",
  COMPLETED: "bg-emerald-500",
  SOLD_OUT: "bg-stone-400",
};

export default function Navbar({ properties, whatsappNumber, isHome: isHomeInitial }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const projectsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Seed from the server-provided value (correct on first paint), then keep it
  // in sync with client-side navigation — the layout/prop won't re-run then.
  const [isHome, setIsHome] = useState(isHomeInitial);
  useEffect(() => {
    if (pathname) setIsHome(pathname === "/");
  }, [pathname]);

  const heroMode = isHome && overHero;

  // Dark nav while #home-hero is on screen; white nav once the hero scrolls away.
  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }

    setOverHero(true);

    // The hero lives in the page (a child of this layout), so its DOM node is
    // mounted by the time this effect runs. If for any reason it isn't there
    // yet, stay in hero (dark/transparent) mode rather than flashing the white
    // bar — on the homepage the hero is always present. We also retry on the
    // next frame to cover any race where the page mounts a tick later.
    let observer: IntersectionObserver | null = null;
    const attach = () => {
      const hero = document.getElementById("home-hero");
      if (!hero) return false;
      observer = new IntersectionObserver(
        ([entry]) => setOverHero(entry.isIntersecting),
        { threshold: 0 }
      );
      observer.observe(hero);
      return true;
    };

    let raf = 0;
    if (!attach()) {
      raf = requestAnimationFrame(() => attach());
    }
    return () => {
      observer?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => {
    document.documentElement.classList.add("navigating");
    const id = requestAnimationFrame(() => {
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
      heroMode
        ? active
          ? "text-white"
          : "text-white/90 hover:text-white"
        : active
          ? "text-brand-purple-600"
          : "text-stone-700 hover:text-brand-purple-600"
    );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        heroMode
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand mark */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Shivashree Developers — home">
            <span className="inline-flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Shivashree Developers"
                width={240}
                height={180}
                priority
                className={cn(
                  "h-16 w-auto transition",
                  heroMode && "drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                )}
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            <Link href="/" className={linkClass()}>Home</Link>

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

            <a
              href={
                whatsappNumber
                  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      "Hi Shivashree Developers, I'd like to know more about your apartments."
                    )}`
                  : "/contact"
              }
              target="_blank"
              rel="noopener noreferrer"
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
              heroMode
                ? "text-white hover:bg-white/10"
                : "text-stone-700 hover:bg-stone-100"
            )}
            aria-label={isOpen ? "Close menu" : "Open menu"}
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
                target="_blank"
                rel="noopener noreferrer"
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

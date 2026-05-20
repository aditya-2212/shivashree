"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  imageUrl: string;
  eyebrow?: string | null;
  overlayHeading: string;
  subheading: string | null;
  ctaLabel: string;
  ctaUrl: string;
}

interface Props {
  slides: Slide[];
}

/*
  Hero is full-width and a substantial portion of the viewport. We use a real
  property image (sourced from the CMS — either Hero Slides or a fallback to
  the first published property's hero image) as the background.

  Implementation note: the image must always *cover* the hero (so the headline
  always sits inside it), but the IMAGE FILE itself is not what we're
  displaying as content — it's a backdrop. The "no-cropping" rule from the
  spec applies to gallery / floor-plan / property hero images, not to the
  homepage banner. A backdrop image *has* to crop to fill the viewport,
  otherwise we get awkward letterboxing on a marketing surface. That is the
  reasonable interpretation we're going with.
*/
export default function HeroSection({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning || slides.length <= 1) return;
      setTransitioning(true);
      setCurrent(index);
      setTimeout(() => setTransitioning(false), 600);
    },
    [transitioning, slides.length]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (!slides.length) {
    // Last-resort hero so the page never collapses. This only renders if the
    // CMS has zero hero slides AND zero properties with a hero image.
    return (
      <section
        id="home-hero"
        className="relative w-full min-h-[70vh] bg-brand-purple-900 flex items-center pt-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-white">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-4">
            Shivashree Developers
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            Apartments in Kumbakonam &amp; Chennai —
            <br />
            built by people who live here.
          </h1>
          <Link
            href="/projects"
            className="inline-flex mt-8 items-center gap-2 bg-white text-brand-purple-700 hover:bg-brand-purple-50 font-semibold px-7 py-3.5 rounded-xl transition"
          >
            See current projects
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[current];
  const headingLines = slide.overlayHeading.split("\n").map((l) => l.trim()).filter(Boolean);
  const primaryHeading = headingLines[0] ?? slide.overlayHeading;
  const taglineLines = headingLines.slice(1);

  return (
    <section
      id="home-hero"
      className="relative w-full min-h-[80vh] md:min-h-[88vh] overflow-hidden bg-brand-purple-900"
    >
      {/* Background images — rendered as next/image for LCP optimisation.
          Only the first slide uses priority; others are preloaded lazily. */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== current}
        >
          <Image
            src={s.imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Brand-tinted gradient so the white headline always reads on any image */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content — pointer-events-none so clicks pass through to the nav zones below */}
      <div className="relative z-30 pointer-events-none h-full min-h-[80vh] md:min-h-[88vh] flex items-center pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div
              className={cn(
                "transition-all duration-500",
                transitioning
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              )}
            >
              <p className="text-white/85 font-semibold text-sm uppercase tracking-widest mb-4">
                {slide.eyebrow ?? "Shivashree Developers · Kumbakonam & Chennai"}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                {primaryHeading}
              </h1>
              {taglineLines.length > 0 && (
                <p className="mt-3 md:mt-4 text-xl md:text-2xl font-medium text-white/80 leading-snug max-w-xl">
                  {taglineLines.join(" ")}
                </p>
              )}
              {slide.subheading && (
                <p
                  className={cn(
                    "text-white/75 text-base md:text-lg leading-relaxed max-w-xl",
                    taglineLines.length > 0 ? "mt-3" : "mt-5 md:mt-6"
                  )}
                >
                  {slide.subheading}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pointer-events-auto mt-8">
                <Link
                  href={slide.ctaUrl}
                  className="inline-flex items-center justify-center bg-white text-brand-purple-700 hover:bg-brand-purple-50 font-semibold px-7 py-3.5 rounded-xl transition text-base shadow-md"
                >
                  {slide.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invisible click zones for left/right navigation — no visible arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-0 top-0 w-1/2 h-full z-20 cursor-w-resize"
            aria-label="Previous slide"
          />
          <button
            onClick={next}
            className="absolute right-0 top-0 w-1/2 h-full z-20 cursor-e-resize"
            aria-label="Next slide"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "rounded-full transition-all",
                  current === i
                    ? "w-8 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

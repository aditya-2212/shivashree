import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import HeroSlideListActions from "@/components/admin/HeroSlideListActions";

export default async function HeroSlidesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Homepage hero</h1>
          <p className="text-stone-500 text-sm mt-1">
            {slides.length === 0
              ? "No slides yet — add one to control the homepage hero carousel."
              : `${slides.length} ${slides.length === 1 ? "slide" : "slides"} — sorted by the order number.`}
          </p>
        </div>
        <Link
          href="/admin/hero-slides/new"
          className="inline-flex items-center gap-2 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold px-4 py-2.5 rounded-lg transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Add slide
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-16 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-7 h-7 text-stone-400" />
          </div>
          <h3 className="text-stone-700 font-semibold mb-1">No slides yet</h3>
          <p className="text-stone-400 text-sm mb-4 max-w-sm mx-auto">
            Add one or more slides with an image, heading, and call-to-action button. They appear in the homepage hero carousel, ordered by sort number.
          </p>
          <Link
            href="/admin/hero-slides/new"
            className="inline-flex items-center gap-2 bg-brand-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add first slide
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-24 h-14 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.imageUrl}
                  alt={slide.overlayHeading}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-stone-900 text-sm truncate">
                    {slide.overlayHeading.split("\n")[0]}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      slide.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {slide.isActive ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Order: {slide.sortOrder} &middot; CTA: {slide.ctaLabel} → {slide.ctaUrl}
                </p>
              </div>

              <HeroSlideListActions id={slide.id} isActive={slide.isActive} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeroSlideForm from "@/components/admin/HeroSlideForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHeroSlidePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id: parseInt(id) } });
  if (!slide) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/hero-slides"
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to hero slides
        </Link>
        <h1 className="text-2xl font-bold text-stone-900">Edit hero slide</h1>
        <p className="text-stone-500 text-sm mt-1">
          Update the image, text, or CTA. Changes go live on the homepage immediately after saving.
        </p>
      </div>
      <HeroSlideForm
        mode="edit"
        initialData={{
          id: slide.id,
          imageUrl: slide.imageUrl,
          eyebrow: slide.eyebrow,
          overlayHeading: slide.overlayHeading,
          subheading: slide.subheading,
          ctaLabel: slide.ctaLabel,
          ctaUrl: slide.ctaUrl,
          sortOrder: slide.sortOrder,
          isActive: slide.isActive,
        }}
      />
    </div>
  );
}

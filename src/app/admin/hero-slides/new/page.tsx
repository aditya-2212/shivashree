import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeroSlideForm from "@/components/admin/HeroSlideForm";

export default async function NewHeroSlidePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

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
        <h1 className="text-2xl font-bold text-stone-900">Add a hero slide</h1>
        <p className="text-stone-500 text-sm mt-1">
          Upload an image and write the overlay text that visitors will see on the homepage.
        </p>
      </div>
      <HeroSlideForm mode="create" />
    </div>
  );
}

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/admin/PropertyForm";
import { parseJsonField } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id: parseInt(id) },
    include: {
      galleryImages: { orderBy: { sortOrder: "asc" } },
      floorPlans: { orderBy: { sortOrder: "asc" } },
      amenities: true,
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!property) notFound();

  const formData = {
    ...property,
    bhkTypes: parseJsonField<string[]>(property.bhkTypes, []),
    highlights: parseJsonField<string[]>(property.highlights, []),
    keySpecifications: parseJsonField<Record<string, string>>(
      property.keySpecifications,
      {}
    ),
    locationAdvantages: parseJsonField<string[]>(
      property.locationAdvantages,
      []
    ),
    // Convert null alt to undefined for the form component
    galleryImages: property.galleryImages.map((img) => ({
      ...img,
      alt: img.alt ?? undefined,
    })),
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <nav className="text-sm text-stone-400 mb-1">
          <a href="/admin/properties" className="hover:text-stone-600">
            Properties
          </a>{" "}
          / Edit
        </nav>
        <h1 className="text-2xl font-bold text-stone-900">Edit Property</h1>
        <p className="text-stone-500 text-sm mt-1">
          Make your changes below. Use &ldquo;Save as Draft&rdquo; to save
          without publishing.
        </p>
      </div>

      <PropertyForm mode="edit" initialData={formData} />
    </div>
  );
}

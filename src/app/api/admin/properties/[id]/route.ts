import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const propertyId = parseInt(id);

  try {
    const body = await req.json();
    const {
      title,
      city,
      locality,
      fullAddress,
      status,
      priceStartingFrom,
      reraNumber,
      heroImage,
      heroImageAlt,
      bhkTypes,
      highlights,
      keySpecifications,
      locationAdvantages,
      mapEmbedUrl,
      seoTitle,
      seoDescription,
      isPublished,
      gallery,
      floorPlans,
      amenities,
      faqs,
      slug,
    } = body;

    // Delete and recreate related records (simpler than diffing)
    await prisma.$transaction([
      prisma.propertyGallery.deleteMany({ where: { propertyId } }),
      prisma.floorPlan.deleteMany({ where: { propertyId } }),
      prisma.amenity.deleteMany({ where: { propertyId } }),
      prisma.propertyFAQ.deleteMany({ where: { propertyId } }),
    ]);

    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        title,
        city,
        locality,
        fullAddress,
        status,
        priceStartingFrom: priceStartingFrom ?? null,
        reraNumber: reraNumber || null,
        heroImage: heroImage || null,
        heroImageAlt: heroImageAlt || null,
        bhkTypes: JSON.stringify(bhkTypes ?? []),
        highlights: JSON.stringify(highlights ?? []),
        keySpecifications: JSON.stringify(keySpecifications ?? {}),
        locationAdvantages: JSON.stringify(locationAdvantages ?? []),
        mapEmbedUrl: mapEmbedUrl || null,
        ...(slug ? { slug } : {}),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isPublished: isPublished ?? false,
        galleryImages: {
          create: (gallery ?? []).map(
            (img: { url: string; alt?: string }, i: number) => ({
              url: img.url,
              alt: img.alt ?? null,
              sortOrder: i,
            })
          ),
        },
        floorPlans: {
          create: (floorPlans ?? []).map(
            (fp: { label: string; imageUrl: string }, i: number) => ({
              label: fp.label,
              imageUrl: fp.imageUrl,
              sortOrder: i,
            })
          ),
        },
        amenities: {
          create: (amenities ?? []).map(
            (a: { icon: string; label: string }) => ({
              icon: a.icon,
              label: a.label,
            })
          ),
        },
        faqs: {
          create: (faqs ?? []).map(
            (f: { question: string; answer: string }, i: number) => ({
              question: f.question,
              answer: f.answer,
              sortOrder: i,
            })
          ),
        },
      },
    });

    revalidateTag("properties", "max");
    revalidatePath("/projects");
    revalidatePath(`/projects/${property.slug}`);

    return NextResponse.json(property);
  } catch (error) {
    console.error("Update property error:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.property.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}

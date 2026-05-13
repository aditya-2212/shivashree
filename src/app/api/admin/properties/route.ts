import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      galleryImages: { orderBy: { sortOrder: "asc" } },
      floorPlans: { orderBy: { sortOrder: "asc" } },
      amenities: true,
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    } = body;

    // Generate slug from title + city
    const baseSlug = slugify(`${title} ${locality} ${city}`);
    let slug = baseSlug;
    let attempt = 0;

    while (await prisma.property.findUnique({ where: { slug } })) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    const property = await prisma.property.create({
      data: {
        title,
        slug,
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

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}

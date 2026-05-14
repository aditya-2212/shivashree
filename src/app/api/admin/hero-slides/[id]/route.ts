import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id: parseInt(id) } });
  if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(slide);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const { imageUrl, eyebrow, overlayHeading, subheading, ctaLabel, ctaUrl, sortOrder, isActive } = body;

    const slide = await prisma.heroSlide.update({
      where: { id: parseInt(id) },
      data: {
        imageUrl,
        eyebrow: eyebrow || null,
        overlayHeading,
        subheading: subheading || null,
        ctaLabel: ctaLabel || "View Projects",
        ctaUrl: (typeof ctaUrl === "string" && ctaUrl.trim()) || "/contact",
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("/");
    return NextResponse.json(slide);
  } catch (error) {
    console.error("Hero slide update error:", error);
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.heroSlide.delete({ where: { id: parseInt(id) } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slide delete error:", error);
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}

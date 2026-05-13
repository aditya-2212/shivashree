import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { imageUrl, eyebrow, overlayHeading, subheading, ctaLabel, ctaUrl, sortOrder, isActive } = body;

    if (!imageUrl || !overlayHeading) {
      return NextResponse.json(
        { error: "imageUrl and overlayHeading are required" },
        { status: 400 }
      );
    }

    const slide = await prisma.heroSlide.create({
      data: {
        imageUrl,
        eyebrow: eyebrow || null,
        overlayHeading,
        subheading: subheading || null,
        ctaLabel: ctaLabel || "View Projects",
        ctaUrl: ctaUrl || "/projects",
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Hero slide create error:", error);
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify, estimateReadTime } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, excerpt, content, authorName, category, coverImage, isPublished, publishedAt, readTimeMinutes } = body;

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let attempt = 0;
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        body: body.body ?? content ?? "",
        authorName,
        category,
        coverImage: coverImage || null,
        tags: JSON.stringify([]),
        readTimeMinutes: readTimeMinutes ?? estimateReadTime(body.body ?? ""),
        isPublished: isPublished ?? false,
        publishedAt: isPublished ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

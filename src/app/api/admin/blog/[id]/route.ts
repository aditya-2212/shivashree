import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { estimateReadTime, slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt((await params).id);
  try {
    const body = await req.json();
    const { title, slug: rawSlug, excerpt, authorName, category, coverImage, seoTitle, seoDescription, isPublished, publishedAt, readTimeMinutes } = body;
    const postBody = body.body ?? "";

    // Recompute the slug only when the admin provided one. Slugify it and
    // de-dupe against OTHER posts (excluding this one).
    let slug: string | undefined;
    if (rawSlug?.trim()) {
      const baseSlug = slugify(rawSlug.trim());
      slug = baseSlug;
      let attempt = 0;
      while (
        await prisma.blogPost.findFirst({
          where: { slug, id: { not: id } },
          select: { id: true },
        })
      ) {
        attempt++;
        slug = `${baseSlug}-${attempt}`;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        ...(slug ? { slug } : {}),
        excerpt,
        body: postBody,
        authorName,
        category,
        coverImage: coverImage || null,
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
        readTimeMinutes: readTimeMinutes ?? estimateReadTime(postBody),
        isPublished: isPublished ?? false,
        publishedAt: isPublished ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
      },
    });

    revalidatePath("/resources/blog");
    if (post.slug) revalidatePath(`/resources/blog/${post.slug}`);

    return NextResponse.json(post);
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

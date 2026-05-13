import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { estimateReadTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { title, excerpt, authorName, category, coverImage, isPublished, publishedAt, readTimeMinutes } = body;
    const postBody = body.body ?? "";

    const post = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: {
        title,
        excerpt,
        body: postBody,
        authorName,
        category,
        coverImage: coverImage || null,
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

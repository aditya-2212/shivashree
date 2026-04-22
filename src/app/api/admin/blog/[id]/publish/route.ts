import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { isPublished } = await req.json();

  try {
    const post = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

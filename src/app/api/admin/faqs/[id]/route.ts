import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { question, answer, sortOrder } = await req.json();

  try {
    const faq = await prisma.fAQEntry.update({
      where: { id: parseInt(id) },
      data: { question, answer, sortOrder },
    });
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.fAQEntry.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}

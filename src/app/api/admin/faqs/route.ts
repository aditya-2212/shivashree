import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const faq = await prisma.fAQEntry.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category ?? "GENERAL",
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}

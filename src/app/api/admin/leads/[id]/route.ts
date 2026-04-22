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
  const { status, notes } = await req.json();

  try {
    const lead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: { status, notes },
    });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });

    revalidateTag("settings", "max");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/projects");
    revalidatePath("/resources/blog");
    revalidatePath("/resources/faqs");

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

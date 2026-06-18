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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // The settings row is a singleton (id = 1) that always exists in production.
    // Using update (not upsert) means a partial body — e.g. just the Contact
    // page fields — never trips the create path's required-field requirements.
    const settings = await prisma.siteSettings.update({
      where: { id: 1 },
      data: body,
    });

    // Cache busting must never fail the save: the data is already persisted by
    // this point, so swallow any revalidation error and just log it.
    try {
      revalidateTag("settings", "max");
      for (const path of ["/", "/about", "/contact", "/projects", "/resources/blog", "/resources/faqs"]) {
        revalidatePath(path);
      }
    } catch (e) {
      console.error("Settings revalidate warning (data was saved):", e);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      {
        error: "Failed to save settings",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

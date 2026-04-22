import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomBytes } from "crypto";
import { extname } from "path";
import { supabaseAdmin, UPLOAD_BUCKET } from "@/lib/supabase";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 10 MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = extname(file.name).toLowerCase() || ".jpg";
    const filename = `${randomBytes(16).toString("hex")}${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(UPLOAD_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage upload error:", error);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    // Build the public URL for this file so the CMS can store it directly.
    const { data } = supabaseAdmin.storage
      .from(UPLOAD_BUCKET)
      .getPublicUrl(filename);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

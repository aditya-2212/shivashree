import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, mobile, email, lookingIn, projectEnquiry, propertyId, source } =
      await req.json();

    if (!name || !mobile) {
      return NextResponse.json(
        { error: "Name and mobile are required" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        mobile,
        email: email || null,
        lookingIn: lookingIn || null,
        projectEnquiry: projectEnquiry || null,
        propertyId: propertyId ? parseInt(propertyId) : null,
        source: source ?? "website",
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

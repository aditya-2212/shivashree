import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEnquiryEmail } from "@/lib/email";

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

    const src = source ?? "website";

    // Always capture the enquiry as a lead first, so a submission is never lost
    // (this is why the homepage/project forms always worked — they save a lead).
    const lead = await prisma.lead.create({
      data: {
        name,
        mobile,
        email: email || null,
        lookingIn: lookingIn || null,
        projectEnquiry: projectEnquiry || null,
        propertyId: propertyId ? parseInt(propertyId) : null,
        source: src,
        status: "NEW",
      },
    });

    // Every enquiry (homepage, project, contact) also triggers an email
    // notification — on a best-effort basis. A failed email must NOT fail the
    // submission: the lead is already saved and visible under Enquiries.
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: 1 },
        select: { enquiryRecipientEmail: true },
      });
      await sendContactEnquiryEmail({
        name,
        mobile,
        email: email || null,
        lookingIn: lookingIn || null,
        projectEnquiry: projectEnquiry || null,
        source: src,
        to: settings?.enquiryRecipientEmail || null,
      });
    } catch (err) {
      console.error("Enquiry email error (lead saved):", err);
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

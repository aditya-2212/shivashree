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

    if (src === "contact-page") {
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
        console.error("Contact enquiry email error:", err);
        return NextResponse.json(
          {
            error:
              "We could not send your message by email. Please call us or try again later.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json({ success: true }, { status: 201 });
    }

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

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

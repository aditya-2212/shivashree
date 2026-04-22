import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    orderBy: { submittedAt: "desc" },
    include: { property: { select: { title: true } } },
  });

  const headers = [
    "Name",
    "Mobile",
    "Email",
    "Looking In",
    "Project Enquiry",
    "Source",
    "Status",
    "Submitted At",
    "Notes",
  ];

  const rows = leads.map((lead) => [
    `"${lead.name}"`,
    `"${lead.mobile}"`,
    `"${lead.email ?? ""}"`,
    `"${lead.lookingIn ?? ""}"`,
    `"${lead.property?.title ?? lead.projectEnquiry ?? ""}"`,
    `"${lead.source}"`,
    `"${lead.status}"`,
    `"${lead.submittedAt.toISOString()}"`,
    `"${(lead.notes ?? "").replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="shivashree-leads-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

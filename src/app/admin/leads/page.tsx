import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Phone, Mail, Calendar, Download, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { status } = await searchParams;

  const leads = await prisma.lead.findMany({
    where: status ? { status: status as "NEW" | "CONTACTED" | "CLOSED" } : undefined,
    orderBy: { submittedAt: "desc" },
    include: { property: { select: { title: true } } },
  });

  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: true,
  });

  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count }),
    {} as Record<string, number>
  );

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Enquiries inbox</h1>
          <p className="text-stone-500 text-sm mt-1">
            {leads.length === 0
              ? "Nothing waiting for a callback right now."
              : `${leads.length} ${leads.length === 1 ? "person" : "people"} have written in${
                  status ? "" : " across all stages"
                }.`}
          </p>
        </div>
        <a
          href="/api/admin/leads/export"
          className="inline-flex items-center gap-2 border border-stone-300 text-stone-700 font-medium px-4 py-2.5 rounded-lg hover:bg-stone-50 transition text-sm"
        >
          <Download className="w-4 h-4" />
          Download as spreadsheet
        </a>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { label: "Everyone", value: undefined, count: Object.values(countMap).reduce((a, b) => a + b, 0) },
          { label: "Haven't called yet", value: "NEW", count: countMap.NEW ?? 0 },
          { label: "Spoke to them", value: "CONTACTED", count: countMap.CONTACTED ?? 0 },
          { label: "Wrapped up", value: "CLOSED", count: countMap.CLOSED ?? 0 },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/leads?status=${tab.value}` : "/admin/leads"}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition border ${
              status === tab.value || (!status && !tab.value)
                ? "bg-stone-900 text-white border-stone-900"
                : "border-stone-300 text-stone-600 hover:border-stone-400 bg-white"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {tab.label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
              status === tab.value || (!status && !tab.value)
                ? "bg-white/20"
                : "bg-stone-100"
            }`}>
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-16 text-center">
          <p className="text-stone-600 text-sm">
            {status === "NEW"
              ? "Nicely done — every new enquiry has been picked up."
              : status === "CONTACTED"
              ? "No-one is currently waiting on a follow-up."
              : status === "CLOSED"
              ? "No closed enquiries match this view yet."
              : "Nothing has come in through the website yet. As soon as someone fills the form, they’ll show up here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="flex items-start gap-4 px-6 py-4 hover:bg-stone-50 transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-brand-purple-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-brand-purple-600 font-semibold text-sm">
                  {lead.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-stone-900 text-sm">{lead.name}</span>
                  <LeadStatusBadge status={lead.status} />
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-stone-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {lead.mobile}
                  </span>
                  {lead.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(lead.submittedAt)}
                  </span>
                </div>
                {(lead.property?.title || lead.projectEnquiry) && (
                  <p className="text-xs text-brand-purple-700 font-medium mt-1">
                    Asking about {lead.property?.title ?? lead.projectEnquiry}
                  </p>
                )}
              </div>

              <span className="text-xs text-stone-400 shrink-0 mt-1">
                {lead.source}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

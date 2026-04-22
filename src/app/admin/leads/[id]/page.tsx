import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import LeadDetailActions from "@/components/admin/LeadDetailActions";
import { Phone, Mail, MapPin, Building2, Calendar, Globe } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: parseInt(id) },
    include: { property: { select: { title: true, slug: true } } },
  });

  if (!lead) notFound();

  const statusColors: Record<string, string> = {
    NEW: "bg-brand-purple-100 text-brand-purple-600",
    CONTACTED: "bg-blue-100 text-blue-700",
    CLOSED: "bg-stone-100 text-stone-500",
  };

  const statusLabels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    CLOSED: "Closed",
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <nav className="text-sm text-stone-400 mb-1">
          <a href="/admin/leads" className="hover:text-stone-600">Enquiries</a> / Detail
        </nav>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-stone-900">{lead.name}</h1>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[lead.status]}`}>
            {statusLabels[lead.status]}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
        {/* Contact details */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">Contact Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-stone-400" />
              <a href={`tel:${lead.mobile}`} className="text-brand-purple-600 hover:underline font-medium">
                {lead.mobile}
              </a>
            </div>
            {lead.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-stone-400" />
                <a href={`mailto:${lead.email}`} className="text-brand-purple-600 hover:underline">
                  {lead.email}
                </a>
              </div>
            )}
            {lead.lookingIn && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-stone-400" />
                <span className="text-stone-700">{lead.lookingIn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Enquiry details */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">Enquiry Details</h2>
          <div className="space-y-3">
            {(lead.property || lead.projectEnquiry) && (
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-stone-400 mt-0.5" />
                <div>
                  <span className="text-xs text-stone-400">Project of interest</span>
                  <p className="text-stone-700 font-medium">
                    {lead.property ? (
                      <a
                        href={`/projects/${lead.property.slug}`}
                        target="_blank"
                        className="text-brand-purple-600 hover:underline"
                      >
                        {lead.property.title}
                      </a>
                    ) : (
                      lead.projectEnquiry
                    )}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-stone-400" />
              <span className="text-stone-600 text-sm">Source: {lead.source}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span className="text-stone-600 text-sm">
                Submitted {formatDate(lead.submittedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes + Actions */}
        <div className="p-6">
          <LeadDetailActions lead={lead} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 flex gap-3">
        <a
          href={`tel:${lead.mobile}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-purple-600 text-white font-semibold rounded-xl hover:bg-brand-purple-700 transition text-sm"
        >
          <Phone className="w-4 h-4" />
          Call {lead.name.split(" ")[0]}
        </a>
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-stone-300 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 transition text-sm"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </a>
        )}
      </div>
    </div>
  );
}

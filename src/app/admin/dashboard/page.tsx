import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Building2,
  Inbox,
  FileText,
  PenSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [
    totalProperties,
    publishedProperties,
    totalLeads,
    newLeadsThisWeek,
    publishedPosts,
    draftPosts,
    recentLeads,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { isPublished: true } }),
    prisma.lead.count(),
    prisma.lead.count({
      where: {
        submittedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.blogPost.count({ where: { isPublished: false } }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
      include: { property: { select: { title: true } } },
    }),
  ]);

  const summaryCards = [
    {
      label: "Projects on the website",
      value: totalProperties,
      sub: `${publishedProperties} visible to buyers · ${totalProperties - publishedProperties} hidden`,
      icon: Building2,
      href: "/admin/properties",
      color: "bg-brand-blue-50 text-brand-blue-700",
      iconBg: "bg-brand-blue-100",
    },
    {
      label: "Enquiries this week",
      value: newLeadsThisWeek,
      sub: `${totalLeads} total since the site went live`,
      icon: Inbox,
      href: "/admin/leads",
      color: "bg-brand-purple-50 text-brand-purple-600",
      iconBg: "bg-brand-purple-100",
    },
    {
      label: "Notes & guides published",
      value: publishedPosts,
      sub: `${draftPosts} draft${draftPosts !== 1 ? "s" : ""} waiting for you`,
      icon: FileText,
      href: "/admin/blog",
      color: "bg-emerald-50 text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Drafts to finish",
      value: draftPosts,
      sub: draftPosts === 0 ? "Inbox zero — nicely done" : "Open and finish when you have time",
      icon: PenSquare,
      href: "/admin/blog?filter=drafts",
      color: "bg-stone-50 text-stone-700",
      iconBg: "bg-stone-100",
    },
  ];

  const quickActions = [
    {
      label: "Add a new project",
      href: "/admin/properties/new",
      icon: Plus,
      desc: "Title, location, photos, brochure",
    },
    {
      label: "Write a new note",
      href: "/admin/blog/new",
      icon: PenSquare,
      desc: "Goes under Resources → Notes",
    },
    {
      label: "Open the enquiries inbox",
      href: "/admin/leads",
      icon: Inbox,
      desc: "Names, numbers, what they asked about",
    },
  ];

  const statusLabels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    CLOSED: "Closed",
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-brand-purple-100 text-brand-purple-700",
    CONTACTED: "bg-brand-blue-100 text-brand-blue-700",
    CLOSED: "bg-stone-100 text-stone-600",
  };

  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple-600 mb-2">
          Shivashree Developers · Control room
        </p>
        <h1 className="text-2xl font-bold text-stone-900">
          Hi {firstName}.
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Here&apos;s the state of the website right now — projects published,
          enquiries that came in, and drafts waiting for you.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  <Icon className={`w-5 h-5 ${card.color.split(" ")[1]}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-stone-900 mb-0.5">
                {card.value}
              </p>
              <p className="text-sm font-medium text-stone-700">{card.label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-brand-purple-500" />
            <h2 className="font-semibold text-stone-900 text-sm">
              Things you&rsquo;ll do most often
            </h2>
          </div>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-brand-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-brand-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800 group-hover:text-brand-purple-600 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-stone-400">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-purple-500" />
              <h2 className="font-semibold text-stone-900 text-sm">
                Latest enquiries
              </h2>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs text-brand-purple-600 hover:text-brand-purple-700 font-medium"
            >
              Open the inbox →
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                No-one&rsquo;s written in yet — they&rsquo;ll show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-stone-800 truncate">
                        {lead.name}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[lead.status]}`}
                      >
                        {statusLabels[lead.status]}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 truncate mt-0.5">
                      {lead.property?.title ?? lead.projectEnquiry ?? "General enquiry"}{" "}
                      · {lead.mobile}
                    </p>
                  </div>
                  <p className="text-xs text-stone-400 shrink-0 ml-3">
                    {formatDate(lead.submittedAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

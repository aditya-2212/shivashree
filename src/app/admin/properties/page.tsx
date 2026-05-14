import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, MapPin, Calendar } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import PropertyListActions from "@/components/admin/PropertyListActions";

const statusConfig = {
  PROPOSED: { label: "Proposed", color: "bg-brand-blue-100 text-brand-blue-700" },
  ONGOING: { label: "Ongoing", color: "bg-brand-purple-100 text-brand-purple-700" },
  COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  SOLD_OUT: { label: "Sold Out", color: "bg-stone-100 text-stone-600" },
};

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      locality: true,
      status: true,
      priceStartingFrom: true,
      isPublished: true,
      updatedAt: true,
      _count: { select: { leads: true } },
    },
  });

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Projects</h1>
          <p className="text-stone-500 text-sm mt-1">
            {properties.length === 0
              ? "Nothing on the website yet."
              : `${properties.length} project${properties.length !== 1 ? "s" : ""} on file — proposed, ongoing and completed.`}
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold px-4 py-2.5 rounded-lg transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Add a project
        </Link>
      </div>

      {/* Property Cards */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-16 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-7 h-7 text-stone-400" />
          </div>
          <h3 className="text-stone-700 font-semibold mb-1">
            Nothing here yet
          </h3>
          <p className="text-stone-400 text-sm mb-4">
            Add the first project — title, location, photos, brochure.
          </p>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 bg-brand-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add a project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {properties.map((property) => {
            const status = statusConfig[property.status];
            return (
              <div
                key={property.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors"
              >
                {/* Status dot */}
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    property.status === "COMPLETED"
                      ? "bg-emerald-500"
                      : property.status === "ONGOING"
                      ? "bg-brand-purple-600"
                      : "bg-brand-blue-500"
                  }`}
                />

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-stone-900 text-sm">
                      {property.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}
                    >
                      {status.label}
                    </span>
                    {!property.isPublished && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-500">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {property.locality}, {property.city}
                    </span>
                    <span>{formatPrice(property.priceStartingFrom)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Updated {formatDate(property.updatedAt)}
                    </span>
                    {property._count.leads > 0 && (
                      <span className="text-brand-purple-500 font-medium">
                        {property._count.leads} enquir
                        {property._count.leads === 1 ? "y" : "ies"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <PropertyListActions
                  id={property.id}
                  slug={property.slug}
                  isPublished={property.isPublished}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

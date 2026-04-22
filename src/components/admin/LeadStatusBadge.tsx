"use client";

const config = {
  NEW: { label: "New", color: "bg-brand-purple-100 text-brand-purple-600" },
  CONTACTED: { label: "Contacted", color: "bg-blue-100 text-blue-700" },
  CLOSED: { label: "Closed", color: "bg-stone-100 text-stone-500" },
};

export default function LeadStatusBadge({ status }: { status: string }) {
  const cfg = config[status as keyof typeof config] ?? { label: status, color: "bg-stone-100 text-stone-500" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Lead {
  id: number;
  status: string;
  notes: string | null;
}

export default function LeadDetailActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Enquiry updated");
      router.refresh();
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Status
        </label>
        <div className="flex gap-2">
          {[
            { value: "NEW", label: "New", color: "bg-brand-purple-50 border-brand-purple-300 text-brand-purple-600" },
            { value: "CONTACTED", label: "Contacted", color: "bg-blue-50 border-blue-300 text-blue-700" },
            { value: "CLOSED", label: "Closed", color: "bg-stone-50 border-stone-300 text-stone-600" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                status === opt.value
                  ? opt.color + " border-2"
                  : "border-stone-200 text-stone-400 hover:border-stone-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Internal Notes
          <span className="text-stone-400 font-normal ml-1">(only visible to admin)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition resize-none"
          placeholder="Add notes about this enquiry…"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Changes
      </button>
    </div>
  );
}

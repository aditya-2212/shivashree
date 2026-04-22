"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

const CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "BUYING", label: "Buying" },
  { value: "SELLING", label: "Selling" },
  { value: "RENTING", label: "Renting" },
];

export default function FAQManager({ initialFAQs }: { initialFAQs: FAQ[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState(initialFAQs);
  const [activeCategory, setActiveCategory] = useState("GENERAL");
  const [saving, setSaving] = useState<number | "new" | null>(null);
  const [newFaq, setNewFaq] = useState<{ question: string; answer: string } | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categorised = CATEGORIES.map((cat) => ({
    ...cat,
    items: faqs.filter((f) => f.category === cat.value),
  }));

  const saveFaq = async (faq: FAQ) => {
    setSaving(faq.id);
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faq),
      });
      if (!res.ok) throw new Error();
      toast.success("FAQ saved");
    } catch {
      toast.error("Failed to save FAQ");
    } finally {
      setSaving(null);
    }
  };

  const deleteFaq = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success("FAQ deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const createFaq = async () => {
    if (!newFaq?.question || !newFaq?.answer) {
      toast.error("Please fill in both question and answer");
      return;
    }
    setSaving("new");
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newFaq.question,
          answer: newFaq.answer,
          category: activeCategory,
          sortOrder: faqs.filter((f) => f.category === activeCategory).length,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setFaqs((prev) => [...prev, created]);
      setNewFaq(null);
      toast.success("FAQ added");
      router.refresh();
    } catch {
      toast.error("Failed to create FAQ");
    } finally {
      setSaving(null);
    }
  };

  const updateFaq = (id: number, field: "question" | "answer", value: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition";

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-lg p-1 w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              activeCategory === cat.value
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {cat.label}
            <span className="ml-1.5 text-xs text-stone-400">
              ({faqs.filter((f) => f.category === cat.value).length})
            </span>
          </button>
        ))}
      </div>

      {/* FAQ list for active category */}
      <div className="space-y-3">
        {categorised
          .find((c) => c.value === activeCategory)
          ?.items.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden"
            >
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-stone-50 transition"
                onClick={() =>
                  setExpandedId(expandedId === faq.id ? null : faq.id)
                }
              >
                <div className="flex-1 text-sm font-medium text-stone-800">
                  {faq.question || (
                    <span className="text-stone-400">Untitled question</span>
                  )}
                </div>
                {expandedId === faq.id ? (
                  <ChevronUp className="w-4 h-4 text-stone-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                )}
              </div>

              {expandedId === faq.id && (
                <div className="px-5 pb-5 space-y-3 border-t border-stone-100">
                  <div className="pt-4">
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Question
                    </label>
                    <input
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                      rows={4}
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => saveFaq(faq)}
                      disabled={saving === faq.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition disabled:opacity-60"
                    >
                      {saving === faq.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFaq(faq.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Add new FAQ */}
      {newFaq ? (
        <div className="bg-white rounded-xl border border-brand-purple-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-stone-800">New FAQ</h3>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Question
            </label>
            <input
              value={newFaq.question}
              onChange={(e) =>
                setNewFaq((prev) => prev && { ...prev, question: e.target.value })
              }
              className={inputClass}
              placeholder="What question do buyers often ask?"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Answer
            </label>
            <textarea
              value={newFaq.answer}
              onChange={(e) =>
                setNewFaq((prev) => prev && { ...prev, answer: e.target.value })
              }
              rows={4}
              className={inputClass + " resize-none"}
              placeholder="Write a clear, helpful answer…"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={createFaq}
              disabled={saving === "new"}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-purple-700 transition disabled:opacity-60"
            >
              {saving === "new" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Add FAQ
            </button>
            <button
              type="button"
              onClick={() => setNewFaq(null)}
              className="px-4 py-2 text-stone-500 hover:text-stone-700 text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setNewFaq({ question: "", answer: "" })}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Add FAQ to {CATEGORIES.find((c) => c.value === activeCategory)?.label}
        </button>
      )}
    </div>
  );
}

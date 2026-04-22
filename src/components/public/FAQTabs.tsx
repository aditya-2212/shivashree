"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "BUYING", label: "Buying" },
  { value: "SELLING", label: "Selling" },
  { value: "RENTING", label: "Renting" },
];

export default function FAQTabs({ faqs }: { faqs: FAQ[] }) {
  const [activeTab, setActiveTab] = useState("GENERAL");
  const [openId, setOpenId] = useState<number | null>(null);

  const categorised = CATEGORIES.map((cat) => ({
    ...cat,
    items: faqs.filter((f) => f.category === cat.value),
  })).filter((cat) => cat.items.length > 0);

  const current = categorised.find((c) => c.value === activeTab) ?? categorised[0];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-stone-100 rounded-xl p-1 w-full overflow-x-auto">
        {categorised.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveTab(cat.value);
              setOpenId(null);
            }}
            className={cn(
              "flex-1 px-5 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap",
              activeTab === cat.value
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Questions */}
      {current && (
        <div className="space-y-2">
          {current.items.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={cn(
                  "border rounded-xl overflow-hidden transition-colors",
                  isOpen ? "border-brand-purple-200 bg-brand-purple-50/50" : "border-stone-200 bg-white"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition"
                >
                  <span className="font-semibold text-stone-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-stone-400 shrink-0 transition-transform",
                      isOpen && "rotate-180 text-brand-purple-500"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-stone-600 text-sm leading-relaxed border-t border-brand-purple-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {categorised.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <p>No FAQs available yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}

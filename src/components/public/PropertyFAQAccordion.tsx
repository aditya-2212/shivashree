"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function PropertyFAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={cn(
              "border rounded-xl overflow-hidden transition-colors",
              isOpen ? "border-brand-purple-200" : "border-stone-200"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-stone-50 transition"
            >
              <span className="font-semibold text-stone-800 text-sm pr-4">
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
              <div className="px-5 pb-5 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

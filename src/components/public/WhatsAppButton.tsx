"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({
  number,
  prefillMessage,
  ariaLabel,
}: {
  number: string;
  prefillMessage: string;
  ariaLabel: string;
}) {
  if (!number) return null;

  const url = `https://wa.me/${number}?text=${encodeURIComponent(prefillMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />
    </a>
  );
}

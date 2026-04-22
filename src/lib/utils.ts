import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formatPrice(lakhs: number | null): string {
  if (!lakhs) return "Price on Request";
  if (lakhs >= 100) {
    const crore = lakhs / 100;
    return `₹${crore % 1 === 0 ? crore : crore.toFixed(2)} Cr onwards`;
  }
  return `₹${lakhs} L onwards`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateExcerpt(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]+>/g, "");
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

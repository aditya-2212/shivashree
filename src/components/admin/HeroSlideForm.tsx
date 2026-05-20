"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Upload, Loader2, Save, X } from "lucide-react";

const schema = z.object({
  overlayHeading: z.string().min(1, "Heading is required"),
  eyebrow: z.string().optional(),
  subheading: z.string().optional(),
  ctaLabel: z.string().min(1, "CTA label is required"),
  ctaUrl: z.string().min(1, "CTA URL is required"),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface SlideData {
  id?: number;
  imageUrl?: string | null;
  eyebrow?: string | null;
  overlayHeading: string;
  subheading?: string | null;
  ctaLabel: string;
  ctaUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface Props {
  mode: "create" | "edit";
  initialData?: SlideData;
}

export default function HeroSlideForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      overlayHeading: initialData?.overlayHeading ?? "",
      eyebrow: initialData?.eyebrow ?? "",
      subheading: initialData?.subheading ?? "",
      ctaLabel: initialData?.ctaLabel ?? "View Projects",
      ctaUrl: initialData?.ctaUrl ?? "/contact",
      sortOrder: initialData?.sortOrder ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData: FormData) => {
    if (!imageUrl) {
      toast.error("Please upload a slide image.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData, imageUrl };
      const url =
        mode === "create"
          ? "/api/admin/hero-slides"
          : `/api/admin/hero-slides/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(mode === "create" ? "Slide created!" : "Slide updated!");
      router.push("/admin/hero-slides");
      router.refresh();
    } catch {
      toast.error("Failed to save slide. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition";
  const textareaClass = inputClass + " resize-none";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Image upload */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900 text-sm">Slide image</h2>
          <p className="text-stone-400 text-xs mt-0.5">
            This image fills the full-width hero background. JPG, PNG or WebP. Max 10 MB.
          </p>
        </div>
        <div className="p-6">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {imageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Hero slide preview"
                className="w-full h-52 object-cover rounded-lg border border-stone-200"
              />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="mt-3 text-sm text-brand-purple-600 hover:underline"
              >
                Replace image
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-40 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand-purple-400 hover:bg-brand-purple-50/40 transition text-stone-400 hover:text-brand-purple-600"
            >
              {uploading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <Upload className="w-7 h-7" />
              )}
              <span className="text-sm font-medium">
                {uploading ? "Uploading…" : "Click to upload slide image"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900 text-sm">Text overlay</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Eyebrow text <span className="text-stone-400 font-normal">(optional — small line above the heading)</span>
            </label>
            <input
              {...register("eyebrow")}
              className={inputClass}
              placeholder="e.g. Shivashree Developers · Kumbakonam & Chennai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Main heading <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("overlayHeading")}
              rows={3}
              className={textareaClass}
              placeholder={"e.g. Apartments in Kumbakonam & Chennai\nBuilt by people who live here."}
            />
            <p className="text-stone-400 text-xs mt-1">
              First line is the large property name. Extra lines appear smaller as a tagline — or put marketing copy in Subheading instead.
            </p>
            {errors.overlayHeading && (
              <p className="text-red-600 text-xs mt-1">{errors.overlayHeading.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Subheading <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <input
              {...register("subheading")}
              className={inputClass}
              placeholder="e.g. TNRERA-registered 2 & 3 BHK homes."
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900 text-sm">Call-to-action button</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Button label <span className="text-red-500">*</span>
            </label>
            <input {...register("ctaLabel")} className={inputClass} placeholder="View Projects" />
            {errors.ctaLabel && (
              <p className="text-red-600 text-xs mt-1">{errors.ctaLabel.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Button URL <span className="text-red-500">*</span>
            </label>
            <input {...register("ctaUrl")} className={inputClass} placeholder="/contact" />
            <p className="text-stone-400 text-xs mt-1">
              Use <code className="text-stone-600">/contact</code> for enquiry CTAs. Internal paths must match a real page.
            </p>
            {errors.ctaUrl && (
              <p className="text-red-600 text-xs mt-1">{errors.ctaUrl.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900 text-sm">Display settings</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Sort order
            </label>
            <input
              {...register("sortOrder", { valueAsNumber: true })}
              type="number"
              min={0}
              className={inputClass}
              placeholder="0"
            />
            <p className="text-stone-400 text-xs mt-1">Lower numbers appear first.</p>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              {...register("isActive")}
              type="checkbox"
              id="isActive"
              className="w-4 h-4 text-brand-purple-600 rounded border-stone-300 focus:ring-brand-purple-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-stone-700">
              Active (show on homepage)
            </label>
          </div>
        </div>
      </div>

      <div className="pb-8">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {mode === "create" ? "Create slide" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

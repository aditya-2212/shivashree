"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Save, Loader2, Upload, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

/*
  Generic content editor used by the per-page CMS screens (Home, About,
  Contact, Resources). Each screen passes a list of sections + fields; this
  component renders the inputs PRE-FILLED with the current site text so an
  editor can just change what they see. It saves only its own fields (a partial
  update) to /api/admin/settings, so different pages never clobber each other.
*/

export type ContentField =
  | {
      name: string;
      label: string;
      type: "text" | "textarea";
      default?: string;
      hint?: string;
      rows?: number;
      placeholder?: string;
    }
  | { name: string; label: string; type: "richtext"; default?: string; hint?: string }
  | { name: string; label: string; type: "image"; hint?: string };

export interface ContentSection {
  title: string;
  description?: string;
  fields: ContentField[];
}

interface Props {
  sections: ContentSection[];
  // The full SiteSettings row (mixed value types) — we read only string columns.
  initialData: Record<string, unknown> | null;
  successMessage?: string;
}

export default function ContentForm({ sections, initialData, successMessage }: Props) {
  const allFields = sections.flatMap((s) => s.fields);
  const textFields = allFields.filter((f) => f.type === "text" || f.type === "textarea");
  const richFields = allFields.filter((f) => f.type === "richtext");
  const imageFields = allFields.filter((f) => f.type === "image");

  const valueOf = (name: string, fallback = "") => {
    const v = initialData?.[name];
    return typeof v === "string" && v ? v : fallback;
  };

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [rich, setRich] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      richFields.map((f) => [f.name, valueOf(f.name, "default" in f ? f.default ?? "" : "")])
    )
  );
  const [images, setImages] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(
      imageFields.map((f) => {
        const v = initialData?.[f.name];
        return [f.name, typeof v === "string" ? v : null];
      })
    )
  );

  const { register, handleSubmit } = useForm<Record<string, string>>({
    defaultValues: Object.fromEntries(
      textFields.map((f) => [f.name, valueOf(f.name, "default" in f ? f.default ?? "" : "")])
    ),
  });

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(name);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages((prev) => ({ ...prev, [name]: data.url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const onSubmit = async (data: Record<string, string>) => {
    setSaving(true);
    try {
      const body = { ...data, ...rich, ...images };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error || `HTTP ${res.status}`);
      }
      toast.success(successMessage ?? "Saved! Changes are now live on the website.");
    } catch (err) {
      toast.error(
        `Failed to save: ${err instanceof Error ? err.message : "please try again."}`
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.title}
          className="bg-white rounded-xl border border-stone-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
            <h2 className="font-semibold text-stone-900 text-sm">{section.title}</h2>
            {section.description && (
              <p className="text-stone-400 text-xs mt-0.5">{section.description}</p>
            )}
          </div>
          <div className="p-6 space-y-4">
            {section.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  {field.label}
                </label>
                {field.hint && <p className="text-stone-400 text-xs mb-2">{field.hint}</p>}

                {field.type === "text" && (
                  <input
                    {...register(field.name)}
                    className={inputClass}
                    placeholder={field.placeholder}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    {...register(field.name)}
                    rows={field.rows ?? 3}
                    className={inputClass + " resize-none"}
                    placeholder={field.placeholder}
                  />
                )}

                {field.type === "richtext" && (
                  <RichTextEditor
                    value={rich[field.name] ?? ""}
                    onChange={(html) => setRich((prev) => ({ ...prev, [field.name]: html }))}
                    placeholder="Write here…"
                  />
                )}

                {field.type === "image" && (
                  <ImageField
                    name={field.name}
                    value={images[field.name] ?? null}
                    uploading={uploading === field.name}
                    onUpload={(e) => uploadImage(e, field.name)}
                    onClear={() => setImages((prev) => ({ ...prev, [field.name]: null }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pb-8">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </div>
    </form>
  );
}

function ImageField({
  value,
  uploading,
  onUpload,
  onClear,
}: {
  name: string;
  value: string | null;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return value ? (
    <div className="relative w-full max-w-xs rounded-xl overflow-hidden border border-stone-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt="" className="w-full h-36 object-cover" />
      <button
        type="button"
        onClick={onClear}
        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-red-700 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 hover:border-brand-purple-400 hover:text-brand-purple-600 transition text-sm cursor-pointer w-fit">
      <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
      Upload image
    </label>
  );
}

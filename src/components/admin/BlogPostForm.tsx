"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Upload, Loader2, Save, Eye, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { estimateReadTime } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  authorName: z.string().min(1, "Author name is required"),
  category: z.string().min(1, "Category is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BlogData {
  id?: number;
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  authorName: string;
  category: string;
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isPublished: boolean;
}

interface Props {
  mode: "create" | "edit";
  initialData?: BlogData;
}

const CATEGORIES = [
  "Real Estate",
  "Kumbakonam",
  "Chennai",
  "Home Buying Guide",
  "Local Life",
  "Investment",
  "Company News",
];

export default function BlogPostForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [body, setBody] = useState(initialData?.body ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(
    initialData?.coverImage ?? null
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      authorName: initialData?.authorName ?? "Shivashree Developers",
      category: initialData?.category ?? "Real Estate",
      seoTitle: initialData?.seoTitle ?? "",
      seoDescription: initialData?.seoDescription ?? "",
    },
  });

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCoverImage(data.url);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (formData: FormData, publish: boolean) => {
    if (!body || body === "<p></p>") {
      toast.error("Please write some content before saving.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug?.trim() || undefined,
        seoTitle: formData.seoTitle?.trim() || null,
        seoDescription: formData.seoDescription?.trim() || null,
        body,
        coverImage,
        readTimeMinutes: estimateReadTime(body),
        isPublished: publish,
        publishedAt: publish ? new Date().toISOString() : null,
      };

      const url =
        mode === "create"
          ? "/api/admin/blog"
          : `/api/admin/blog/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(publish ? "Post published!" : "Draft saved!");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please retry.");
    } finally {
      setSaving(false);
    }
  };

  const onSaveDraft = handleSubmit((d) => submit(d, false));
  const onPublish = handleSubmit((d) => submit(d, true));

  const inputClass =
    "w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <input
          {...register("title")}
          className="w-full text-2xl font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none border-b border-transparent focus:border-stone-200 pb-2 transition"
          placeholder="Post title…"
        />
        {errors.title && (
          <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Cover Image
        </label>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
        {coverImage ? (
          <div className="relative rounded-xl overflow-hidden border border-stone-200 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="bg-white text-stone-800 px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center gap-2 text-stone-400 hover:border-brand-purple-300 hover:text-brand-purple-500 transition"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
            <span className="text-sm font-medium">
              {uploading ? "Uploading…" : "Click to upload cover image"}
            </span>
          </button>
        )}
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Author Name
          </label>
          <input {...register("authorName")} className={inputClass} />
          {errors.authorName && (
            <p className="text-red-600 text-xs mt-1">
              {errors.authorName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Category
          </label>
          <select {...register("category")} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Excerpt{" "}
          <span className="text-stone-400 font-normal">
            (shown on blog listing page)
          </span>
        </label>
        <textarea
          {...register("excerpt")}
          rows={2}
          className={inputClass + " resize-none"}
          placeholder="A short summary of what this post is about…"
        />
        {errors.excerpt && (
          <p className="text-red-600 text-xs mt-1">{errors.excerpt.message}</p>
        )}
      </div>

      {/* SEO & URL */}
      <div className="border border-stone-200 rounded-xl p-4 space-y-4 bg-stone-50">
        <p className="text-xs font-bold text-brand-purple-700 uppercase tracking-wide">
          SEO &amp; URL
        </p>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Blog URL{" "}
            <span className="text-stone-400 font-normal">(slug)</span>
          </label>
          <div className="flex items-center rounded-lg border border-stone-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-brand-purple-500">
            <span className="pl-3 pr-1 text-stone-400 text-sm select-none whitespace-nowrap">
              /resources/blog/
            </span>
            <input
              {...register("slug")}
              className="flex-1 px-1 py-2.5 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none"
              placeholder="auto-generated-from-title"
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5 leading-snug">
            Leave blank to auto-generate from the title. Lowercase letters, numbers and
            hyphens only — anything else is cleaned up automatically.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Meta Title
          </label>
          <input
            {...register("seoTitle")}
            className={inputClass}
            placeholder="Defaults to the post title if left blank"
          />
          <p className="text-[11px] text-stone-500 mt-1.5 leading-snug">
            Shown in the browser tab and Google results. If empty, the post title is used.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Meta Description
          </label>
          <textarea
            {...register("seoDescription")}
            rows={2}
            className={inputClass + " resize-none"}
            placeholder="Defaults to the excerpt if left blank"
          />
          <p className="text-[11px] text-stone-500 mt-1.5 leading-snug">
            The grey snippet under the title in Google results. Aim for 150–160 characters.
            If empty, the excerpt is used.
          </p>
        </div>
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Post Content
        </label>
        <RichTextEditor
          value={body}
          onChange={setBody}
          placeholder="Start writing your post…"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 pb-8">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition disabled:opacity-60 text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-60 text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          Publish Post
        </button>
        <a
          href="/admin/blog"
          className="ml-auto text-sm text-stone-400 hover:text-stone-600 transition"
        >
          Cancel
        </a>
      </div>
    </div>
  );
}

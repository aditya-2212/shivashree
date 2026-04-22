"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";

const schema = z.object({
  corporateOfficeAddress: z.string().min(1, "Required"),
  corporateOfficeEmail: z.string().email("Invalid email"),
  corporateOfficePhone: z.string().min(1, "Required"),
  registeredOfficeAddress: z.string().min(1, "Required"),
  registeredOfficeTel: z.string().min(1, "Required"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number (digits only)"),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  // Google Maps "Embed a map" URL. Validated lightly — we accept either the
  // full <iframe …> snippet or the raw URL, and we extract just the URL on
  // submit so the footer can drop it directly into an iframe src.
  corporateMapEmbedUrl: z.string().optional(),
  footerText: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof schema>;

interface SiteSettingsData {
  corporateOfficeAddress: string;
  corporateOfficeEmail: string;
  corporateOfficePhone: string;
  registeredOfficeAddress: string;
  registeredOfficeTel: string;
  whatsappNumber: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  corporateMapEmbedUrl: string | null;
  footerText: string;
}

export default function SiteSettingsForm({ initialData }: { initialData: SiteSettingsData | null }) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      corporateOfficeAddress: initialData?.corporateOfficeAddress ?? "",
      corporateOfficeEmail: initialData?.corporateOfficeEmail ?? "",
      corporateOfficePhone: initialData?.corporateOfficePhone ?? "",
      registeredOfficeAddress: initialData?.registeredOfficeAddress ?? "",
      registeredOfficeTel: initialData?.registeredOfficeTel ?? "",
      whatsappNumber: initialData?.whatsappNumber ?? "",
      facebookUrl: initialData?.facebookUrl ?? "",
      instagramUrl: initialData?.instagramUrl ?? "",
      youtubeUrl: initialData?.youtubeUrl ?? "",
      corporateMapEmbedUrl: initialData?.corporateMapEmbedUrl ?? "",
      footerText: initialData?.footerText ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // If the admin pasted the entire <iframe …> snippet from Google Maps,
      // pull just the src URL out of it. This forgives a common mistake.
      const cleaned = { ...data };
      if (cleaned.corporateMapEmbedUrl) {
        const match = cleaned.corporateMapEmbedUrl.match(/src=["']([^"']+)["']/);
        if (match) cleaned.corporateMapEmbedUrl = match[1];
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved! Changes are now live on the website.");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition";
  const textareaClass = inputClass + " resize-none";

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
        <h2 className="font-semibold text-stone-900 text-sm">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Corporate Office */}
      <Section title="Corporate Office (Chennai)">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Address</label>
          <textarea {...register("corporateOfficeAddress")} rows={3} className={textareaClass} />
          {errors.corporateOfficeAddress && <p className="text-red-600 text-xs mt-1">{errors.corporateOfficeAddress.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
            <input {...register("corporateOfficeEmail")} type="email" className={inputClass} />
            {errors.corporateOfficeEmail && <p className="text-red-600 text-xs mt-1">{errors.corporateOfficeEmail.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
            <input {...register("corporateOfficePhone")} className={inputClass} />
            {errors.corporateOfficePhone && <p className="text-red-600 text-xs mt-1">{errors.corporateOfficePhone.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Google Maps embed URL
          </label>
          <p className="text-stone-500 text-xs mb-2 leading-relaxed">
            Open Google Maps → search the office → click <em>Share</em> → switch
            to the <strong>Embed a map</strong> tab → click <em>Copy HTML</em>.
            You can paste either the full <code className="bg-stone-100 px-1 rounded">&lt;iframe …&gt;</code>{" "}
            snippet or just the URL — we&apos;ll extract the right piece. The
            map appears under the corporate address in the website footer.
          </p>
          <textarea
            {...register("corporateMapEmbedUrl")}
            rows={3}
            className={textareaClass}
            placeholder='<iframe src="https://www.google.com/maps/embed?pb=…"></iframe>'
          />
        </div>
      </Section>

      {/* Registered Office */}
      <Section title="Registered Office (Kumbakonam)">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Address</label>
          <textarea {...register("registeredOfficeAddress")} rows={2} className={textareaClass} />
          {errors.registeredOfficeAddress && <p className="text-red-600 text-xs mt-1">{errors.registeredOfficeAddress.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Telephone</label>
          <input {...register("registeredOfficeTel")} className={inputClass} />
        </div>
      </Section>

      {/* WhatsApp */}
      <Section title="WhatsApp Button">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            WhatsApp Number
          </label>
          <p className="text-stone-400 text-xs mb-2">
            Enter digits only, including country code. Example: 919876543210 (for +91 9876543210)
          </p>
          <input {...register("whatsappNumber")} className={inputClass} placeholder="919876543210" />
          {errors.whatsappNumber && <p className="text-red-600 text-xs mt-1">{errors.whatsappNumber.message}</p>}
        </div>
      </Section>

      {/* Social Links */}
      <Section title="Social Media Links">
        {[
          { key: "facebookUrl" as const, label: "Facebook URL" },
          { key: "instagramUrl" as const, label: "Instagram URL" },
          { key: "youtubeUrl" as const, label: "YouTube URL" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
            <input {...register(key)} className={inputClass} placeholder="https://" />
          </div>
        ))}
      </Section>

      {/* Footer Text */}
      <Section title="Footer Text">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Footer tagline / copyright text
          </label>
          <input {...register("footerText")} className={inputClass} />
          {errors.footerText && <p className="text-red-600 text-xs mt-1">{errors.footerText.message}</p>}
        </div>
      </Section>

      <div className="pb-8">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>
    </form>
  );
}

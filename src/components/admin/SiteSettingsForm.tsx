"use client";

import type { SiteSettings } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";

/*
  Global site details only — the office addresses, contact channels, social
  links and footer that are shared across every page. Per-page copy (Home,
  About, Contact, Resources) is edited under "Page content" in the sidebar.
*/

const schema = z.object({
  corporateOfficeAddress: z.string().min(1, "Required"),
  corporateOfficeEmail: z.string().email("Invalid email"),
  corporateOfficePhone: z.string().min(1, "Required"),
  enquiryRecipientEmail: z.string().optional(),
  corporateMapEmbedUrl: z.string().optional(),
  registeredOfficeAddress: z.string().min(1, "Required"),
  registeredOfficeTel: z.string().min(1, "Required"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number (digits only)"),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  footerText: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof schema>;

export default function SiteSettingsForm({ initialData }: { initialData: SiteSettings | null }) {
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
      enquiryRecipientEmail: initialData?.enquiryRecipientEmail ?? "",
      corporateMapEmbedUrl: initialData?.corporateMapEmbedUrl ?? "",
      registeredOfficeAddress: initialData?.registeredOfficeAddress ?? "",
      registeredOfficeTel: initialData?.registeredOfficeTel ?? "",
      whatsappNumber: initialData?.whatsappNumber ?? "",
      facebookUrl: initialData?.facebookUrl ?? "",
      instagramUrl: initialData?.instagramUrl ?? "",
      youtubeUrl: initialData?.youtubeUrl ?? "",
      footerText: initialData?.footerText ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const cleaned = { ...data };
      // Accept either a full <iframe …> snippet or a bare URL for the map.
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

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
        <h2 className="font-semibold text-stone-900 text-sm">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );

  const Field = ({
    label,
    hint,
    error,
    children,
  }: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {hint && <p className="text-stone-400 text-xs mb-2">{hint}</p>}
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Section title="Corporate Office (Chennai)">
        <Field label="Address" error={errors.corporateOfficeAddress?.message}>
          <textarea {...register("corporateOfficeAddress")} rows={3} className={textareaClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" error={errors.corporateOfficeEmail?.message}>
            <input {...register("corporateOfficeEmail")} type="email" className={inputClass} />
          </Field>
          <Field label="Phone" error={errors.corporateOfficePhone?.message}>
            <input {...register("corporateOfficePhone")} className={inputClass} />
          </Field>
        </div>
        <Field
          label="Google Maps embed URL"
          hint="Open Google Maps → search the office → Share → Embed a map → Copy HTML. Paste the full <iframe …> snippet or just the URL — we'll extract the right piece."
        >
          <textarea
            {...register("corporateMapEmbedUrl")}
            rows={3}
            className={textareaClass}
            placeholder='<iframe src="https://www.google.com/maps/embed?pb=…"></iframe>'
          />
        </Field>
      </Section>

      <Section title="Registered Office (Kumbakonam)">
        <Field label="Address" error={errors.registeredOfficeAddress?.message}>
          <textarea {...register("registeredOfficeAddress")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Telephone" error={errors.registeredOfficeTel?.message}>
          <input {...register("registeredOfficeTel")} className={inputClass} />
        </Field>
      </Section>

      <Section title="Enquiry notifications">
        <Field
          label="Enquiry email recipient"
          hint="Where Contact-page enquiry form submissions are emailed. Leave blank to use the site default."
          error={errors.enquiryRecipientEmail?.message}
        >
          <input
            {...register("enquiryRecipientEmail")}
            type="email"
            className={inputClass}
            placeholder="finance@shivashreedevelopers.com"
          />
        </Field>
      </Section>

      <Section title="WhatsApp Button">
        <Field
          label="WhatsApp Number"
          hint="Digits only, including country code. e.g. 919876543210 for +91 9876543210"
          error={errors.whatsappNumber?.message}
        >
          <input {...register("whatsappNumber")} className={inputClass} placeholder="919876543210" />
        </Field>
      </Section>

      <Section title="Social Media Links">
        {(
          [
            { key: "facebookUrl" as const, label: "Facebook URL" },
            { key: "instagramUrl" as const, label: "Instagram URL" },
            { key: "youtubeUrl" as const, label: "YouTube URL" },
          ] as const
        ).map(({ key, label }) => (
          <Field key={key} label={label}>
            <input {...register(key)} className={inputClass} placeholder="https://" />
          </Field>
        ))}
      </Section>

      <Section title="Footer Text">
        <Field label="Footer tagline / copyright text" error={errors.footerText?.message}>
          <input {...register("footerText")} className={inputClass} />
        </Field>
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

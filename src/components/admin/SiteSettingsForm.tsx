"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

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
  corporateMapEmbedUrl: z.string().optional(),
  footerText: z.string().min(1, "Required"),
  // Contact page
  contactHeroEyebrow: z.string().optional(),
  contactHeroTitle: z.string().optional(),
  contactHeroIntro: z.string().optional(),
  contactCorporateLabel: z.string().optional(),
  contactRegisteredLabel: z.string().optional(),
  contactHoursTitle: z.string().optional(),
  contactHoursWeekdays: z.string().optional(),
  contactHoursSunday: z.string().optional(),
  contactHoursNote: z.string().optional(),
  contactFormTitle: z.string().optional(),
  contactFormIntro: z.string().optional(),
  // About page
  aboutHeroEyebrow: z.string().optional(),
  aboutHeroTitle: z.string().optional(),
  aboutHeroLead: z.string().optional(),
  aboutStoryTitle: z.string().optional(),
  aboutCommitmentsTitle: z.string().optional(),
  aboutC1Title: z.string().optional(),
  aboutC1Body: z.string().optional(),
  aboutC2Title: z.string().optional(),
  aboutC2Body: z.string().optional(),
  aboutC3Title: z.string().optional(),
  aboutC3Body: z.string().optional(),
  aboutWhereTitle: z.string().optional(),
  aboutWhereIntro: z.string().optional(),
  aboutCtaTitle: z.string().optional(),
  aboutCtaBody: z.string().optional(),
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
  contactHeroEyebrow: string | null;
  contactHeroTitle: string | null;
  contactHeroIntro: string | null;
  contactCorporateLabel: string | null;
  contactRegisteredLabel: string | null;
  contactHoursTitle: string | null;
  contactHoursWeekdays: string | null;
  contactHoursSunday: string | null;
  contactHoursNote: string | null;
  contactFormTitle: string | null;
  contactFormIntro: string | null;
  aboutHeroEyebrow: string | null;
  aboutHeroTitle: string | null;
  aboutHeroLead: string | null;
  aboutStoryTitle: string | null;
  aboutStoryBodyHtml: string | null;
  aboutCommitmentsTitle: string | null;
  aboutC1Title: string | null;
  aboutC1Body: string | null;
  aboutC2Title: string | null;
  aboutC2Body: string | null;
  aboutC3Title: string | null;
  aboutC3Body: string | null;
  aboutWhereTitle: string | null;
  aboutWhereIntro: string | null;
  aboutCtaTitle: string | null;
  aboutCtaBody: string | null;
}

export default function SiteSettingsForm({ initialData }: { initialData: SiteSettingsData | null }) {
  const [saving, setSaving] = useState(false);
  const [aboutStoryBodyHtml, setAboutStoryBodyHtml] = useState(
    initialData?.aboutStoryBodyHtml ?? ""
  );

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
      contactHeroEyebrow: initialData?.contactHeroEyebrow ?? "",
      contactHeroTitle: initialData?.contactHeroTitle ?? "",
      contactHeroIntro: initialData?.contactHeroIntro ?? "",
      contactCorporateLabel: initialData?.contactCorporateLabel ?? "",
      contactRegisteredLabel: initialData?.contactRegisteredLabel ?? "",
      contactHoursTitle: initialData?.contactHoursTitle ?? "",
      contactHoursWeekdays: initialData?.contactHoursWeekdays ?? "",
      contactHoursSunday: initialData?.contactHoursSunday ?? "",
      contactHoursNote: initialData?.contactHoursNote ?? "",
      contactFormTitle: initialData?.contactFormTitle ?? "",
      contactFormIntro: initialData?.contactFormIntro ?? "",
      aboutHeroEyebrow: initialData?.aboutHeroEyebrow ?? "",
      aboutHeroTitle: initialData?.aboutHeroTitle ?? "",
      aboutHeroLead: initialData?.aboutHeroLead ?? "",
      aboutStoryTitle: initialData?.aboutStoryTitle ?? "",
      aboutCommitmentsTitle: initialData?.aboutCommitmentsTitle ?? "",
      aboutC1Title: initialData?.aboutC1Title ?? "",
      aboutC1Body: initialData?.aboutC1Body ?? "",
      aboutC2Title: initialData?.aboutC2Title ?? "",
      aboutC2Body: initialData?.aboutC2Body ?? "",
      aboutC3Title: initialData?.aboutC3Title ?? "",
      aboutC3Body: initialData?.aboutC3Body ?? "",
      aboutWhereTitle: initialData?.aboutWhereTitle ?? "",
      aboutWhereIntro: initialData?.aboutWhereIntro ?? "",
      aboutCtaTitle: initialData?.aboutCtaTitle ?? "",
      aboutCtaBody: initialData?.aboutCtaBody ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const cleaned = { ...data, aboutStoryBodyHtml };
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
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
        <h2 className="font-semibold text-stone-900 text-sm">{title}</h2>
        {description && <p className="text-stone-400 text-xs mt-0.5">{description}</p>}
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
      {/* ── Corporate Office ─────────────────────────────────────────────── */}
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

      {/* ── Registered Office ────────────────────────────────────────────── */}
      <Section title="Registered Office (Kumbakonam)">
        <Field label="Address" error={errors.registeredOfficeAddress?.message}>
          <textarea {...register("registeredOfficeAddress")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Telephone">
          <input {...register("registeredOfficeTel")} className={inputClass} />
        </Field>
      </Section>

      {/* ── WhatsApp ─────────────────────────────────────────────────────── */}
      <Section title="WhatsApp Button">
        <Field
          label="WhatsApp Number"
          hint="Digits only, including country code. e.g. 919876543210 for +91 9876543210"
          error={errors.whatsappNumber?.message}
        >
          <input {...register("whatsappNumber")} className={inputClass} placeholder="919876543210" />
        </Field>
      </Section>

      {/* ── Social Links ─────────────────────────────────────────────────── */}
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

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Section title="Footer Text">
        <Field label="Footer tagline / copyright text" error={errors.footerText?.message}>
          <input {...register("footerText")} className={inputClass} />
        </Field>
      </Section>

      {/* ── Contact page ─────────────────────────────────────────────────── */}
      <Section
        title="Contact page — hero"
        description="Controls the purple header section at the top of /contact. Leave blank to use the built-in default text."
      >
        <Field label="Eyebrow" hint='Small label above the title, e.g. "Contact"'>
          <input
            {...register("contactHeroEyebrow")}
            className={inputClass}
            placeholder="Contact"
          />
        </Field>
        <Field label="Page title">
          <input
            {...register("contactHeroTitle")}
            className={inputClass}
            placeholder="Two offices, one team, real phones."
          />
        </Field>
        <Field label="Intro paragraph">
          <textarea
            {...register("contactHeroIntro")}
            rows={3}
            className={textareaClass}
            placeholder="Walk in, call, or fill in the form…"
          />
        </Field>
      </Section>

      <Section
        title="Contact page — sections"
        description="Labels and copy for the office cards, hours box, and enquiry form."
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Corporate office card label">
            <input
              {...register("contactCorporateLabel")}
              className={inputClass}
              placeholder="Corporate office — Chennai"
            />
          </Field>
          <Field label="Registered office card label">
            <input
              {...register("contactRegisteredLabel")}
              className={inputClass}
              placeholder="Registered office — Kumbakonam"
            />
          </Field>
        </div>
        <Field label="Office hours box title">
          <input
            {...register("contactHoursTitle")}
            className={inputClass}
            placeholder="When we're in office"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Weekdays line"
            hint='e.g. "Monday – Saturday · 9:00am – 6:00pm"'
          >
            <input
              {...register("contactHoursWeekdays")}
              className={inputClass}
              placeholder="Monday – Saturday · 9:00am – 6:00pm"
            />
          </Field>
          <Field
            label="Sunday line"
            hint='e.g. "Sunday · 10:00am – 2:00pm"'
          >
            <input
              {...register("contactHoursSunday")}
              className={inputClass}
              placeholder="Sunday · 10:00am – 2:00pm"
            />
          </Field>
        </div>
        <Field label="Hours note (small text below)">
          <textarea
            {...register("contactHoursNote")}
            rows={2}
            className={textareaClass}
            placeholder="Site visits on Sunday are by prior appointment only…"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Enquiry form title">
            <input
              {...register("contactFormTitle")}
              className={inputClass}
              placeholder="Send us an enquiry"
            />
          </Field>
        </div>
        <Field label="Enquiry form intro">
          <textarea
            {...register("contactFormIntro")}
            rows={2}
            className={textareaClass}
            placeholder="Two fields are required — your name and your number…"
          />
        </Field>
      </Section>

      {/* ── About page ───────────────────────────────────────────────────── */}
      <Section
        title="About page — hero"
        description="Controls the purple header section at the top of /about. Leave blank to use the built-in default text."
      >
        <Field label="Eyebrow">
          <input
            {...register("aboutHeroEyebrow")}
            className={inputClass}
            placeholder="About Shivashree Developers"
          />
        </Field>
        <Field label="Page title" hint="Use a new line (Enter) to create a line break in the heading.">
          <textarea
            {...register("aboutHeroTitle")}
            rows={2}
            className={textareaClass}
            placeholder={"A Kumbakonam builder.\nNow also in Chennai."}
          />
        </Field>
        <Field label="Lead paragraph">
          <textarea
            {...register("aboutHeroLead")}
            rows={3}
            className={textareaClass}
            placeholder="We started in 2000 with a small G+3 in Kumbakonam…"
          />
        </Field>
      </Section>

      <Section
        title="About page — story section"
        description='The prose body under "Why we still build only here." Supports rich text (bold, italic, links, etc.).'
      >
        <Field label="Section title">
          <input
            {...register("aboutStoryTitle")}
            className={inputClass}
            placeholder="Why we still build only here."
          />
        </Field>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Story body
          </label>
          <RichTextEditor
            value={aboutStoryBodyHtml}
            onChange={setAboutStoryBodyHtml}
            placeholder="Tell the company story here…"
          />
        </div>
      </Section>

      <Section
        title="About page — commitments"
        description='The three numbered items under "What you can hold us to."'
      >
        <Field label="Section title">
          <input
            {...register("aboutCommitmentsTitle")}
            className={inputClass}
            placeholder="What you can hold us to."
          />
        </Field>
        {(
          [
            { t: "aboutC1Title" as const, b: "aboutC1Body" as const, n: "01" },
            { t: "aboutC2Title" as const, b: "aboutC2Body" as const, n: "02" },
            { t: "aboutC3Title" as const, b: "aboutC3Body" as const, n: "03" },
          ]
        ).map(({ t, b, n }) => (
          <div key={n} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-bold text-brand-purple-700">{n}</p>
            <Field label="Commitment title">
              <input {...register(t)} className={inputClass} />
            </Field>
            <Field label="Commitment body">
              <textarea {...register(b)} rows={3} className={textareaClass} />
            </Field>
          </div>
        ))}
      </Section>

      <Section
        title="About page — where to find us"
        description='The office address section. Addresses come from the Corporate/Registered Office fields above.'
      >
        <Field label="Section title">
          <input
            {...register("aboutWhereTitle")}
            className={inputClass}
            placeholder="Where to find us in person."
          />
        </Field>
        <Field label="Section intro">
          <textarea
            {...register("aboutWhereIntro")}
            rows={2}
            className={textareaClass}
            placeholder="We'd much rather you walked in than filled in a form…"
          />
        </Field>
      </Section>

      <Section
        title="About page — CTA section"
        description="The dark purple CTA block at the bottom of the About page."
      >
        <Field label="CTA heading">
          <input
            {...register("aboutCtaTitle")}
            className={inputClass}
            placeholder="Tell us what you're looking for."
          />
        </Field>
        <Field label="CTA body text">
          <textarea
            {...register("aboutCtaBody")}
            rows={3}
            className={textareaClass}
            placeholder="Whether you're a first-time buyer, an NRI investor…"
          />
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

"use client";

import { useForm, type UseFormRegister, type FieldErrors, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Save, Loader2, Upload, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import GlobalSiteCopyFields from "./GlobalSiteCopyFields";
import { globalSiteCopySchema } from "./site-settings-global-copy-schema";
import { globalSiteCopyDefaultValues, parseGlobalJsonFromForm } from "./global-site-copy-default-values";
import {
  contactPageDefaults,
  homePageDefaults,
  aboutPageDefaults,
  withSiteDefault,
} from "@/lib/site-defaults";
import type { SiteSettings } from "@prisma/client";

const baseSchema = z.object({
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
  // Homepage
  homeProjectsEyebrow: z.string().optional(),
  homeProjectsHeading: z.string().optional(),
  homeProjectsSubheading: z.string().optional(),
  homeWhyEyebrow: z.string().optional(),
  homeWhyHeading: z.string().optional(),
  homeCard1Title: z.string().optional(),
  homeCard1Body: z.string().optional(),
  homeCard2Title: z.string().optional(),
  homeCard2Body: z.string().optional(),
  homeCard3Title: z.string().optional(),
  homeCard3Body: z.string().optional(),
  homeCtaEyebrow: z.string().optional(),
  homeCtaHeading: z.string().optional(),
  homeCtaBody: z.string().optional(),
});

const schema = baseSchema.merge(globalSiteCopySchema);

type FormData = z.infer<typeof schema>;

type SiteSettingsData = SiteSettings;

export default function SiteSettingsForm({ initialData }: { initialData: SiteSettingsData | null }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [aboutStoryBodyHtml, setAboutStoryBodyHtml] = useState(
    initialData?.aboutStoryBodyHtml ?? ""
  );
  const [card1Image, setCard1Image] = useState<string | null>(initialData?.homeCard1Image ?? null);
  const [card2Image, setCard2Image] = useState<string | null>(initialData?.homeCard2Image ?? null);
  const [card3Image, setCard3Image] = useState<string | null>(initialData?.homeCard3Image ?? null);
  const card1Ref = useRef<HTMLInputElement>(null);
  const card2Ref = useRef<HTMLInputElement>(null);
  const card3Ref = useRef<HTMLInputElement>(null);

  const handleCardImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: "1" | "2" | "3"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(slot);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (slot === "1") setCard1Image(data.url);
      else if (slot === "2") setCard2Image(data.url);
      else setCard3Image(data.url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

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
      footerText: withSiteDefault(
        initialData?.footerText,
        "Shivashree Developers. All rights reserved."
      ),
      contactHeroEyebrow: withSiteDefault(
        initialData?.contactHeroEyebrow,
        contactPageDefaults.heroEyebrow
      ),
      contactHeroTitle: withSiteDefault(
        initialData?.contactHeroTitle,
        contactPageDefaults.heroTitle
      ),
      contactHeroIntro: withSiteDefault(
        initialData?.contactHeroIntro,
        contactPageDefaults.heroIntro
      ),
      contactCorporateLabel: withSiteDefault(
        initialData?.contactCorporateLabel,
        contactPageDefaults.corporateLabel
      ),
      contactRegisteredLabel: withSiteDefault(
        initialData?.contactRegisteredLabel,
        contactPageDefaults.registeredLabel
      ),
      contactHoursTitle: withSiteDefault(
        initialData?.contactHoursTitle,
        contactPageDefaults.hoursTitle
      ),
      contactHoursWeekdays: withSiteDefault(
        initialData?.contactHoursWeekdays,
        contactPageDefaults.hoursWeekdays
      ),
      contactHoursSunday: withSiteDefault(
        initialData?.contactHoursSunday,
        contactPageDefaults.hoursSunday
      ),
      contactHoursNote: withSiteDefault(
        initialData?.contactHoursNote,
        contactPageDefaults.hoursNote
      ),
      contactFormTitle: withSiteDefault(
        initialData?.contactFormTitle,
        contactPageDefaults.formTitle
      ),
      contactFormIntro: withSiteDefault(
        initialData?.contactFormIntro,
        contactPageDefaults.formIntro
      ),
      aboutHeroEyebrow: withSiteDefault(
        initialData?.aboutHeroEyebrow,
        aboutPageDefaults.heroEyebrow
      ),
      aboutHeroTitle: withSiteDefault(initialData?.aboutHeroTitle, aboutPageDefaults.heroTitle),
      aboutHeroLead: withSiteDefault(initialData?.aboutHeroLead, aboutPageDefaults.heroLead),
      aboutStoryTitle: initialData?.aboutStoryTitle?.trim() ?? "",
      aboutCommitmentsTitle: withSiteDefault(
        initialData?.aboutCommitmentsTitle,
        aboutPageDefaults.commitmentsTitle
      ),
      aboutC1Title: withSiteDefault(initialData?.aboutC1Title, aboutPageDefaults.c1Title),
      aboutC1Body: withSiteDefault(initialData?.aboutC1Body, aboutPageDefaults.c1Body),
      aboutC2Title: withSiteDefault(initialData?.aboutC2Title, aboutPageDefaults.c2Title),
      aboutC2Body: withSiteDefault(initialData?.aboutC2Body, aboutPageDefaults.c2Body),
      aboutC3Title: withSiteDefault(initialData?.aboutC3Title, aboutPageDefaults.c3Title),
      aboutC3Body: withSiteDefault(initialData?.aboutC3Body, aboutPageDefaults.c3Body),
      aboutWhereTitle: withSiteDefault(initialData?.aboutWhereTitle, aboutPageDefaults.whereTitle),
      aboutWhereIntro: withSiteDefault(initialData?.aboutWhereIntro, aboutPageDefaults.whereIntro),
      aboutCtaTitle: withSiteDefault(initialData?.aboutCtaTitle, aboutPageDefaults.ctaTitle),
      aboutCtaBody: withSiteDefault(initialData?.aboutCtaBody, aboutPageDefaults.ctaBody),
      homeProjectsEyebrow: withSiteDefault(
        initialData?.homeProjectsEyebrow,
        homePageDefaults.projectsEyebrow
      ),
      homeProjectsHeading: withSiteDefault(
        initialData?.homeProjectsHeading,
        homePageDefaults.projectsHeading
      ),
      homeProjectsSubheading: withSiteDefault(
        initialData?.homeProjectsSubheading,
        homePageDefaults.projectsSubheading
      ),
      homeWhyEyebrow: withSiteDefault(initialData?.homeWhyEyebrow, homePageDefaults.whyEyebrow),
      homeWhyHeading: withSiteDefault(initialData?.homeWhyHeading, homePageDefaults.whyHeading),
      homeCard1Title: withSiteDefault(initialData?.homeCard1Title, homePageDefaults.card1Title),
      homeCard1Body: withSiteDefault(initialData?.homeCard1Body, homePageDefaults.card1Body),
      homeCard2Title: withSiteDefault(initialData?.homeCard2Title, homePageDefaults.card2Title),
      homeCard2Body: withSiteDefault(initialData?.homeCard2Body, homePageDefaults.card2Body),
      homeCard3Title: withSiteDefault(initialData?.homeCard3Title, homePageDefaults.card3Title),
      homeCard3Body: withSiteDefault(initialData?.homeCard3Body, homePageDefaults.card3Body),
      homeCtaEyebrow: withSiteDefault(initialData?.homeCtaEyebrow, homePageDefaults.ctaEyebrow),
      homeCtaHeading: withSiteDefault(initialData?.homeCtaHeading, homePageDefaults.ctaHeading),
      homeCtaBody: withSiteDefault(initialData?.homeCtaBody, homePageDefaults.ctaBody),
      ...globalSiteCopyDefaultValues(initialData),
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      let cleaned: Record<string, unknown> = {
        ...data,
        aboutStoryBodyHtml,
        homeCard1Image: card1Image,
        homeCard2Image: card2Image,
        homeCard3Image: card3Image,
      };
      if (typeof cleaned.corporateMapEmbedUrl === "string" && cleaned.corporateMapEmbedUrl) {
        const match = cleaned.corporateMapEmbedUrl.match(/src=["']([^"']+)["']/);
        if (match) cleaned.corporateMapEmbedUrl = match[1];
      }
      try {
        cleaned = parseGlobalJsonFromForm(cleaned);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Invalid JSON in one of the global fields.");
        setSaving(false);
        return;
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

  const ImageSlot = ({
    label,
    hint,
    value,
    onUpload,
    onClear,
    slotId,
    inputRef,
  }: {
    label: string;
    hint?: string;
    value: string | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    slotId: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {hint && <p className="text-stone-600 text-xs mb-2">{hint}</p>}
      <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      {value ? (
        <div className="relative w-full max-w-xs rounded-xl overflow-hidden border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-36 object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-red-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading === slotId}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 hover:border-brand-purple-400 hover:text-brand-purple-600 transition text-sm disabled:opacity-60"
        >
          {uploading === slotId ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Upload image
        </button>
      )}
    </div>
  );

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
        {description && <p className="text-stone-600 text-xs mt-0.5">{description}</p>}
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
      {hint && <p className="text-stone-700 text-xs mb-2">{hint}</p>}
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
      <Section title="Contact page — hero" description="Purple header at the top of /contact.">
        <Field label="Eyebrow">
          <input {...register("contactHeroEyebrow")} className={inputClass} />
        </Field>
        <Field label="Page title">
          <textarea {...register("contactHeroTitle")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Intro paragraph">
          <textarea {...register("contactHeroIntro")} rows={4} className={textareaClass} />
        </Field>
      </Section>

      <Section
        title="Contact page — offices, hours, enquiry"
        description="Office card labels, hours copy, and enquiry form heading and intro."
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Corporate office card label">
            <input {...register("contactCorporateLabel")} className={inputClass} />
          </Field>
          <Field label="Registered office card label">
            <input {...register("contactRegisteredLabel")} className={inputClass} />
          </Field>
        </div>
        <Field label="Office hours box title">
          <input {...register("contactHoursTitle")} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Weekdays line">
            <input {...register("contactHoursWeekdays")} className={inputClass} />
          </Field>
          <Field label="Sunday line">
            <input {...register("contactHoursSunday")} className={inputClass} />
          </Field>
        </div>
        <Field label="Hours note (small text below)">
          <textarea {...register("contactHoursNote")} rows={3} className={textareaClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Enquiry form title">
            <input {...register("contactFormTitle")} className={inputClass} />
          </Field>
        </div>
        <Field label="Enquiry form intro">
          <textarea {...register("contactFormIntro")} rows={3} className={textareaClass} />
        </Field>
      </Section>

      {/* ── About page ───────────────────────────────────────────────────── */}
      <Section title="About page — hero" description="Purple header at the top of /about.">
        <Field label="Eyebrow">
          <input {...register("aboutHeroEyebrow")} className={inputClass} />
        </Field>
        <Field label="Page title">
          <textarea {...register("aboutHeroTitle")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Lead paragraph">
          <textarea {...register("aboutHeroLead")} rows={5} className={textareaClass} />
        </Field>
      </Section>

      <Section
        title="About page — story"
        description="Shown on /about only when you save a title and/or body. Vision, mission, process, and quality blocks are edited under Global site copy below."
      >
        <Field label="Section title">
          <input {...register("aboutStoryTitle")} className={inputClass} />
        </Field>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Story body</label>
          <RichTextEditor
            value={aboutStoryBodyHtml}
            onChange={setAboutStoryBodyHtml}
            placeholder=""
          />
        </div>
      </Section>

      <Section
        title="About page — commitments"
        description="Three numbered cards on /about (after the story block when it is visible)."
      >
        <Field label="Section title">
          <input {...register("aboutCommitmentsTitle")} className={inputClass} />
        </Field>
        {(
          [
            { t: "aboutC1Title" as const, b: "aboutC1Body" as const, n: "01" },
            { t: "aboutC2Title" as const, b: "aboutC2Body" as const, n: "02" },
            { t: "aboutC3Title" as const, b: "aboutC3Body" as const, n: "03" },
          ] as const
        ).map(({ t, b, n }) => (
          <div key={n} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-bold text-brand-purple-700">{n}</p>
            <Field label="Commitment title">
              <input {...register(t)} className={inputClass} />
            </Field>
            <Field label="Commitment body">
              <textarea {...register(b)} rows={4} className={textareaClass} />
            </Field>
          </div>
        ))}
      </Section>

      <Section
        title="About page — where to find us"
        description="Heading and intro above the office cards. Addresses come from Corporate and Registered Office above."
      >
        <Field label="Section title">
          <input {...register("aboutWhereTitle")} className={inputClass} />
        </Field>
        <Field label="Section intro">
          <textarea {...register("aboutWhereIntro")} rows={3} className={textareaClass} />
        </Field>
      </Section>

      <Section title="About page — CTA" description="Dark block at the bottom of /about with enquiry form.">
        <Field label="CTA heading">
          <input {...register("aboutCtaTitle")} className={inputClass} />
        </Field>
        <Field label="CTA body text">
          <textarea {...register("aboutCtaBody")} rows={4} className={textareaClass} />
        </Field>
      </Section>

      {/* ── Homepage — projects section ──────────────────────────────────── */}
      <Section
        title="Homepage — projects section"
        description="Eyebrow, heading, and intro above the project cards on the homepage."
      >
        <Field label="Eyebrow">
          <input {...register("homeProjectsEyebrow")} className={inputClass} />
        </Field>
        <Field label="Heading">
          <textarea {...register("homeProjectsHeading")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Subheading / intro paragraph">
          <textarea {...register("homeProjectsSubheading")} rows={4} className={textareaClass} />
        </Field>
      </Section>

      {/* ── Homepage — Why Us section ────────────────────────────────────── */}
      <Section
        title='Homepage — "Why Us?" section'
        description="Eyebrow, section heading, and three cards (title, body, image each)."
      >
        <Field label="Section eyebrow">
          <input {...register("homeWhyEyebrow")} className={inputClass} />
        </Field>
        <Field label="Section heading">
          <input {...register("homeWhyHeading")} className={inputClass} />
        </Field>

        {/* Card 1 */}
        <div className="border border-stone-200 rounded-xl p-4 space-y-4 bg-stone-50">
          <p className="text-xs font-bold text-brand-purple-700 uppercase tracking-wide">Card 1</p>
          <Field label="Title">
            <input {...register("homeCard1Title")} className={inputClass} />
          </Field>
          <Field label="Body text">
            <textarea {...register("homeCard1Body")} rows={4} className={textareaClass} />
          </Field>
          <ImageSlot
            label="Card image"
            hint="Landscape, at least 800×500 px."
            value={card1Image}
            onUpload={(e) => handleCardImageUpload(e, "1")}
            onClear={() => setCard1Image(null)}
            slotId="1"
            inputRef={card1Ref}
          />
        </div>

        {/* Card 2 */}
        <div className="border border-stone-200 rounded-xl p-4 space-y-4 bg-stone-50">
          <p className="text-xs font-bold text-brand-purple-700 uppercase tracking-wide">Card 2</p>
          <Field label="Title">
            <input {...register("homeCard2Title")} className={inputClass} />
          </Field>
          <Field label="Body text">
            <textarea {...register("homeCard2Body")} rows={4} className={textareaClass} />
          </Field>
          <ImageSlot
            label="Card image"
            hint="Landscape, at least 800×500 px."
            value={card2Image}
            onUpload={(e) => handleCardImageUpload(e, "2")}
            onClear={() => setCard2Image(null)}
            slotId="2"
            inputRef={card2Ref}
          />
        </div>

        {/* Card 3 */}
        <div className="border border-stone-200 rounded-xl p-4 space-y-4 bg-stone-50">
          <p className="text-xs font-bold text-brand-purple-700 uppercase tracking-wide">Card 3</p>
          <Field label="Title">
            <input {...register("homeCard3Title")} className={inputClass} />
          </Field>
          <Field label="Body text">
            <textarea {...register("homeCard3Body")} rows={4} className={textareaClass} />
          </Field>
          <ImageSlot
            label="Card image"
            hint="Landscape, at least 800×500 px."
            value={card3Image}
            onUpload={(e) => handleCardImageUpload(e, "3")}
            onClear={() => setCard3Image(null)}
            slotId="3"
            inputRef={card3Ref}
          />
        </div>
      </Section>

      {/* ── Homepage — CTA section ───────────────────────────────────────── */}
      <Section title="Homepage — CTA / enquiry" description="Dark section with enquiry form at the bottom of the homepage.">
        <Field label="Eyebrow">
          <input {...register("homeCtaEyebrow")} className={inputClass} />
        </Field>
        <Field label="Heading">
          <input {...register("homeCtaHeading")} className={inputClass} />
        </Field>
        <Field label="Body text">
          <textarea {...register("homeCtaBody")} rows={4} className={textareaClass} />
        </Field>
      </Section>

      <GlobalSiteCopyFields
        register={register as unknown as UseFormRegister<FieldValues>}
        errors={errors as unknown as FieldErrors<FieldValues>}
        inputClass={inputClass}
        textareaClass={textareaClass}
      />

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

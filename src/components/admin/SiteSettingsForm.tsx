"use client";

import type { SiteSettings } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Save, Loader2, Upload, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import {
  contactPageDefaults,
  homePageDefaults,
  aboutPageDefaults,
  faqsPageDefaults,
} from "@/lib/site-defaults";

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
  homeFormTitle: z.string().optional(),
  homeFormNote: z.string().optional(),
  homeCallLabel: z.string().optional(),
  homeCallSuffix: z.string().optional(),
  // Per-page SEO
  homeMetaTitle: z.string().optional(),
  homeMetaDescription: z.string().optional(),
  aboutMetaTitle: z.string().optional(),
  aboutMetaDescription: z.string().optional(),
  contactMetaTitle: z.string().optional(),
  contactMetaDescription: z.string().optional(),
  faqsMetaTitle: z.string().optional(),
  faqsMetaDescription: z.string().optional(),
  // About — vision & mission
  aboutVisionLabel: z.string().optional(),
  aboutVisionBody: z.string().optional(),
  aboutMissionLabel: z.string().optional(),
  aboutMissionBody: z.string().optional(),
  // About — process
  aboutProcessEyebrow: z.string().optional(),
  aboutProcessHeading: z.string().optional(),
  aboutProcess1Title: z.string().optional(),
  aboutProcess1Body: z.string().optional(),
  aboutProcess2Title: z.string().optional(),
  aboutProcess2Body: z.string().optional(),
  aboutProcess3Title: z.string().optional(),
  aboutProcess3Body: z.string().optional(),
  aboutProcess4Title: z.string().optional(),
  aboutProcess4Body: z.string().optional(),
  // About — quality
  aboutQualityEyebrow: z.string().optional(),
  aboutQualityHeading: z.string().optional(),
  aboutQualityIntro: z.string().optional(),
  aboutQualitySubheading: z.string().optional(),
  aboutQuality1Title: z.string().optional(),
  aboutQuality1Body: z.string().optional(),
  aboutQuality2Title: z.string().optional(),
  aboutQuality2Body: z.string().optional(),
  aboutQuality3Title: z.string().optional(),
  aboutQuality3Body: z.string().optional(),
  aboutQuality4Title: z.string().optional(),
  aboutQuality4Body: z.string().optional(),
  aboutQuality5Title: z.string().optional(),
  aboutQuality5Body: z.string().optional(),
  // About — promise
  aboutPromiseTitle: z.string().optional(),
  aboutPromiseNote: z.string().optional(),
  aboutPromise1Label: z.string().optional(),
  aboutPromise1Desc: z.string().optional(),
  aboutPromise2Label: z.string().optional(),
  aboutPromise2Desc: z.string().optional(),
  aboutPromise3Label: z.string().optional(),
  aboutPromise3Desc: z.string().optional(),
  aboutPromise4Label: z.string().optional(),
  aboutPromise4Desc: z.string().optional(),
  // FAQs page
  faqsHeroEyebrow: z.string().optional(),
  faqsHeroHeading: z.string().optional(),
  faqsHeroIntro: z.string().optional(),
  faqsCtaText: z.string().optional(),
  faqsCtaButtonLabel: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// The form reads every column off the singleton SiteSettings row, so we use the
// Prisma-generated type directly rather than restating ~100 fields by hand.
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
      homeProjectsEyebrow: initialData?.homeProjectsEyebrow ?? "",
      homeProjectsHeading: initialData?.homeProjectsHeading ?? "",
      homeProjectsSubheading: initialData?.homeProjectsSubheading ?? "",
      homeWhyEyebrow: initialData?.homeWhyEyebrow ?? "",
      homeWhyHeading: initialData?.homeWhyHeading ?? "",
      homeCard1Title: initialData?.homeCard1Title ?? "",
      homeCard1Body: initialData?.homeCard1Body ?? "",
      homeCard2Title: initialData?.homeCard2Title ?? "",
      homeCard2Body: initialData?.homeCard2Body ?? "",
      homeCard3Title: initialData?.homeCard3Title ?? "",
      homeCard3Body: initialData?.homeCard3Body ?? "",
      homeCtaEyebrow: initialData?.homeCtaEyebrow ?? "",
      homeCtaHeading: initialData?.homeCtaHeading ?? "",
      homeCtaBody: initialData?.homeCtaBody ?? "",
      homeFormTitle: initialData?.homeFormTitle ?? "",
      homeFormNote: initialData?.homeFormNote ?? "",
      homeCallLabel: initialData?.homeCallLabel ?? "",
      homeCallSuffix: initialData?.homeCallSuffix ?? "",
      homeMetaTitle: initialData?.homeMetaTitle ?? "",
      homeMetaDescription: initialData?.homeMetaDescription ?? "",
      aboutMetaTitle: initialData?.aboutMetaTitle ?? "",
      aboutMetaDescription: initialData?.aboutMetaDescription ?? "",
      contactMetaTitle: initialData?.contactMetaTitle ?? "",
      contactMetaDescription: initialData?.contactMetaDescription ?? "",
      faqsMetaTitle: initialData?.faqsMetaTitle ?? "",
      faqsMetaDescription: initialData?.faqsMetaDescription ?? "",
      aboutVisionLabel: initialData?.aboutVisionLabel ?? "",
      aboutVisionBody: initialData?.aboutVisionBody ?? "",
      aboutMissionLabel: initialData?.aboutMissionLabel ?? "",
      aboutMissionBody: initialData?.aboutMissionBody ?? "",
      aboutProcessEyebrow: initialData?.aboutProcessEyebrow ?? "",
      aboutProcessHeading: initialData?.aboutProcessHeading ?? "",
      aboutProcess1Title: initialData?.aboutProcess1Title ?? "",
      aboutProcess1Body: initialData?.aboutProcess1Body ?? "",
      aboutProcess2Title: initialData?.aboutProcess2Title ?? "",
      aboutProcess2Body: initialData?.aboutProcess2Body ?? "",
      aboutProcess3Title: initialData?.aboutProcess3Title ?? "",
      aboutProcess3Body: initialData?.aboutProcess3Body ?? "",
      aboutProcess4Title: initialData?.aboutProcess4Title ?? "",
      aboutProcess4Body: initialData?.aboutProcess4Body ?? "",
      aboutQualityEyebrow: initialData?.aboutQualityEyebrow ?? "",
      aboutQualityHeading: initialData?.aboutQualityHeading ?? "",
      aboutQualityIntro: initialData?.aboutQualityIntro ?? "",
      aboutQualitySubheading: initialData?.aboutQualitySubheading ?? "",
      aboutQuality1Title: initialData?.aboutQuality1Title ?? "",
      aboutQuality1Body: initialData?.aboutQuality1Body ?? "",
      aboutQuality2Title: initialData?.aboutQuality2Title ?? "",
      aboutQuality2Body: initialData?.aboutQuality2Body ?? "",
      aboutQuality3Title: initialData?.aboutQuality3Title ?? "",
      aboutQuality3Body: initialData?.aboutQuality3Body ?? "",
      aboutQuality4Title: initialData?.aboutQuality4Title ?? "",
      aboutQuality4Body: initialData?.aboutQuality4Body ?? "",
      aboutQuality5Title: initialData?.aboutQuality5Title ?? "",
      aboutQuality5Body: initialData?.aboutQuality5Body ?? "",
      aboutPromiseTitle: initialData?.aboutPromiseTitle ?? "",
      aboutPromiseNote: initialData?.aboutPromiseNote ?? "",
      aboutPromise1Label: initialData?.aboutPromise1Label ?? "",
      aboutPromise1Desc: initialData?.aboutPromise1Desc ?? "",
      aboutPromise2Label: initialData?.aboutPromise2Label ?? "",
      aboutPromise2Desc: initialData?.aboutPromise2Desc ?? "",
      aboutPromise3Label: initialData?.aboutPromise3Label ?? "",
      aboutPromise3Desc: initialData?.aboutPromise3Desc ?? "",
      aboutPromise4Label: initialData?.aboutPromise4Label ?? "",
      aboutPromise4Desc: initialData?.aboutPromise4Desc ?? "",
      faqsHeroEyebrow: initialData?.faqsHeroEyebrow ?? "",
      faqsHeroHeading: initialData?.faqsHeroHeading ?? "",
      faqsHeroIntro: initialData?.faqsHeroIntro ?? "",
      faqsCtaText: initialData?.faqsCtaText ?? "",
      faqsCtaButtonLabel: initialData?.faqsCtaButtonLabel ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const cleaned = {
        ...data,
        aboutStoryBodyHtml,
        homeCard1Image: card1Image,
        homeCard2Image: card2Image,
        homeCard3Image: card3Image,
      };
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
      {hint && <p className="text-stone-400 text-xs mb-2">{hint}</p>}
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
        {description && <p className="text-stone-400 text-xs mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );

  const Field = ({
    label,
    hint,
    error,
    emptyDefault,
    children,
  }: {
    label: string;
    hint?: string;
    error?: string;
    /** When the CMS field is blank, the public site uses this text — shown as a hint. */
    emptyDefault?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {hint && <p className="text-stone-400 text-xs mb-2">{hint}</p>}
      {children}
      {emptyDefault && (
        <p className="text-[11px] text-stone-500 mt-1.5 leading-snug whitespace-pre-line rounded-md bg-stone-50 border border-stone-100 px-2.5 py-1.5">
          <span className="font-semibold text-stone-400">Currently on the site:</span>{" "}
          {emptyDefault}
        </p>
      )}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );

  // Field definitions for the repeating About-page groups, kept as data so the
  // JSX below stays readable. `t`/`b` are the form field names; `dt`/`db` the
  // matching default text used as the "If left empty" hint.
  const A = aboutPageDefaults;
  const processSteps = [
    { n: "01", t: "aboutProcess1Title", b: "aboutProcess1Body", dt: A.process1Title, db: A.process1Body },
    { n: "02", t: "aboutProcess2Title", b: "aboutProcess2Body", dt: A.process2Title, db: A.process2Body },
    { n: "03", t: "aboutProcess3Title", b: "aboutProcess3Body", dt: A.process3Title, db: A.process3Body },
    { n: "04", t: "aboutProcess4Title", b: "aboutProcess4Body", dt: A.process4Title, db: A.process4Body },
  ] as const;
  const qualityPoints = [
    { n: "1", t: "aboutQuality1Title", b: "aboutQuality1Body", dt: A.quality1Title, db: A.quality1Body },
    { n: "2", t: "aboutQuality2Title", b: "aboutQuality2Body", dt: A.quality2Title, db: A.quality2Body },
    { n: "3", t: "aboutQuality3Title", b: "aboutQuality3Body", dt: A.quality3Title, db: A.quality3Body },
    { n: "4", t: "aboutQuality4Title", b: "aboutQuality4Body", dt: A.quality4Title, db: A.quality4Body },
    { n: "5", t: "aboutQuality5Title", b: "aboutQuality5Body", dt: A.quality5Title, db: A.quality5Body },
  ] as const;
  const promiseItems = [
    { n: "1", t: "aboutPromise1Label", b: "aboutPromise1Desc", dt: A.promise1Label, db: A.promise1Desc },
    { n: "2", t: "aboutPromise2Label", b: "aboutPromise2Desc", dt: A.promise2Label, db: A.promise2Desc },
    { n: "3", t: "aboutPromise3Label", b: "aboutPromise3Desc", dt: A.promise3Label, db: A.promise3Desc },
    { n: "4", t: "aboutPromise4Label", b: "aboutPromise4Desc", dt: A.promise4Label, db: A.promise4Desc },
  ] as const;

  // The four per-page SEO blocks (title + description), with their defaults.
  const seoBlocks = [
    { page: "Homepage", t: "homeMetaTitle", d: "homeMetaDescription", dt: homePageDefaults.metaTitle, dd: homePageDefaults.metaDescription },
    { page: "About page", t: "aboutMetaTitle", d: "aboutMetaDescription", dt: aboutPageDefaults.metaTitle, dd: aboutPageDefaults.metaDescription },
    { page: "Contact page", t: "contactMetaTitle", d: "contactMetaDescription", dt: contactPageDefaults.metaTitle, dd: contactPageDefaults.metaDescription },
    { page: "FAQs page", t: "faqsMetaTitle", d: "faqsMetaDescription", dt: faqsPageDefaults.metaTitle, dd: faqsPageDefaults.metaDescription },
  ] as const;

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
        <Field label="Eyebrow" hint='Small label above the title, e.g. "Contact"' emptyDefault={contactPageDefaults.heroEyebrow}>
          <input
            {...register("contactHeroEyebrow")}
            className={inputClass}
            placeholder="Contact"
          />
        </Field>
        <Field label="Page title" hint="Use a new line (Enter) to create a line break in the title." emptyDefault={contactPageDefaults.heroTitle}>
          <input
            {...register("contactHeroTitle")}
            className={inputClass}
            placeholder="Two offices, one team, real phones."
          />
        </Field>
        <Field label="Intro paragraph" emptyDefault={contactPageDefaults.heroIntro}>
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
          <Field label="Corporate office card label" emptyDefault={contactPageDefaults.corporateLabel}>
            <input
              {...register("contactCorporateLabel")}
              className={inputClass}
              placeholder="Corporate office — Chennai"
            />
          </Field>
          <Field label="Registered office card label" emptyDefault={contactPageDefaults.registeredLabel}>
            <input
              {...register("contactRegisteredLabel")}
              className={inputClass}
              placeholder="Registered office — Kumbakonam"
            />
          </Field>
        </div>
        <Field label="Office hours box title" emptyDefault={contactPageDefaults.hoursTitle}>
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
            emptyDefault={contactPageDefaults.hoursWeekdays}
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
            emptyDefault={contactPageDefaults.hoursSunday}
          >
            <input
              {...register("contactHoursSunday")}
              className={inputClass}
              placeholder="Sunday · 10:00am – 2:00pm"
            />
          </Field>
        </div>
        <Field label="Hours note (small text below)" emptyDefault={contactPageDefaults.hoursNote}>
          <textarea
            {...register("contactHoursNote")}
            rows={2}
            className={textareaClass}
            placeholder="Sunday hours are limited — call ahead so an advisor is available when you arrive."
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Enquiry form title" emptyDefault={contactPageDefaults.formTitle}>
            <input
              {...register("contactFormTitle")}
              className={inputClass}
              placeholder="Send us an enquiry"
            />
          </Field>
        </div>
        <Field label="Enquiry form intro" emptyDefault={contactPageDefaults.formIntro}>
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
        <Field label="Eyebrow" emptyDefault={aboutPageDefaults.heroEyebrow}>
          <input
            {...register("aboutHeroEyebrow")}
            className={inputClass}
            placeholder="About Shivashree Developers"
          />
        </Field>
        <Field
          label="Page title"
          hint="Use a new line (Enter) to create a line break in the heading."
          emptyDefault={aboutPageDefaults.heroTitle}
        >
          <textarea
            {...register("aboutHeroTitle")}
            rows={2}
            className={textareaClass}
            placeholder={"A Kumbakonam builder.\nNow also in Chennai."}
          />
        </Field>
        <Field label="Lead paragraph" emptyDefault={aboutPageDefaults.heroLead}>
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
        <Field label="Section title" emptyDefault={aboutPageDefaults.storyTitle}>
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
          <p
            className="text-[11px] text-stone-500 mt-1.5 leading-snug"
            title="Optional rich text; the story block on /about is hidden until title or body is set."
          >
            Optional — the story block appears on /about only when title or body has content.
          </p>
        </div>
      </Section>

      <Section
        title="About page — commitments"
        description='The three numbered items under "What you can hold us to."'
      >
        <Field label="Section title" emptyDefault={aboutPageDefaults.commitmentsTitle}>
          <input
            {...register("aboutCommitmentsTitle")}
            className={inputClass}
            placeholder="What you can hold us to."
          />
        </Field>
        {(
          [
            { t: "aboutC1Title" as const, b: "aboutC1Body" as const, n: "01", dt: aboutPageDefaults.c1Title, db: aboutPageDefaults.c1Body },
            { t: "aboutC2Title" as const, b: "aboutC2Body" as const, n: "02", dt: aboutPageDefaults.c2Title, db: aboutPageDefaults.c2Body },
            { t: "aboutC3Title" as const, b: "aboutC3Body" as const, n: "03", dt: aboutPageDefaults.c3Title, db: aboutPageDefaults.c3Body },
          ]
        ).map(({ t, b, n, dt, db }) => (
          <div key={n} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-bold text-brand-purple-700">{n}</p>
            <Field label="Commitment title" emptyDefault={dt}>
              <input {...register(t)} className={inputClass} />
            </Field>
            <Field label="Commitment body" emptyDefault={db}>
              <textarea {...register(b)} rows={3} className={textareaClass} />
            </Field>
          </div>
        ))}
      </Section>

      <Section
        title="About page — where to find us"
        description='The office address section. Addresses come from the Corporate/Registered Office fields above.'
      >
        <Field label="Section title" emptyDefault={aboutPageDefaults.whereTitle}>
          <input
            {...register("aboutWhereTitle")}
            className={inputClass}
            placeholder="Where to find us in person."
          />
        </Field>
        <Field label="Section intro" emptyDefault={aboutPageDefaults.whereIntro}>
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
        <Field label="CTA heading" emptyDefault={aboutPageDefaults.ctaTitle}>
          <input
            {...register("aboutCtaTitle")}
            className={inputClass}
            placeholder="Tell us what you're looking for."
          />
        </Field>
        <Field label="CTA body text" emptyDefault={aboutPageDefaults.ctaBody}>
          <textarea
            {...register("aboutCtaBody")}
            rows={3}
            className={textareaClass}
            placeholder="Whether you're a first-time buyer, an NRI investor…"
          />
        </Field>
      </Section>

      {/* ── Homepage — projects section ──────────────────────────────────── */}
      <Section
        title="Homepage — projects section"
        description="The eyebrow, heading and intro above the project cards on the homepage. Leave blank to use defaults."
      >
        <Field label="Eyebrow (small caps label)" hint='e.g. "Discover Your Dream With Us"' emptyDefault={homePageDefaults.projectsEyebrow}>
          <input
            {...register("homeProjectsEyebrow")}
            className={inputClass}
            placeholder="Discover Your Dream With Us"
          />
        </Field>
        <Field label="Heading" emptyDefault={homePageDefaults.projectsHeading}>
          <input
            {...register("homeProjectsHeading")}
            className={inputClass}
            placeholder="Step Into Excellence with Shivashree Developers — Where Dreams Find a Home"
          />
        </Field>
        <Field label="Subheading / intro paragraph" emptyDefault={homePageDefaults.projectsSubheading}>
          <textarea
            {...register("homeProjectsSubheading")}
            rows={3}
            className={textareaClass}
            placeholder="For over a decade, we have been creating exceptional apartments…"
          />
        </Field>
      </Section>

      {/* ── Homepage — Why Us section ────────────────────────────────────── */}
      <Section
        title='Homepage — "Why Us?" section'
        description='The three feature cards with images. Each card has a title, body and an uploadable photo.'
      >
        <Field label="Section eyebrow" emptyDefault={homePageDefaults.whyEyebrow}>
          <input
            {...register("homeWhyEyebrow")}
            className={inputClass}
            placeholder="Why Us?"
          />
        </Field>
        <Field label="Section heading" emptyDefault={homePageDefaults.whyHeading}>
          <input
            {...register("homeWhyHeading")}
            className={inputClass}
            placeholder="Crafting Spaces with Care and Precision"
          />
        </Field>

        {/* Card 1 */}
        <div className="border border-stone-200 rounded-xl p-4 space-y-4 bg-stone-50">
          <p className="text-xs font-bold text-brand-purple-700 uppercase tracking-wide">Card 1</p>
          <Field label="Title" emptyDefault={homePageDefaults.card1Title}>
            <input
              {...register("homeCard1Title")}
              className={inputClass}
              placeholder="A Legacy of Trust, A Decade of Expertise"
            />
          </Field>
          <Field label="Body text" emptyDefault={homePageDefaults.card1Body}>
            <textarea
              {...register("homeCard1Body")}
              rows={3}
              className={textareaClass}
              placeholder="For over a decade, Shivashree Developers has been a trusted name…"
            />
          </Field>
          <ImageSlot
            label="Card image"
            hint="Recommended: landscape photo, at least 800×500 px."
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
          <Field label="Title" emptyDefault={homePageDefaults.card2Title}>
            <input
              {...register("homeCard2Title")}
              className={inputClass}
              placeholder="Building Trust, Delivering Excellence"
            />
          </Field>
          <Field label="Body text" emptyDefault={homePageDefaults.card2Body}>
            <textarea
              {...register("homeCard2Body")}
              rows={3}
              className={textareaClass}
              placeholder="Trust and excellence define everything we do…"
            />
          </Field>
          <ImageSlot
            label="Card image"
            hint="Recommended: landscape photo, at least 800×500 px."
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
          <Field label="Title" emptyDefault={homePageDefaults.card3Title}>
            <input
              {...register("homeCard3Title")}
              className={inputClass}
              placeholder="Creating Spaces with Diligence and Precision"
            />
          </Field>
          <Field label="Body text" emptyDefault={homePageDefaults.card3Body}>
            <textarea
              {...register("homeCard3Body")}
              rows={3}
              className={textareaClass}
              placeholder="Every space we build is planned carefully…"
            />
          </Field>
          <ImageSlot
            label="Card image"
            hint="Recommended: landscape photo, at least 800×500 px."
            value={card3Image}
            onUpload={(e) => handleCardImageUpload(e, "3")}
            onClear={() => setCard3Image(null)}
            slotId="3"
            inputRef={card3Ref}
          />
        </div>
      </Section>

      {/* ── Homepage — CTA section ───────────────────────────────────────── */}
      <Section
        title="Homepage — CTA / enquiry section"
        description="The dark purple section with the enquiry form at the bottom of the homepage."
      >
        <Field label="Eyebrow" emptyDefault={homePageDefaults.ctaEyebrow}>
          <input
            {...register("homeCtaEyebrow")}
            className={inputClass}
            placeholder="Enquire Now"
          />
        </Field>
        <Field label="Heading" emptyDefault={homePageDefaults.ctaHeading}>
          <input
            {...register("homeCtaHeading")}
            className={inputClass}
            placeholder="At the heart of our work is a commitment to customer satisfaction."
          />
        </Field>
        <Field label="Body text" emptyDefault={homePageDefaults.ctaBody}>
          <textarea
            {...register("homeCtaBody")}
            rows={3}
            className={textareaClass}
            placeholder="Your dream home isn't just built — it's brought to life…"
          />
        </Field>
      </Section>

      {/* ── Homepage — callback form copy ────────────────────────────────── */}
      <Section
        title="Homepage — callback form copy"
        description='The small text around the enquiry form and the "prefer to call" line on the homepage.'
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Form title" emptyDefault={homePageDefaults.formTitle}>
            <input {...register("homeFormTitle")} className={inputClass} placeholder="Request a callback" />
          </Field>
          <Field label="Form note (small text)" emptyDefault={homePageDefaults.formNote}>
            <input {...register("homeFormNote")} className={inputClass} placeholder="No spam. No mailing list. Just a phone call." />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label='"Prefer to call" lead-in'
            hint="Text shown just before the phone number link."
            emptyDefault={homePageDefaults.callLabel}
          >
            <input {...register("homeCallLabel")} className={inputClass} placeholder="Prefer to call? Dial" />
          </Field>
          <Field
            label='"Prefer to call" trailing text'
            hint="Text shown just after the phone number (e.g. office hours)."
            emptyDefault={homePageDefaults.callSuffix}
          >
            <input {...register("homeCallSuffix")} className={inputClass} placeholder="— Monday to Saturday, 9am–6pm." />
          </Field>
        </div>
      </Section>

      {/* ── About page — Vision & Mission ────────────────────────────────── */}
      <Section
        title="About page — Vision & Mission"
        description="The two boxes in the middle of the About page."
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vision label" emptyDefault={aboutPageDefaults.visionLabel}>
            <input {...register("aboutVisionLabel")} className={inputClass} placeholder="Our Vision" />
          </Field>
          <Field label="Mission label" emptyDefault={aboutPageDefaults.missionLabel}>
            <input {...register("aboutMissionLabel")} className={inputClass} placeholder="Our Mission" />
          </Field>
        </div>
        <Field label="Vision text" emptyDefault={aboutPageDefaults.visionBody}>
          <textarea {...register("aboutVisionBody")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Mission text" emptyDefault={aboutPageDefaults.missionBody}>
          <textarea {...register("aboutMissionBody")} rows={3} className={textareaClass} />
        </Field>
      </Section>

      {/* ── About page — Our Process ─────────────────────────────────────── */}
      <Section
        title="About page — Our Process"
        description="The numbered steps explaining how buying works."
      >
        <Field label="Eyebrow" emptyDefault={aboutPageDefaults.processEyebrow}>
          <input {...register("aboutProcessEyebrow")} className={inputClass} placeholder="Our Process" />
        </Field>
        <Field label="Section heading" emptyDefault={aboutPageDefaults.processHeading}>
          <textarea {...register("aboutProcessHeading")} rows={2} className={textareaClass} />
        </Field>
        {processSteps.map((step) => (
          <div key={step.n} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-bold text-brand-purple-700">{step.n}</p>
            <Field label="Step title" emptyDefault={step.dt}>
              <input {...register(step.t)} className={inputClass} />
            </Field>
            <Field label="Step body" emptyDefault={step.db}>
              <textarea {...register(step.b)} rows={2} className={textareaClass} />
            </Field>
          </div>
        ))}
      </Section>

      {/* ── About page — Quality Guarantee ───────────────────────────────── */}
      <Section
        title="About page — Quality Guarantee"
        description='The "Our Quality Guarantee" section and its numbered points.'
      >
        <Field label="Eyebrow" emptyDefault={aboutPageDefaults.qualityEyebrow}>
          <input {...register("aboutQualityEyebrow")} className={inputClass} placeholder="Our Quality Guarantee" />
        </Field>
        <Field label="Section heading" emptyDefault={aboutPageDefaults.qualityHeading}>
          <textarea {...register("aboutQualityHeading")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Section intro" emptyDefault={aboutPageDefaults.qualityIntro}>
          <textarea {...register("aboutQualityIntro")} rows={2} className={textareaClass} />
        </Field>
        <Field label='"What sets us apart" subheading' emptyDefault={aboutPageDefaults.qualitySubheading}>
          <input {...register("aboutQualitySubheading")} className={inputClass} placeholder="What Sets Our Quality Apart?" />
        </Field>
        {qualityPoints.map((pt) => (
          <div key={pt.n} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-bold text-brand-purple-700">{pt.n}</p>
            <Field label="Point title" emptyDefault={pt.dt}>
              <input {...register(pt.t)} className={inputClass} />
            </Field>
            <Field label="Point body" emptyDefault={pt.db}>
              <textarea {...register(pt.b)} rows={2} className={textareaClass} />
            </Field>
          </div>
        ))}
      </Section>

      {/* ── About page — Our Promise ─────────────────────────────────────── */}
      <Section
        title="About page — Our Promise"
        description='The "Our Promise to You" list in the dark box.'
      >
        <Field label="Box title" emptyDefault={aboutPageDefaults.promiseTitle}>
          <input {...register("aboutPromiseTitle")} className={inputClass} placeholder="Our Promise to You" />
        </Field>
        {promiseItems.map((it) => (
          <div key={it.n} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-bold text-brand-purple-700">{it.n}</p>
            <Field label="Promise label" emptyDefault={it.dt}>
              <input {...register(it.t)} className={inputClass} />
            </Field>
            <Field label="Promise description" emptyDefault={it.db}>
              <textarea {...register(it.b)} rows={2} className={textareaClass} />
            </Field>
          </div>
        ))}
        <Field label="Closing note (small text under the list)" emptyDefault={aboutPageDefaults.promiseNote}>
          <textarea {...register("aboutPromiseNote")} rows={2} className={textareaClass} />
        </Field>
      </Section>

      {/* ── FAQs page ────────────────────────────────────────────────────── */}
      <Section
        title="FAQs page"
        description="The purple header and the bottom call-to-action on /resources/faqs. (The questions themselves are managed under FAQs.)"
      >
        <Field label="Hero eyebrow" emptyDefault={faqsPageDefaults.heroEyebrow}>
          <input {...register("faqsHeroEyebrow")} className={inputClass} placeholder="FAQs" />
        </Field>
        <Field label="Hero heading" emptyDefault={faqsPageDefaults.heroHeading}>
          <input {...register("faqsHeroHeading")} className={inputClass} placeholder="The questions buyers actually ask us." />
        </Field>
        <Field label="Hero intro" emptyDefault={faqsPageDefaults.heroIntro}>
          <textarea {...register("faqsHeroIntro")} rows={3} className={textareaClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Bottom CTA text" emptyDefault={faqsPageDefaults.ctaText}>
            <input {...register("faqsCtaText")} className={inputClass} placeholder="Question not answered above? Ask us directly." />
          </Field>
          <Field label="Bottom CTA button label" emptyDefault={faqsPageDefaults.ctaButtonLabel}>
            <input {...register("faqsCtaButtonLabel")} className={inputClass} placeholder="Contact us" />
          </Field>
        </div>
      </Section>

      {/* ── Search engine / SEO ──────────────────────────────────────────── */}
      <Section
        title="Search engine listing (SEO)"
        description="The blue title and grey description each page shows in Google search results and the browser tab. Leave blank to use the built-in defaults."
      >
        {seoBlocks.map((blk) => (
          <div key={blk.page} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-bold text-brand-purple-700 uppercase tracking-wide">{blk.page}</p>
            <Field label="Meta title" emptyDefault={blk.dt}>
              <input {...register(blk.t)} className={inputClass} />
            </Field>
            <Field label="Meta description" hint="Aim for 150–160 characters." emptyDefault={blk.dd}>
              <textarea {...register(blk.d)} rows={2} className={textareaClass} />
            </Field>
          </div>
        ))}
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

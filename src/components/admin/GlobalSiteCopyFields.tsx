"use client";

import type { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  inputClass: string;
  textareaClass: string;
};

function err(errors: FieldErrors<FieldValues>, name: string) {
  const e = errors[name as string];
  return typeof e === "object" && e && "message" in e ? String((e as { message?: string }).message) : undefined;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
        <h2 className="font-semibold text-stone-900 text-sm">{title}</h2>
        {description && <p className="text-stone-600 text-xs mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

/** All previously hardcoded public-site strings (plus JSON blobs for lists/FAQs). */
export default function GlobalSiteCopyFields({ register, errors, inputClass, textareaClass }: Props) {
  const e = (n: string) => err(errors, n);
  const jsonHint =
    "Valid JSON array. Save carefully — invalid JSON blocks the whole settings save.";

  return (
    <div className="space-y-6 border-t border-stone-200 pt-8 mt-8">
      <p className="text-sm text-stone-700 font-medium">
        Global site copy — everything below also appears on the live site (merged with these defaults when a field
        is empty in the database).
      </p>

      <Section title="Page meta" description="SEO title and description for home, about, and projects listing.">
        <Field label="About page meta title" error={e("aboutMetaTitle")}>
          <input {...register("aboutMetaTitle")} className={inputClass} />
        </Field>
        <Field label="About page meta description" error={e("aboutMetaDescription")}>
          <textarea {...register("aboutMetaDescription")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Homepage meta title" error={e("homeMetaTitle")}>
          <input {...register("homeMetaTitle")} className={inputClass} />
        </Field>
        <Field label="Homepage meta description" error={e("homeMetaDescription")}>
          <textarea {...register("homeMetaDescription")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Projects listing meta title" error={e("projectsMetaTitle")}>
          <input {...register("projectsMetaTitle")} className={inputClass} />
        </Field>
        <Field label="Projects listing meta description" error={e("projectsMetaDescription")}>
          <textarea {...register("projectsMetaDescription")} rows={3} className={textareaClass} />
        </Field>
      </Section>

      <Section title="Contact page — extras" description="Meta description and map iframe title (contact hero copy stays above).">
        <Field label="Contact meta description" error={e("contactMetaDescription")}>
          <textarea {...register("contactMetaDescription")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Contact page map iframe title" error={e("contactMapIframeTitle")}>
          <input {...register("contactMapIframeTitle")} className={inputClass} />
        </Field>
      </Section>

      <Section title="About — Vision & Mission">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vision eyebrow" error={e("aboutVisionEyebrow")}>
            <input {...register("aboutVisionEyebrow")} className={inputClass} />
          </Field>
          <Field label="Mission eyebrow" error={e("aboutMissionEyebrow")}>
            <input {...register("aboutMissionEyebrow")} className={inputClass} />
          </Field>
        </div>
        <Field label="Vision body" error={e("aboutVisionBody")}>
          <textarea {...register("aboutVisionBody")} rows={4} className={textareaClass} />
        </Field>
        <Field label="Mission body" error={e("aboutMissionBody")}>
          <textarea {...register("aboutMissionBody")} rows={4} className={textareaClass} />
        </Field>
      </Section>

      <Section title="About — Process block">
        <Field label="Process eyebrow" error={e("aboutProcessEyebrow")}>
          <input {...register("aboutProcessEyebrow")} className={inputClass} />
        </Field>
        <Field label="Process heading" error={e("aboutProcessHeading")}>
          <textarea {...register("aboutProcessHeading")} rows={3} className={textareaClass} />
        </Field>
        <Field label={`Process steps (JSON) — ${jsonHint}`} error={e("aboutProcessStepsJson")}>
          <textarea {...register("aboutProcessStepsJson")} rows={14} className={textareaClass + " font-mono text-xs"} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Process image alt" error={e("aboutProcessImageAlt")}>
            <input {...register("aboutProcessImageAlt")} className={inputClass} />
          </Field>
          <Field label="Empty image title" error={e("aboutProcessEmptyTitle")}>
            <input {...register("aboutProcessEmptyTitle")} className={inputClass} />
          </Field>
        </div>
        <Field label="Empty image hint line 1" error={e("aboutProcessEmptyHintLine1")}>
          <input {...register("aboutProcessEmptyHintLine1")} className={inputClass} />
        </Field>
        <Field label="Empty image hint line 2" error={e("aboutProcessEmptyHintLine2")}>
          <input {...register("aboutProcessEmptyHintLine2")} className={inputClass} />
        </Field>
      </Section>

      <Section title="About — Quality & Promise">
        <Field label="Quality eyebrow" error={e("aboutQualityEyebrow")}>
          <input {...register("aboutQualityEyebrow")} className={inputClass} />
        </Field>
        <Field label="Quality heading" error={e("aboutQualityHeading")}>
          <textarea {...register("aboutQualityHeading")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Quality intro" error={e("aboutQualityIntro")}>
          <textarea {...register("aboutQualityIntro")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Quality subheading (left column)" error={e("aboutQualitySubheading")}>
          <input {...register("aboutQualitySubheading")} className={inputClass} />
        </Field>
        <Field label={`Quality bullet points (JSON) — ${jsonHint}`} error={e("aboutQualityPointsJson")}>
          <textarea {...register("aboutQualityPointsJson")} rows={12} className={textareaClass + " font-mono text-xs"} />
        </Field>
        <Field label="Promise block title" error={e("aboutPromiseBlockTitle")}>
          <input {...register("aboutPromiseBlockTitle")} className={inputClass} />
        </Field>
        <Field label={`Promise list (JSON array of {label, desc}) — ${jsonHint}`} error={e("aboutPromisesJson")}>
          <textarea {...register("aboutPromisesJson")} rows={10} className={textareaClass + " font-mono text-xs"} />
        </Field>
        <Field label="Promise footer paragraph" error={e("aboutPromiseFooter")}>
          <textarea {...register("aboutPromiseFooter")} rows={3} className={textareaClass} />
        </Field>
      </Section>

      <Section title="About — Office badges & CTA link">
        <Field label="Corporate badge (where to find us)" error={e("aboutWhereCorporateBadge")}>
          <input {...register("aboutWhereCorporateBadge")} className={inputClass} />
        </Field>
        <Field label="Registered badge" error={e("aboutWhereRegisteredBadge")}>
          <input {...register("aboutWhereRegisteredBadge")} className={inputClass} />
        </Field>
        <Field label="About CTA link label (browse projects)" error={e("aboutCtaBrowseProjectsLabel")}>
          <input {...register("aboutCtaBrowseProjectsLabel")} className={inputClass} />
        </Field>
      </Section>

      <Section title="Homepage — hero fallback & project cards" description="Used when no hero slides; and project card microcopy on the homepage.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fallback slide 1 heading" error={e("homeHeroFallback1Heading")}>
            <textarea {...register("homeHeroFallback1Heading")} rows={3} className={textareaClass} />
          </Field>
          <Field label="Fallback slide 2 heading" error={e("homeHeroFallback2Heading")}>
            <textarea {...register("homeHeroFallback2Heading")} rows={3} className={textareaClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fallback slide 1 sub" error={e("homeHeroFallback1Sub")}>
            <textarea {...register("homeHeroFallback1Sub")} rows={2} className={textareaClass} />
          </Field>
          <Field label="Fallback slide 2 sub" error={e("homeHeroFallback2Sub")}>
            <textarea {...register("homeHeroFallback2Sub")} rows={2} className={textareaClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fallback 1 CTA label" error={e("homeHeroFallback1CtaLabel")}>
            <input {...register("homeHeroFallback1CtaLabel")} className={inputClass} />
          </Field>
          <Field label="Fallback 1 CTA URL" error={e("homeHeroFallback1CtaUrl")}>
            <input {...register("homeHeroFallback1CtaUrl")} className={inputClass} />
          </Field>
          <Field label="Fallback 2 CTA label" error={e("homeHeroFallback2CtaLabel")}>
            <input {...register("homeHeroFallback2CtaLabel")} className={inputClass} />
          </Field>
          <Field label="Fallback 2 CTA URL" error={e("homeHeroFallback2CtaUrl")}>
            <input {...register("homeHeroFallback2CtaUrl")} className={inputClass} />
          </Field>
        </div>
        <Field
          label="Slide eyebrow when a slide has no eyebrow (property-image hero)"
          error={e("homeHeroSlideEyebrowFallback")}
        >
          <input {...register("homeHeroSlideEyebrowFallback")} className={inputClass} />
        </Field>
        <p className="text-xs text-stone-500 -mt-2">
          Last-resort hero (no slides and no property images): solid background block.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Empty hero eyebrow" error={e("homeHeroEmptyEyebrow")}>
            <input {...register("homeHeroEmptyEyebrow")} className={inputClass} />
          </Field>
          <Field label="Empty hero CTA label" error={e("homeHeroEmptyCtaLabel")}>
            <input {...register("homeHeroEmptyCtaLabel")} className={inputClass} />
          </Field>
        </div>
        <Field label="Empty hero heading (use line breaks)" error={e("homeHeroEmptyHeading")}>
          <textarea {...register("homeHeroEmptyHeading")} rows={4} className={textareaClass} />
        </Field>
        <Field label="Empty hero CTA URL" error={e("homeHeroEmptyCtaUrl")}>
          <input {...register("homeHeroEmptyCtaUrl")} className={inputClass} />
        </Field>
        <Field label={`Home FAQ JSON-LD (${jsonHint})`} error={e("homeFaqItemsJson")}>
          <textarea {...register("homeFaqItemsJson")} rows={14} className={textareaClass + " font-mono text-xs"} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="See all projects link" error={e("homeProjectsSeeAllLabel")}>
            <input {...register("homeProjectsSeeAllLabel")} className={inputClass} />
          </Field>
          <Field label="No projects message" error={e("homeProjectsEmptyMessage")}>
            <textarea {...register("homeProjectsEmptyMessage")} rows={2} className={textareaClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Card: no image text" error={e("homeCardNoImageText")}>
            <input {...register("homeCardNoImageText")} className={inputClass} />
          </Field>
          <Field label="Card: starting at label" error={e("homeCardStartingAtLabel")}>
            <input {...register("homeCardStartingAtLabel")} className={inputClass} />
          </Field>
          <Field label="Card: pricing on request" error={e("homeCardPricingOnRequest")}>
            <input {...register("homeCardPricingOnRequest")} className={inputClass} />
          </Field>
          <Field label="Card: project page label" error={e("homeCardProjectPageLabel")}>
            <input {...register("homeCardProjectPageLabel")} className={inputClass} />
          </Field>
          <Field label="Card: TNRERA prefix" error={e("homeCardTnreraPrefix")}>
            <input {...register("homeCardTnreraPrefix")} className={inputClass} />
          </Field>
        </div>
        <Field label="Home CTA callback box title" error={e("homeCtaCallbackTitle")}>
          <input {...register("homeCtaCallbackTitle")} className={inputClass} />
        </Field>
        <Field label="Home CTA callback box subtitle" error={e("homeCtaCallbackSubtitle")}>
          <input {...register("homeCtaCallbackSubtitle")} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prefer call prefix" error={e("homeCtaPreferCallPrefix")}>
            <input {...register("homeCtaPreferCallPrefix")} className={inputClass} />
          </Field>
          <Field label="Prefer call suffix" error={e("homeCtaPreferCallSuffix")}>
            <input {...register("homeCtaPreferCallSuffix")} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Projects listing page">
        <Field label={`Projects page FAQ JSON — ${jsonHint}`} error={e("projectsFaqItemsJson")}>
          <textarea {...register("projectsFaqItemsJson")} rows={12} className={textareaClass + " font-mono text-xs"} />
        </Field>
        <Field label="Hero eyebrow" error={e("projectsHeroEyebrow")}>
          <input {...register("projectsHeroEyebrow")} className={inputClass} />
        </Field>
        <Field label="Hero title" error={e("projectsHeroTitle")}>
          <textarea {...register("projectsHeroTitle")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Hero intro" error={e("projectsHeroIntro")}>
          <textarea {...register("projectsHeroIntro")} rows={3} className={textareaClass} />
        </Field>
        <p className="text-xs font-semibold text-stone-600">Status sections</p>
        {(
          [
            ["Ongoing", "projectsSecOngoingLabel", "projectsSecOngoingSub"],
            ["Proposed", "projectsSecProposedLabel", "projectsSecProposedSub"],
            ["Completed", "projectsSecCompletedLabel", "projectsSecCompletedSub"],
            ["Sold out", "projectsSecSoldOutLabel", "projectsSecSoldOutSub"],
          ] as const
        ).map(([label, a, b]) => (
          <div key={label} className="grid grid-cols-2 gap-4 border border-stone-100 rounded-lg p-3">
            <Field label={`${label} label`} error={e(a)}>
              <input {...register(a)} className={inputClass} />
            </Field>
            <Field label={`${label} sub`} error={e(b)}>
              <textarea {...register(b)} rows={2} className={textareaClass} />
            </Field>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Card no image" error={e("projectsCardNoImageText")}>
            <input {...register("projectsCardNoImageText")} className={inputClass} />
          </Field>
          <Field label="Card starting at" error={e("projectsCardStartingAtLabel")}>
            <input {...register("projectsCardStartingAtLabel")} className={inputClass} />
          </Field>
          <Field label="Card pricing on request" error={e("projectsCardPricingOnRequest")}>
            <input {...register("projectsCardPricingOnRequest")} className={inputClass} />
          </Field>
          <Field label="Card project page" error={e("projectsCardProjectPageLabel")}>
            <input {...register("projectsCardProjectPageLabel")} className={inputClass} />
          </Field>
          <Field label="Card TNRERA prefix" error={e("projectsCardTnreraPrefix")}>
            <input {...register("projectsCardTnreraPrefix")} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Status labels (global)" description="Homepage cards, projects listing, nav dropdown, property detail badge.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Proposed" error={e("statusLabelProposed")}>
            <input {...register("statusLabelProposed")} className={inputClass} />
          </Field>
          <Field label="Ongoing" error={e("statusLabelOngoing")}>
            <input {...register("statusLabelOngoing")} className={inputClass} />
          </Field>
          <Field label="Completed" error={e("statusLabelCompleted")}>
            <input {...register("statusLabelCompleted")} className={inputClass} />
          </Field>
          <Field label="Sold out" error={e("statusLabelSoldOut")}>
            <input {...register("statusLabelSoldOut")} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Footer">
        <Field label="Brand tagline" error={e("footerBrandTagline")}>
          <textarea {...register("footerBrandTagline")} rows={3} className={textareaClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sitemap heading" error={e("footerSitemapHeading")}>
            <input {...register("footerSitemapHeading")} className={inputClass} />
          </Field>
          <Field label="Bottom location line" error={e("footerBottomLocationLine")}>
            <input {...register("footerBottomLocationLine")} className={inputClass} />
          </Field>
          <Field label="Corporate heading" error={e("footerCorporateHeading")}>
            <input {...register("footerCorporateHeading")} className={inputClass} />
          </Field>
          <Field label="Registered heading" error={e("footerRegisteredHeading")}>
            <input {...register("footerRegisteredHeading")} className={inputClass} />
          </Field>
        </div>
        <Field label="RERA box title" error={e("footerReraTitle")}>
          <input {...register("footerReraTitle")} className={inputClass} />
        </Field>
        <Field label="RERA box body" error={e("footerReraBody")}>
          <textarea {...register("footerReraBody")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Footer map iframe title" error={e("footerMapIframeTitle")}>
          <input {...register("footerMapIframeTitle")} className={inputClass} />
        </Field>
      </Section>

      <Section title="Navbar & menus">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nav: Home" error={e("navLabelHome")}>
            <input {...register("navLabelHome")} className={inputClass} />
          </Field>
          <Field label="Nav: Projects" error={e("navLabelProjects")}>
            <input {...register("navLabelProjects")} className={inputClass} />
          </Field>
          <Field label="Nav: Resources" error={e("navLabelResources")}>
            <input {...register("navLabelResources")} className={inputClass} />
          </Field>
          <Field label="Nav: Contact" error={e("navLabelContact")}>
            <input {...register("navLabelContact")} className={inputClass} />
          </Field>
          <Field label="Nav: About" error={e("navLabelAbout")}>
            <input {...register("navLabelAbout")} className={inputClass} />
          </Field>
          <Field label="Projects dropdown — see all" error={e("navProjectsSeeAllLabel")}>
            <input {...register("navProjectsSeeAllLabel")} className={inputClass} />
          </Field>
        </div>
        <Field label="Resources: blog title" error={e("navResourcesBlogTitle")}>
          <input {...register("navResourcesBlogTitle")} className={inputClass} />
        </Field>
        <Field label="Resources: blog subtitle" error={e("navResourcesBlogSubtitle")}>
          <textarea {...register("navResourcesBlogSubtitle")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Resources: FAQs title" error={e("navResourcesFaqsTitle")}>
          <input {...register("navResourcesFaqsTitle")} className={inputClass} />
        </Field>
        <Field label="Resources: FAQs subtitle" error={e("navResourcesFaqsSubtitle")}>
          <textarea {...register("navResourcesFaqsSubtitle")} rows={2} className={textareaClass} />
        </Field>
        <Field label="WhatsApp CTA label" error={e("navWhatsappCtaLabel")}>
          <input {...register("navWhatsappCtaLabel")} className={inputClass} />
        </Field>
        <Field label="WhatsApp prefill message" error={e("navWhatsappPrefillMessage")}>
          <textarea {...register("navWhatsappPrefillMessage")} rows={2} className={textareaClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mobile menu open (a11y)" error={e("navMobileMenuOpenA11y")}>
            <input {...register("navMobileMenuOpenA11y")} className={inputClass} />
          </Field>
          <Field label="Mobile menu close (a11y)" error={e("navMobileMenuCloseA11y")}>
            <input {...register("navMobileMenuCloseA11y")} className={inputClass} />
          </Field>
          <Field label="Mobile: all projects" error={e("navMobileAllProjectsLabel")}>
            <input {...register("navMobileAllProjectsLabel")} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Enquiry form (all pages)">
        <Field label="Thank you title" error={e("enquiryThankTitle")}>
          <input {...register("enquiryThankTitle")} className={inputClass} />
        </Field>
        <Field label="Thank you body" error={e("enquiryThankBody")}>
          <textarea {...register("enquiryThankBody")} rows={3} className={textareaClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Placeholder: name" error={e("enquiryPlaceholderName")}>
            <input {...register("enquiryPlaceholderName")} className={inputClass} />
          </Field>
          <Field label="Placeholder: mobile" error={e("enquiryPlaceholderMobile")}>
            <input {...register("enquiryPlaceholderMobile")} className={inputClass} />
          </Field>
          <Field label="Placeholder: email" error={e("enquiryPlaceholderEmail")}>
            <input {...register("enquiryPlaceholderEmail")} className={inputClass} />
          </Field>
          <Field label="Placeholder: looking" error={e("enquiryPlaceholderLooking")}>
            <input {...register("enquiryPlaceholderLooking")} className={inputClass} />
          </Field>
          <Field label="Placeholder: project" error={e("enquiryPlaceholderProject")}>
            <input {...register("enquiryPlaceholderProject")} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Submit: sending" error={e("enquirySubmitSending")}>
            <input {...register("enquirySubmitSending")} className={inputClass} />
          </Field>
          <Field label="Submit: label" error={e("enquirySubmitLabel")}>
            <input {...register("enquirySubmitLabel")} className={inputClass} />
          </Field>
        </div>
        <Field label="Privacy note under form" error={e("enquiryPrivacyNote")}>
          <textarea {...register("enquiryPrivacyNote")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Error alert text" error={e("enquiryErrorAlert")}>
          <textarea {...register("enquiryErrorAlert")} rows={2} className={textareaClass} />
        </Field>
      </Section>

      <Section title="Floating WhatsApp">
        <Field label="Prefill message" error={e("floatWhatsappPrefillMessage")}>
          <textarea {...register("floatWhatsappPrefillMessage")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Button aria-label" error={e("floatWhatsappAriaLabel")}>
          <input {...register("floatWhatsappAriaLabel")} className={inputClass} />
        </Field>
      </Section>

      <Section title="Structured data (organization)">
        <Field label="Organization name" error={e("structuredOrgName")}>
          <input {...register("structuredOrgName")} className={inputClass} />
        </Field>
        <Field label="Organization description" error={e("structuredOrgDescription")}>
          <textarea {...register("structuredOrgDescription")} rows={3} className={textareaClass} />
        </Field>
      </Section>

      <Section title="Property detail page (global labels)">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Breadcrumb: home" error={e("propDetailBreadcrumbHome")}>
            <input {...register("propDetailBreadcrumbHome")} className={inputClass} />
          </Field>
          <Field label="Breadcrumb: projects" error={e("propDetailBreadcrumbProjects")}>
            <input {...register("propDetailBreadcrumbProjects")} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="DT: starting at" error={e("propDetailDtStartingAt")}>
            <input {...register("propDetailDtStartingAt")} className={inputClass} />
          </Field>
          <Field label="DT: configurations" error={e("propDetailDtConfigurations")}>
            <input {...register("propDetailDtConfigurations")} className={inputClass} />
          </Field>
          <Field label="DT: TNRERA" error={e("propDetailDtTnrera")}>
            <input {...register("propDetailDtTnrera")} className={inputClass} />
          </Field>
          <Field label="DT: location" error={e("propDetailDtLocation")}>
            <input {...register("propDetailDtLocation")} className={inputClass} />
          </Field>
        </div>
        <Field label="Highlights heading" error={e("propDetailHighlightsHeading")}>
          <input {...register("propDetailHighlightsHeading")} className={inputClass} />
        </Field>
        <Field label="Gallery heading" error={e("propDetailGalleryHeading")}>
          <input {...register("propDetailGalleryHeading")} className={inputClass} />
        </Field>
        <Field label="Amenities heading" error={e("propDetailAmenitiesHeading")}>
          <input {...register("propDetailAmenitiesHeading")} className={inputClass} />
        </Field>
        <Field label="Specifications heading" error={e("propDetailSpecificationsHeading")}>
          <input {...register("propDetailSpecificationsHeading")} className={inputClass} />
        </Field>
        <Field label="Floor plans heading" error={e("propDetailFloorPlansHeading")}>
          <input {...register("propDetailFloorPlansHeading")} className={inputClass} />
        </Field>
        <Field label="Neighbourhood heading" error={e("propDetailNeighbourhoodHeading")}>
          <input {...register("propDetailNeighbourhoodHeading")} className={inputClass} />
        </Field>
        <Field label="FAQs heading" error={e("propDetailFaqsHeading")}>
          <input {...register("propDetailFaqsHeading")} className={inputClass} />
        </Field>
        <Field label="Back link label" error={e("propDetailBackLinkLabel")}>
          <input {...register("propDetailBackLinkLabel")} className={inputClass} />
        </Field>
        <Field label="Enquiry sidebar title template ({tail} = last word of project title)" error={e("propDetailEnquiryTitleTemplate")}>
          <input {...register("propDetailEnquiryTitleTemplate")} className={inputClass} />
        </Field>
        <Field label="Enquiry sidebar intro" error={e("propDetailEnquiryIntro")}>
          <textarea {...register("propDetailEnquiryIntro")} rows={3} className={textareaClass} />
        </Field>
        <Field label="Status box label" error={e("propDetailStatusBoxLabel")}>
          <input {...register("propDetailStatusBoxLabel")} className={inputClass} />
        </Field>
        <Field label="Status blurb: proposed" error={e("propDetailStatusBlurbProposed")}>
          <textarea {...register("propDetailStatusBlurbProposed")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Status blurb: ongoing" error={e("propDetailStatusBlurbOngoing")}>
          <textarea {...register("propDetailStatusBlurbOngoing")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Status blurb: completed" error={e("propDetailStatusBlurbCompleted")}>
          <textarea {...register("propDetailStatusBlurbCompleted")} rows={2} className={textareaClass} />
        </Field>
        <Field label="Status blurb: sold out" error={e("propDetailStatusBlurbSoldOut")}>
          <textarea {...register("propDetailStatusBlurbSoldOut")} rows={2} className={textareaClass} />
        </Field>
        <p className="text-xs font-semibold text-stone-600">Specification row labels</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Building" error={e("propSpecLabelBuilding")}>
            <input {...register("propSpecLabelBuilding")} className={inputClass} />
          </Field>
          <Field label="Bathroom" error={e("propSpecLabelBathroom")}>
            <input {...register("propSpecLabelBathroom")} className={inputClass} />
          </Field>
          <Field label="Kitchen" error={e("propSpecLabelKitchen")}>
            <input {...register("propSpecLabelKitchen")} className={inputClass} />
          </Field>
          <Field label="Flooring" error={e("propSpecLabelFlooring")}>
            <input {...register("propSpecLabelFlooring")} className={inputClass} />
          </Field>
          <Field label="Doors" error={e("propSpecLabelDoors")}>
            <input {...register("propSpecLabelDoors")} className={inputClass} />
          </Field>
          <Field label="Windows" error={e("propSpecLabelWindows")}>
            <input {...register("propSpecLabelWindows")} className={inputClass} />
          </Field>
        </div>
      </Section>
    </div>
  );
}

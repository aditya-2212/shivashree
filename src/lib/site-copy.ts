import type { SiteSettings } from "@prisma/client";
import {
  SITE_COPY_DEFAULTS,
  type AboutProcessStep,
  type AboutPromiseItem,
  type AboutQualityPoint,
  type FaqItem,
  DEFAULT_ABOUT_PROCESS_STEPS,
  DEFAULT_ABOUT_PROMISES,
  DEFAULT_ABOUT_QUALITY_POINTS,
  DEFAULT_HOME_FAQ_ITEMS,
  DEFAULT_PROJECTS_FAQ_ITEMS,
} from "./site-copy-defaults";

function pick(s: string | null | undefined, d: string): string {
  const t = typeof s === "string" ? s.trim() : "";
  return t || d;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseProcessSteps(v: unknown): AboutProcessStep[] | null {
  if (!Array.isArray(v)) return null;
  const out: AboutProcessStep[] = [];
  for (const row of v) {
    if (!isRecord(row)) return null;
    const n = row.n;
    const title = row.title;
    const body = row.body;
    if (typeof n !== "string" || typeof title !== "string" || typeof body !== "string") return null;
    out.push({ n, title, body });
  }
  return out.length ? out : null;
}

function parseQualityPoints(v: unknown): AboutQualityPoint[] | null {
  if (!Array.isArray(v)) return null;
  const out: AboutQualityPoint[] = [];
  for (const row of v) {
    if (!isRecord(row)) return null;
    const title = row.title;
    const body = row.body;
    if (typeof title !== "string" || typeof body !== "string") return null;
    out.push({ title, body });
  }
  return out.length ? out : null;
}

function parsePromises(v: unknown): AboutPromiseItem[] | null {
  if (!Array.isArray(v)) return null;
  const out: AboutPromiseItem[] = [];
  for (const row of v) {
    if (!isRecord(row)) return null;
    const label = row.label;
    const desc = row.desc;
    if (typeof label !== "string" || typeof desc !== "string") return null;
    out.push({ label, desc });
  }
  return out.length ? out : null;
}

function parseFaqItems(v: unknown): FaqItem[] | null {
  if (!Array.isArray(v)) return null;
  const out: FaqItem[] = [];
  for (const row of v) {
    if (!isRecord(row)) return null;
    const question = row.question;
    const answer = row.answer;
    if (typeof question !== "string" || typeof answer !== "string") return null;
    out.push({ question, answer });
  }
  return out.length ? out : null;
}

export type PublicSiteCopy = ReturnType<typeof buildPublicSiteCopy>;

/** Replace `{tail}` with last whitespace-delimited token of property title. */
export function buildPropertyEnquiryTitle(template: string, propertyTitle: string): string {
  const t = template.trim() || SITE_COPY_DEFAULTS.propDetailEnquiryTitleTemplate;
  const parts = propertyTitle.trim().split(/\s+/);
  const tail = parts.length ? parts[parts.length - 1]! : propertyTitle;
  return t.replace(/\{tail\}/g, tail);
}

export function buildPublicSiteCopy(s: SiteSettings | null) {
  const d = SITE_COPY_DEFAULTS;

  const aboutProcessSteps =
    parseProcessSteps(s?.aboutProcessStepsJson) ?? DEFAULT_ABOUT_PROCESS_STEPS;
  const aboutQualityPoints =
    parseQualityPoints(s?.aboutQualityPointsJson) ?? DEFAULT_ABOUT_QUALITY_POINTS;
  const aboutPromises = parsePromises(s?.aboutPromisesJson) ?? DEFAULT_ABOUT_PROMISES;
  const homeFaqItems = parseFaqItems(s?.homeFaqItemsJson) ?? DEFAULT_HOME_FAQ_ITEMS;
  const projectsFaqItems = parseFaqItems(s?.projectsFaqItemsJson) ?? DEFAULT_PROJECTS_FAQ_ITEMS;

  return {
    aboutMetaTitle: pick(s?.aboutMetaTitle, d.aboutMetaTitle),
    aboutMetaDescription: pick(s?.aboutMetaDescription, d.aboutMetaDescription),
    homeMetaTitle: pick(s?.homeMetaTitle, d.homeMetaTitle),
    homeMetaDescription: pick(s?.homeMetaDescription, d.homeMetaDescription),
    projectsMetaTitle: pick(s?.projectsMetaTitle, d.projectsMetaTitle),
    projectsMetaDescription: pick(s?.projectsMetaDescription, d.projectsMetaDescription),

    aboutVisionEyebrow: pick(s?.aboutVisionEyebrow, d.aboutVisionEyebrow),
    aboutVisionBody: pick(s?.aboutVisionBody, d.aboutVisionBody),
    aboutMissionEyebrow: pick(s?.aboutMissionEyebrow, d.aboutMissionEyebrow),
    aboutMissionBody: pick(s?.aboutMissionBody, d.aboutMissionBody),
    aboutProcessEyebrow: pick(s?.aboutProcessEyebrow, d.aboutProcessEyebrow),
    aboutProcessHeading: pick(s?.aboutProcessHeading, d.aboutProcessHeading),
    aboutProcessSteps,
    aboutProcessImageAlt: pick(s?.aboutProcessImageAlt, d.aboutProcessImageAlt),
    aboutProcessEmptyTitle: pick(s?.aboutProcessEmptyTitle, d.aboutProcessEmptyTitle),
    aboutProcessEmptyHintLine1: pick(s?.aboutProcessEmptyHintLine1, d.aboutProcessEmptyHintLine1),
    aboutProcessEmptyHintLine2: pick(s?.aboutProcessEmptyHintLine2, d.aboutProcessEmptyHintLine2),
    aboutQualityEyebrow: pick(s?.aboutQualityEyebrow, d.aboutQualityEyebrow),
    aboutQualityHeading: pick(s?.aboutQualityHeading, d.aboutQualityHeading),
    aboutQualityIntro: pick(s?.aboutQualityIntro, d.aboutQualityIntro),
    aboutQualitySubheading: pick(s?.aboutQualitySubheading, d.aboutQualitySubheading),
    aboutQualityPoints,
    aboutPromiseBlockTitle: pick(s?.aboutPromiseBlockTitle, d.aboutPromiseBlockTitle),
    aboutPromises,
    aboutPromiseFooter: pick(s?.aboutPromiseFooter, d.aboutPromiseFooter),
    aboutWhereCorporateBadge: pick(s?.aboutWhereCorporateBadge, d.aboutWhereCorporateBadge),
    aboutWhereRegisteredBadge: pick(s?.aboutWhereRegisteredBadge, d.aboutWhereRegisteredBadge),
    aboutCtaBrowseProjectsLabel: pick(s?.aboutCtaBrowseProjectsLabel, d.aboutCtaBrowseProjectsLabel),

    contactMetaDescription: pick(s?.contactMetaDescription, d.contactMetaDescription),
    contactMapIframeTitle: pick(s?.contactMapIframeTitle, d.contactMapIframeTitle),

    homeFaqItems,
    homeProjectsSeeAllLabel: pick(s?.homeProjectsSeeAllLabel, d.homeProjectsSeeAllLabel),
    homeProjectsEmptyMessage: pick(s?.homeProjectsEmptyMessage, d.homeProjectsEmptyMessage),
    homeHeroFallback1Heading: pick(s?.homeHeroFallback1Heading, d.homeHeroFallback1Heading),
    homeHeroFallback1Sub: pick(s?.homeHeroFallback1Sub, d.homeHeroFallback1Sub),
    homeHeroFallback1CtaLabel: pick(s?.homeHeroFallback1CtaLabel, d.homeHeroFallback1CtaLabel),
    homeHeroFallback1CtaUrl: pick(s?.homeHeroFallback1CtaUrl, d.homeHeroFallback1CtaUrl),
    homeHeroFallback2Heading: pick(s?.homeHeroFallback2Heading, d.homeHeroFallback2Heading),
    homeHeroFallback2Sub: pick(s?.homeHeroFallback2Sub, d.homeHeroFallback2Sub),
    homeHeroFallback2CtaLabel: pick(s?.homeHeroFallback2CtaLabel, d.homeHeroFallback2CtaLabel),
    homeHeroFallback2CtaUrl: pick(s?.homeHeroFallback2CtaUrl, d.homeHeroFallback2CtaUrl),
    homeHeroSlideEyebrowFallback: pick(s?.homeHeroSlideEyebrowFallback, d.homeHeroSlideEyebrowFallback),
    homeHeroEmptyEyebrow: pick(s?.homeHeroEmptyEyebrow, d.homeHeroEmptyEyebrow),
    homeHeroEmptyHeading: pick(s?.homeHeroEmptyHeading, d.homeHeroEmptyHeading),
    homeHeroEmptyCtaLabel: pick(s?.homeHeroEmptyCtaLabel, d.homeHeroEmptyCtaLabel),
    homeHeroEmptyCtaUrl: pick(s?.homeHeroEmptyCtaUrl, d.homeHeroEmptyCtaUrl),
    homeCardNoImageText: pick(s?.homeCardNoImageText, d.homeCardNoImageText),
    homeCardStartingAtLabel: pick(s?.homeCardStartingAtLabel, d.homeCardStartingAtLabel),
    homeCardPricingOnRequest: pick(s?.homeCardPricingOnRequest, d.homeCardPricingOnRequest),
    homeCardProjectPageLabel: pick(s?.homeCardProjectPageLabel, d.homeCardProjectPageLabel),
    homeCardTnreraPrefix: pick(s?.homeCardTnreraPrefix, d.homeCardTnreraPrefix),
    homeCtaCallbackTitle: pick(s?.homeCtaCallbackTitle, d.homeCtaCallbackTitle),
    homeCtaCallbackSubtitle: pick(s?.homeCtaCallbackSubtitle, d.homeCtaCallbackSubtitle),
    homeCtaPreferCallPrefix: pick(s?.homeCtaPreferCallPrefix, d.homeCtaPreferCallPrefix),
    homeCtaPreferCallSuffix: pick(s?.homeCtaPreferCallSuffix, d.homeCtaPreferCallSuffix),

    projectsFaqItems,
    projectsHeroEyebrow: pick(s?.projectsHeroEyebrow, d.projectsHeroEyebrow),
    projectsHeroTitle: pick(s?.projectsHeroTitle, d.projectsHeroTitle),
    projectsHeroIntro: pick(s?.projectsHeroIntro, d.projectsHeroIntro),
    projectsSecOngoingLabel: pick(s?.projectsSecOngoingLabel, d.projectsSecOngoingLabel),
    projectsSecOngoingSub: pick(s?.projectsSecOngoingSub, d.projectsSecOngoingSub),
    projectsSecProposedLabel: pick(s?.projectsSecProposedLabel, d.projectsSecProposedLabel),
    projectsSecProposedSub: pick(s?.projectsSecProposedSub, d.projectsSecProposedSub),
    projectsSecCompletedLabel: pick(s?.projectsSecCompletedLabel, d.projectsSecCompletedLabel),
    projectsSecCompletedSub: pick(s?.projectsSecCompletedSub, d.projectsSecCompletedSub),
    projectsSecSoldOutLabel: pick(s?.projectsSecSoldOutLabel, d.projectsSecSoldOutLabel),
    projectsSecSoldOutSub: pick(s?.projectsSecSoldOutSub, d.projectsSecSoldOutSub),
    projectsCardNoImageText: pick(s?.projectsCardNoImageText, d.projectsCardNoImageText),
    projectsCardStartingAtLabel: pick(s?.projectsCardStartingAtLabel, d.projectsCardStartingAtLabel),
    projectsCardPricingOnRequest: pick(s?.projectsCardPricingOnRequest, d.projectsCardPricingOnRequest),
    projectsCardProjectPageLabel: pick(s?.projectsCardProjectPageLabel, d.projectsCardProjectPageLabel),
    projectsCardTnreraPrefix: pick(s?.projectsCardTnreraPrefix, d.projectsCardTnreraPrefix),

    statusLabelProposed: pick(s?.statusLabelProposed, d.statusLabelProposed),
    statusLabelOngoing: pick(s?.statusLabelOngoing, d.statusLabelOngoing),
    statusLabelCompleted: pick(s?.statusLabelCompleted, d.statusLabelCompleted),
    statusLabelSoldOut: pick(s?.statusLabelSoldOut, d.statusLabelSoldOut),

    footerBrandTagline: pick(s?.footerBrandTagline, d.footerBrandTagline),
    footerSitemapHeading: pick(s?.footerSitemapHeading, d.footerSitemapHeading),
    footerCorporateHeading: pick(s?.footerCorporateHeading, d.footerCorporateHeading),
    footerRegisteredHeading: pick(s?.footerRegisteredHeading, d.footerRegisteredHeading),
    footerReraTitle: pick(s?.footerReraTitle, d.footerReraTitle),
    footerReraBody: pick(s?.footerReraBody, d.footerReraBody),
    footerBottomLocationLine: pick(s?.footerBottomLocationLine, d.footerBottomLocationLine),
    footerMapIframeTitle: pick(s?.footerMapIframeTitle, d.footerMapIframeTitle),

    navLabelHome: pick(s?.navLabelHome, d.navLabelHome),
    navLabelProjects: pick(s?.navLabelProjects, d.navLabelProjects),
    navLabelResources: pick(s?.navLabelResources, d.navLabelResources),
    navLabelContact: pick(s?.navLabelContact, d.navLabelContact),
    navLabelAbout: pick(s?.navLabelAbout, d.navLabelAbout),
    navProjectsSeeAllLabel: pick(s?.navProjectsSeeAllLabel, d.navProjectsSeeAllLabel),
    navResourcesBlogTitle: pick(s?.navResourcesBlogTitle, d.navResourcesBlogTitle),
    navResourcesBlogSubtitle: pick(s?.navResourcesBlogSubtitle, d.navResourcesBlogSubtitle),
    navResourcesFaqsTitle: pick(s?.navResourcesFaqsTitle, d.navResourcesFaqsTitle),
    navResourcesFaqsSubtitle: pick(s?.navResourcesFaqsSubtitle, d.navResourcesFaqsSubtitle),
    navWhatsappCtaLabel: pick(s?.navWhatsappCtaLabel, d.navWhatsappCtaLabel),
    navWhatsappPrefillMessage: pick(s?.navWhatsappPrefillMessage, d.navWhatsappPrefillMessage),
    navMobileMenuOpenA11y: pick(s?.navMobileMenuOpenA11y, d.navMobileMenuOpenA11y),
    navMobileMenuCloseA11y: pick(s?.navMobileMenuCloseA11y, d.navMobileMenuCloseA11y),
    navMobileAllProjectsLabel: pick(s?.navMobileAllProjectsLabel, d.navMobileAllProjectsLabel),

    enquiryThankTitle: pick(s?.enquiryThankTitle, d.enquiryThankTitle),
    enquiryThankBody: pick(s?.enquiryThankBody, d.enquiryThankBody),
    enquiryPlaceholderName: pick(s?.enquiryPlaceholderName, d.enquiryPlaceholderName),
    enquiryPlaceholderMobile: pick(s?.enquiryPlaceholderMobile, d.enquiryPlaceholderMobile),
    enquiryPlaceholderEmail: pick(s?.enquiryPlaceholderEmail, d.enquiryPlaceholderEmail),
    enquiryPlaceholderLooking: pick(s?.enquiryPlaceholderLooking, d.enquiryPlaceholderLooking),
    enquiryPlaceholderProject: pick(s?.enquiryPlaceholderProject, d.enquiryPlaceholderProject),
    enquirySubmitSending: pick(s?.enquirySubmitSending, d.enquirySubmitSending),
    enquirySubmitLabel: pick(s?.enquirySubmitLabel, d.enquirySubmitLabel),
    enquiryPrivacyNote: pick(s?.enquiryPrivacyNote, d.enquiryPrivacyNote),
    enquiryErrorAlert: pick(s?.enquiryErrorAlert, d.enquiryErrorAlert),

    floatWhatsappPrefillMessage: pick(s?.floatWhatsappPrefillMessage, d.floatWhatsappPrefillMessage),
    floatWhatsappAriaLabel: pick(s?.floatWhatsappAriaLabel, d.floatWhatsappAriaLabel),

    structuredOrgName: pick(s?.structuredOrgName, d.structuredOrgName),
    structuredOrgDescription: pick(s?.structuredOrgDescription, d.structuredOrgDescription),

    propDetailBreadcrumbHome: pick(s?.propDetailBreadcrumbHome, d.propDetailBreadcrumbHome),
    propDetailBreadcrumbProjects: pick(s?.propDetailBreadcrumbProjects, d.propDetailBreadcrumbProjects),
    propDetailDtStartingAt: pick(s?.propDetailDtStartingAt, d.propDetailDtStartingAt),
    propDetailDtConfigurations: pick(s?.propDetailDtConfigurations, d.propDetailDtConfigurations),
    propDetailDtTnrera: pick(s?.propDetailDtTnrera, d.propDetailDtTnrera),
    propDetailDtLocation: pick(s?.propDetailDtLocation, d.propDetailDtLocation),
    propDetailHighlightsHeading: pick(s?.propDetailHighlightsHeading, d.propDetailHighlightsHeading),
    propDetailGalleryHeading: pick(s?.propDetailGalleryHeading, d.propDetailGalleryHeading),
    propDetailAmenitiesHeading: pick(s?.propDetailAmenitiesHeading, d.propDetailAmenitiesHeading),
    propDetailSpecificationsHeading: pick(
      s?.propDetailSpecificationsHeading,
      d.propDetailSpecificationsHeading
    ),
    propDetailFloorPlansHeading: pick(s?.propDetailFloorPlansHeading, d.propDetailFloorPlansHeading),
    propDetailNeighbourhoodHeading: pick(s?.propDetailNeighbourhoodHeading, d.propDetailNeighbourhoodHeading),
    propDetailFaqsHeading: pick(s?.propDetailFaqsHeading, d.propDetailFaqsHeading),
    propDetailBackLinkLabel: pick(s?.propDetailBackLinkLabel, d.propDetailBackLinkLabel),
    propDetailEnquiryTitleTemplate: pick(s?.propDetailEnquiryTitleTemplate, d.propDetailEnquiryTitleTemplate),
    propDetailEnquiryIntro: pick(s?.propDetailEnquiryIntro, d.propDetailEnquiryIntro),
    propDetailStatusBoxLabel: pick(s?.propDetailStatusBoxLabel, d.propDetailStatusBoxLabel),
    propDetailStatusBlurbProposed: pick(s?.propDetailStatusBlurbProposed, d.propDetailStatusBlurbProposed),
    propDetailStatusBlurbOngoing: pick(s?.propDetailStatusBlurbOngoing, d.propDetailStatusBlurbOngoing),
    propDetailStatusBlurbCompleted: pick(s?.propDetailStatusBlurbCompleted, d.propDetailStatusBlurbCompleted),
    propDetailStatusBlurbSoldOut: pick(s?.propDetailStatusBlurbSoldOut, d.propDetailStatusBlurbSoldOut),
    propSpecLabelBuilding: pick(s?.propSpecLabelBuilding, d.propSpecLabelBuilding),
    propSpecLabelBathroom: pick(s?.propSpecLabelBathroom, d.propSpecLabelBathroom),
    propSpecLabelKitchen: pick(s?.propSpecLabelKitchen, d.propSpecLabelKitchen),
    propSpecLabelFlooring: pick(s?.propSpecLabelFlooring, d.propSpecLabelFlooring),
    propSpecLabelDoors: pick(s?.propSpecLabelDoors, d.propSpecLabelDoors),
    propSpecLabelWindows: pick(s?.propSpecLabelWindows, d.propSpecLabelWindows),
  };
}

export type EnquiryCopy = Pick<
  PublicSiteCopy,
  | "enquiryThankTitle"
  | "enquiryThankBody"
  | "enquiryPlaceholderName"
  | "enquiryPlaceholderMobile"
  | "enquiryPlaceholderEmail"
  | "enquiryPlaceholderLooking"
  | "enquiryPlaceholderProject"
  | "enquirySubmitSending"
  | "enquirySubmitLabel"
  | "enquiryPrivacyNote"
  | "enquiryErrorAlert"
>;

export function enquiryCopyFrom(c: PublicSiteCopy): EnquiryCopy {
  return {
    enquiryThankTitle: c.enquiryThankTitle,
    enquiryThankBody: c.enquiryThankBody,
    enquiryPlaceholderName: c.enquiryPlaceholderName,
    enquiryPlaceholderMobile: c.enquiryPlaceholderMobile,
    enquiryPlaceholderEmail: c.enquiryPlaceholderEmail,
    enquiryPlaceholderLooking: c.enquiryPlaceholderLooking,
    enquiryPlaceholderProject: c.enquiryPlaceholderProject,
    enquirySubmitSending: c.enquirySubmitSending,
    enquirySubmitLabel: c.enquirySubmitLabel,
    enquiryPrivacyNote: c.enquiryPrivacyNote,
    enquiryErrorAlert: c.enquiryErrorAlert,
  };
}

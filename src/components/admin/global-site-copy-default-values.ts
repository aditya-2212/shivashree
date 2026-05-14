import type { SiteSettings } from "@prisma/client";
import { withSiteDefault } from "@/lib/site-defaults";
import {
  SITE_COPY_DEFAULTS,
  DEFAULT_ABOUT_PROCESS_STEPS,
  DEFAULT_ABOUT_QUALITY_POINTS,
  DEFAULT_ABOUT_PROMISES,
  DEFAULT_HOME_FAQ_ITEMS,
  DEFAULT_PROJECTS_FAQ_ITEMS,
} from "@/lib/site-copy-defaults";

function jstr(v: unknown, fallback: unknown) {
  return JSON.stringify(v ?? fallback, null, 2);
}

/** React-hook-form defaultValues for global site copy fields. */
export function globalSiteCopyDefaultValues(initialData: SiteSettings | null) {
  const d = SITE_COPY_DEFAULTS;
  const w = <T extends keyof SiteSettings>(k: T, def: string) =>
    withSiteDefault((initialData?.[k] as string | null | undefined) ?? null, def);

  return {
    aboutMetaTitle: w("aboutMetaTitle", d.aboutMetaTitle),
    aboutMetaDescription: w("aboutMetaDescription", d.aboutMetaDescription),
    homeMetaTitle: w("homeMetaTitle", d.homeMetaTitle),
    homeMetaDescription: w("homeMetaDescription", d.homeMetaDescription),
    projectsMetaTitle: w("projectsMetaTitle", d.projectsMetaTitle),
    projectsMetaDescription: w("projectsMetaDescription", d.projectsMetaDescription),
    aboutVisionEyebrow: w("aboutVisionEyebrow", d.aboutVisionEyebrow),
    aboutVisionBody: w("aboutVisionBody", d.aboutVisionBody),
    aboutMissionEyebrow: w("aboutMissionEyebrow", d.aboutMissionEyebrow),
    aboutMissionBody: w("aboutMissionBody", d.aboutMissionBody),
    aboutProcessEyebrow: w("aboutProcessEyebrow", d.aboutProcessEyebrow),
    aboutProcessHeading: w("aboutProcessHeading", d.aboutProcessHeading),
    aboutProcessStepsJson: jstr(initialData?.aboutProcessStepsJson, DEFAULT_ABOUT_PROCESS_STEPS),
    aboutProcessImageAlt: w("aboutProcessImageAlt", d.aboutProcessImageAlt),
    aboutProcessEmptyTitle: w("aboutProcessEmptyTitle", d.aboutProcessEmptyTitle),
    aboutProcessEmptyHintLine1: w("aboutProcessEmptyHintLine1", d.aboutProcessEmptyHintLine1),
    aboutProcessEmptyHintLine2: w("aboutProcessEmptyHintLine2", d.aboutProcessEmptyHintLine2),
    aboutQualityEyebrow: w("aboutQualityEyebrow", d.aboutQualityEyebrow),
    aboutQualityHeading: w("aboutQualityHeading", d.aboutQualityHeading),
    aboutQualityIntro: w("aboutQualityIntro", d.aboutQualityIntro),
    aboutQualitySubheading: w("aboutQualitySubheading", d.aboutQualitySubheading),
    aboutQualityPointsJson: jstr(initialData?.aboutQualityPointsJson, DEFAULT_ABOUT_QUALITY_POINTS),
    aboutPromiseBlockTitle: w("aboutPromiseBlockTitle", d.aboutPromiseBlockTitle),
    aboutPromisesJson: jstr(initialData?.aboutPromisesJson, DEFAULT_ABOUT_PROMISES),
    aboutPromiseFooter: w("aboutPromiseFooter", d.aboutPromiseFooter),
    aboutWhereCorporateBadge: w("aboutWhereCorporateBadge", d.aboutWhereCorporateBadge),
    aboutWhereRegisteredBadge: w("aboutWhereRegisteredBadge", d.aboutWhereRegisteredBadge),
    aboutCtaBrowseProjectsLabel: w("aboutCtaBrowseProjectsLabel", d.aboutCtaBrowseProjectsLabel),
    contactMetaDescription: w("contactMetaDescription", d.contactMetaDescription),
    contactMapIframeTitle: w("contactMapIframeTitle", d.contactMapIframeTitle),
    homeFaqItemsJson: jstr(initialData?.homeFaqItemsJson, DEFAULT_HOME_FAQ_ITEMS),
    homeProjectsSeeAllLabel: w("homeProjectsSeeAllLabel", d.homeProjectsSeeAllLabel),
    homeProjectsEmptyMessage: w("homeProjectsEmptyMessage", d.homeProjectsEmptyMessage),
    homeHeroFallback1Heading: w("homeHeroFallback1Heading", d.homeHeroFallback1Heading),
    homeHeroFallback1Sub: w("homeHeroFallback1Sub", d.homeHeroFallback1Sub),
    homeHeroFallback1CtaLabel: w("homeHeroFallback1CtaLabel", d.homeHeroFallback1CtaLabel),
    homeHeroFallback1CtaUrl: w("homeHeroFallback1CtaUrl", d.homeHeroFallback1CtaUrl),
    homeHeroFallback2Heading: w("homeHeroFallback2Heading", d.homeHeroFallback2Heading),
    homeHeroFallback2Sub: w("homeHeroFallback2Sub", d.homeHeroFallback2Sub),
    homeHeroFallback2CtaLabel: w("homeHeroFallback2CtaLabel", d.homeHeroFallback2CtaLabel),
    homeHeroFallback2CtaUrl: w("homeHeroFallback2CtaUrl", d.homeHeroFallback2CtaUrl),
    homeHeroSlideEyebrowFallback: w("homeHeroSlideEyebrowFallback", d.homeHeroSlideEyebrowFallback),
    homeHeroEmptyEyebrow: w("homeHeroEmptyEyebrow", d.homeHeroEmptyEyebrow),
    homeHeroEmptyHeading: w("homeHeroEmptyHeading", d.homeHeroEmptyHeading),
    homeHeroEmptyCtaLabel: w("homeHeroEmptyCtaLabel", d.homeHeroEmptyCtaLabel),
    homeHeroEmptyCtaUrl: w("homeHeroEmptyCtaUrl", d.homeHeroEmptyCtaUrl),
    homeCardNoImageText: w("homeCardNoImageText", d.homeCardNoImageText),
    homeCardStartingAtLabel: w("homeCardStartingAtLabel", d.homeCardStartingAtLabel),
    homeCardPricingOnRequest: w("homeCardPricingOnRequest", d.homeCardPricingOnRequest),
    homeCardProjectPageLabel: w("homeCardProjectPageLabel", d.homeCardProjectPageLabel),
    homeCardTnreraPrefix: w("homeCardTnreraPrefix", d.homeCardTnreraPrefix),
    homeCtaCallbackTitle: w("homeCtaCallbackTitle", d.homeCtaCallbackTitle),
    homeCtaCallbackSubtitle: w("homeCtaCallbackSubtitle", d.homeCtaCallbackSubtitle),
    homeCtaPreferCallPrefix: w("homeCtaPreferCallPrefix", d.homeCtaPreferCallPrefix),
    homeCtaPreferCallSuffix: w("homeCtaPreferCallSuffix", d.homeCtaPreferCallSuffix),
    projectsFaqItemsJson: jstr(initialData?.projectsFaqItemsJson, DEFAULT_PROJECTS_FAQ_ITEMS),
    projectsHeroEyebrow: w("projectsHeroEyebrow", d.projectsHeroEyebrow),
    projectsHeroTitle: w("projectsHeroTitle", d.projectsHeroTitle),
    projectsHeroIntro: w("projectsHeroIntro", d.projectsHeroIntro),
    projectsSecOngoingLabel: w("projectsSecOngoingLabel", d.projectsSecOngoingLabel),
    projectsSecOngoingSub: w("projectsSecOngoingSub", d.projectsSecOngoingSub),
    projectsSecProposedLabel: w("projectsSecProposedLabel", d.projectsSecProposedLabel),
    projectsSecProposedSub: w("projectsSecProposedSub", d.projectsSecProposedSub),
    projectsSecCompletedLabel: w("projectsSecCompletedLabel", d.projectsSecCompletedLabel),
    projectsSecCompletedSub: w("projectsSecCompletedSub", d.projectsSecCompletedSub),
    projectsSecSoldOutLabel: w("projectsSecSoldOutLabel", d.projectsSecSoldOutLabel),
    projectsSecSoldOutSub: w("projectsSecSoldOutSub", d.projectsSecSoldOutSub),
    projectsCardNoImageText: w("projectsCardNoImageText", d.projectsCardNoImageText),
    projectsCardStartingAtLabel: w("projectsCardStartingAtLabel", d.projectsCardStartingAtLabel),
    projectsCardPricingOnRequest: w("projectsCardPricingOnRequest", d.projectsCardPricingOnRequest),
    projectsCardProjectPageLabel: w("projectsCardProjectPageLabel", d.projectsCardProjectPageLabel),
    projectsCardTnreraPrefix: w("projectsCardTnreraPrefix", d.projectsCardTnreraPrefix),
    statusLabelProposed: w("statusLabelProposed", d.statusLabelProposed),
    statusLabelOngoing: w("statusLabelOngoing", d.statusLabelOngoing),
    statusLabelCompleted: w("statusLabelCompleted", d.statusLabelCompleted),
    statusLabelSoldOut: w("statusLabelSoldOut", d.statusLabelSoldOut),
    footerBrandTagline: w("footerBrandTagline", d.footerBrandTagline),
    footerSitemapHeading: w("footerSitemapHeading", d.footerSitemapHeading),
    footerCorporateHeading: w("footerCorporateHeading", d.footerCorporateHeading),
    footerRegisteredHeading: w("footerRegisteredHeading", d.footerRegisteredHeading),
    footerReraTitle: w("footerReraTitle", d.footerReraTitle),
    footerReraBody: w("footerReraBody", d.footerReraBody),
    footerBottomLocationLine: w("footerBottomLocationLine", d.footerBottomLocationLine),
    footerMapIframeTitle: w("footerMapIframeTitle", d.footerMapIframeTitle),
    navLabelHome: w("navLabelHome", d.navLabelHome),
    navLabelProjects: w("navLabelProjects", d.navLabelProjects),
    navLabelResources: w("navLabelResources", d.navLabelResources),
    navLabelContact: w("navLabelContact", d.navLabelContact),
    navLabelAbout: w("navLabelAbout", d.navLabelAbout),
    navProjectsSeeAllLabel: w("navProjectsSeeAllLabel", d.navProjectsSeeAllLabel),
    navResourcesBlogTitle: w("navResourcesBlogTitle", d.navResourcesBlogTitle),
    navResourcesBlogSubtitle: w("navResourcesBlogSubtitle", d.navResourcesBlogSubtitle),
    navResourcesFaqsTitle: w("navResourcesFaqsTitle", d.navResourcesFaqsTitle),
    navResourcesFaqsSubtitle: w("navResourcesFaqsSubtitle", d.navResourcesFaqsSubtitle),
    navWhatsappCtaLabel: w("navWhatsappCtaLabel", d.navWhatsappCtaLabel),
    navWhatsappPrefillMessage: w("navWhatsappPrefillMessage", d.navWhatsappPrefillMessage),
    navMobileMenuOpenA11y: w("navMobileMenuOpenA11y", d.navMobileMenuOpenA11y),
    navMobileMenuCloseA11y: w("navMobileMenuCloseA11y", d.navMobileMenuCloseA11y),
    navMobileAllProjectsLabel: w("navMobileAllProjectsLabel", d.navMobileAllProjectsLabel),
    enquiryThankTitle: w("enquiryThankTitle", d.enquiryThankTitle),
    enquiryThankBody: w("enquiryThankBody", d.enquiryThankBody),
    enquiryPlaceholderName: w("enquiryPlaceholderName", d.enquiryPlaceholderName),
    enquiryPlaceholderMobile: w("enquiryPlaceholderMobile", d.enquiryPlaceholderMobile),
    enquiryPlaceholderEmail: w("enquiryPlaceholderEmail", d.enquiryPlaceholderEmail),
    enquiryPlaceholderLooking: w("enquiryPlaceholderLooking", d.enquiryPlaceholderLooking),
    enquiryPlaceholderProject: w("enquiryPlaceholderProject", d.enquiryPlaceholderProject),
    enquirySubmitSending: w("enquirySubmitSending", d.enquirySubmitSending),
    enquirySubmitLabel: w("enquirySubmitLabel", d.enquirySubmitLabel),
    enquiryPrivacyNote: w("enquiryPrivacyNote", d.enquiryPrivacyNote),
    enquiryErrorAlert: w("enquiryErrorAlert", d.enquiryErrorAlert),
    floatWhatsappPrefillMessage: w("floatWhatsappPrefillMessage", d.floatWhatsappPrefillMessage),
    floatWhatsappAriaLabel: w("floatWhatsappAriaLabel", d.floatWhatsappAriaLabel),
    structuredOrgName: w("structuredOrgName", d.structuredOrgName),
    structuredOrgDescription: w("structuredOrgDescription", d.structuredOrgDescription),
    propDetailBreadcrumbHome: w("propDetailBreadcrumbHome", d.propDetailBreadcrumbHome),
    propDetailBreadcrumbProjects: w("propDetailBreadcrumbProjects", d.propDetailBreadcrumbProjects),
    propDetailDtStartingAt: w("propDetailDtStartingAt", d.propDetailDtStartingAt),
    propDetailDtConfigurations: w("propDetailDtConfigurations", d.propDetailDtConfigurations),
    propDetailDtTnrera: w("propDetailDtTnrera", d.propDetailDtTnrera),
    propDetailDtLocation: w("propDetailDtLocation", d.propDetailDtLocation),
    propDetailHighlightsHeading: w("propDetailHighlightsHeading", d.propDetailHighlightsHeading),
    propDetailGalleryHeading: w("propDetailGalleryHeading", d.propDetailGalleryHeading),
    propDetailAmenitiesHeading: w("propDetailAmenitiesHeading", d.propDetailAmenitiesHeading),
    propDetailSpecificationsHeading: w(
      "propDetailSpecificationsHeading",
      d.propDetailSpecificationsHeading
    ),
    propDetailFloorPlansHeading: w("propDetailFloorPlansHeading", d.propDetailFloorPlansHeading),
    propDetailNeighbourhoodHeading: w("propDetailNeighbourhoodHeading", d.propDetailNeighbourhoodHeading),
    propDetailFaqsHeading: w("propDetailFaqsHeading", d.propDetailFaqsHeading),
    propDetailBackLinkLabel: w("propDetailBackLinkLabel", d.propDetailBackLinkLabel),
    propDetailEnquiryTitleTemplate: w(
      "propDetailEnquiryTitleTemplate",
      d.propDetailEnquiryTitleTemplate
    ),
    propDetailEnquiryIntro: w("propDetailEnquiryIntro", d.propDetailEnquiryIntro),
    propDetailStatusBoxLabel: w("propDetailStatusBoxLabel", d.propDetailStatusBoxLabel),
    propDetailStatusBlurbProposed: w("propDetailStatusBlurbProposed", d.propDetailStatusBlurbProposed),
    propDetailStatusBlurbOngoing: w("propDetailStatusBlurbOngoing", d.propDetailStatusBlurbOngoing),
    propDetailStatusBlurbCompleted: w(
      "propDetailStatusBlurbCompleted",
      d.propDetailStatusBlurbCompleted
    ),
    propDetailStatusBlurbSoldOut: w("propDetailStatusBlurbSoldOut", d.propDetailStatusBlurbSoldOut),
    propSpecLabelBuilding: w("propSpecLabelBuilding", d.propSpecLabelBuilding),
    propSpecLabelBathroom: w("propSpecLabelBathroom", d.propSpecLabelBathroom),
    propSpecLabelKitchen: w("propSpecLabelKitchen", d.propSpecLabelKitchen),
    propSpecLabelFlooring: w("propSpecLabelFlooring", d.propSpecLabelFlooring),
    propSpecLabelDoors: w("propSpecLabelDoors", d.propSpecLabelDoors),
    propSpecLabelWindows: w("propSpecLabelWindows", d.propSpecLabelWindows),
  };
}

const JSON_KEYS = [
  "aboutProcessStepsJson",
  "aboutQualityPointsJson",
  "aboutPromisesJson",
  "homeFaqItemsJson",
  "projectsFaqItemsJson",
] as const;

export function parseGlobalJsonFromForm(data: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...data };
  for (const key of JSON_KEYS) {
    const raw = out[key];
    if (typeof raw !== "string") continue;
    const t = raw.trim();
    if (t === "") {
      delete out[key];
      continue;
    }
    try {
      out[key] = JSON.parse(t);
    } catch {
      throw new Error(`Invalid JSON for ${key}`);
    }
  }
  return out;
}

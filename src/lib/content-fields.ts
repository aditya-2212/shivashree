import type { ContentSection } from "@/components/admin/ContentForm";
import {
  homePageDefaults as H,
  aboutPageDefaults as A,
  contactPageDefaults as C,
  faqsPageDefaults as F,
  blogListingDefaults as B,
} from "@/lib/site-defaults";

/*
  Field definitions for the per-page CMS screens. `default` is the current live
  text — ContentForm pre-fills each box with it so editing is just changing what
  you see. Field `name`s map 1:1 to SiteSettings columns.
*/

export const HOME_SECTIONS: ContentSection[] = [
  {
    title: "Projects section",
    description: "The intro above the project cards on the homepage.",
    fields: [
      { name: "homeProjectsEyebrow", label: "Small label (eyebrow)", type: "text", default: H.projectsEyebrow },
      { name: "homeProjectsHeading", label: "Heading", type: "textarea", rows: 2, default: H.projectsHeading },
      { name: "homeProjectsSubheading", label: "Intro paragraph", type: "textarea", default: H.projectsSubheading },
    ],
  },
  {
    title: '"Why Us?" cards',
    description: "Three feature cards with a title, body and photo each.",
    fields: [
      { name: "homeWhyEyebrow", label: "Section eyebrow", type: "text", default: H.whyEyebrow },
      { name: "homeWhyHeading", label: "Section heading", type: "text", default: H.whyHeading },
      { name: "homeCard1Title", label: "Card 1 — title", type: "text", default: H.card1Title },
      { name: "homeCard1Body", label: "Card 1 — body", type: "textarea", default: H.card1Body },
      { name: "homeCard1Image", label: "Card 1 — image", type: "image", hint: "Landscape photo, at least 800×500 px." },
      { name: "homeCard2Title", label: "Card 2 — title", type: "text", default: H.card2Title },
      { name: "homeCard2Body", label: "Card 2 — body", type: "textarea", default: H.card2Body },
      { name: "homeCard2Image", label: "Card 2 — image", type: "image", hint: "Landscape photo, at least 800×500 px." },
      { name: "homeCard3Title", label: "Card 3 — title", type: "text", default: H.card3Title },
      { name: "homeCard3Body", label: "Card 3 — body", type: "textarea", default: H.card3Body },
      { name: "homeCard3Image", label: "Card 3 — image", type: "image", hint: "Landscape photo, at least 800×500 px." },
    ],
  },
  {
    title: "Callback form copy",
    fields: [
      { name: "homeFormTitle", label: "Form title", type: "text", default: H.formTitle },
      { name: "homeFormNote", label: "Form note (small text)", type: "text", default: H.formNote },
      { name: "homeCallLabel", label: '"Prefer to call" lead-in', type: "text", default: H.callLabel, hint: "Shown just before the phone number." },
      { name: "homeCallSuffix", label: '"Prefer to call" trailing text', type: "text", default: H.callSuffix, hint: "Shown just after the phone number." },
    ],
  },
  {
    title: "Bottom CTA (enquiry section)",
    fields: [
      { name: "homeCtaEyebrow", label: "Eyebrow", type: "text", default: H.ctaEyebrow },
      { name: "homeCtaHeading", label: "Heading", type: "text", default: H.ctaHeading },
      { name: "homeCtaBody", label: "Body text", type: "textarea", default: H.ctaBody },
    ],
  },
  {
    title: "Search engine listing (SEO)",
    description: "Shown in the browser tab and Google results.",
    fields: [
      { name: "homeMetaTitle", label: "Meta title", type: "textarea", rows: 2, default: H.metaTitle },
      { name: "homeMetaDescription", label: "Meta description", type: "textarea", default: H.metaDescription, hint: "Aim for 150–160 characters." },
    ],
  },
];

export const ABOUT_SECTIONS: ContentSection[] = [
  {
    title: "Hero",
    fields: [
      { name: "aboutHeroEyebrow", label: "Eyebrow", type: "text", default: A.heroEyebrow },
      { name: "aboutHeroTitle", label: "Title", type: "textarea", rows: 2, default: A.heroTitle, hint: "Press Enter for a line break." },
      { name: "aboutHeroLead", label: "Lead paragraph", type: "textarea", default: A.heroLead },
    ],
  },
  {
    title: "Story section",
    description: "Optional — appears only when the title or body has content.",
    fields: [
      { name: "aboutStoryTitle", label: "Section title", type: "text", default: A.storyTitle },
      { name: "aboutStoryBodyHtml", label: "Story body (rich text)", type: "richtext" },
    ],
  },
  {
    title: "Commitments",
    fields: [
      { name: "aboutCommitmentsTitle", label: "Section title", type: "text", default: A.commitmentsTitle },
      { name: "aboutC1Title", label: "Commitment 1 — title", type: "text", default: A.c1Title },
      { name: "aboutC1Body", label: "Commitment 1 — body", type: "textarea", default: A.c1Body },
      { name: "aboutC2Title", label: "Commitment 2 — title", type: "text", default: A.c2Title },
      { name: "aboutC2Body", label: "Commitment 2 — body", type: "textarea", default: A.c2Body },
      { name: "aboutC3Title", label: "Commitment 3 — title", type: "text", default: A.c3Title },
      { name: "aboutC3Body", label: "Commitment 3 — body", type: "textarea", default: A.c3Body },
    ],
  },
  {
    title: "Vision & Mission",
    fields: [
      { name: "aboutVisionLabel", label: "Vision label", type: "text", default: A.visionLabel },
      { name: "aboutVisionBody", label: "Vision text", type: "textarea", default: A.visionBody },
      { name: "aboutMissionLabel", label: "Mission label", type: "text", default: A.missionLabel },
      { name: "aboutMissionBody", label: "Mission text", type: "textarea", default: A.missionBody },
    ],
  },
  {
    title: "Our Process",
    fields: [
      { name: "aboutProcessEyebrow", label: "Eyebrow", type: "text", default: A.processEyebrow },
      { name: "aboutProcessHeading", label: "Section heading", type: "textarea", rows: 2, default: A.processHeading },
      { name: "aboutProcess1Title", label: "Step 1 — title", type: "text", default: A.process1Title },
      { name: "aboutProcess1Body", label: "Step 1 — body", type: "textarea", rows: 2, default: A.process1Body },
      { name: "aboutProcess2Title", label: "Step 2 — title", type: "text", default: A.process2Title },
      { name: "aboutProcess2Body", label: "Step 2 — body", type: "textarea", rows: 2, default: A.process2Body },
      { name: "aboutProcess3Title", label: "Step 3 — title", type: "text", default: A.process3Title },
      { name: "aboutProcess3Body", label: "Step 3 — body", type: "textarea", rows: 2, default: A.process3Body },
      { name: "aboutProcess4Title", label: "Step 4 — title", type: "text", default: A.process4Title },
      { name: "aboutProcess4Body", label: "Step 4 — body", type: "textarea", rows: 2, default: A.process4Body },
    ],
  },
  {
    title: "Quality Guarantee",
    fields: [
      { name: "aboutQualityEyebrow", label: "Eyebrow", type: "text", default: A.qualityEyebrow },
      { name: "aboutQualityHeading", label: "Section heading", type: "textarea", rows: 2, default: A.qualityHeading },
      { name: "aboutQualityIntro", label: "Section intro", type: "textarea", rows: 2, default: A.qualityIntro },
      { name: "aboutQualitySubheading", label: '"What sets us apart" subheading', type: "text", default: A.qualitySubheading },
      { name: "aboutQuality1Title", label: "Point 1 — title", type: "text", default: A.quality1Title },
      { name: "aboutQuality1Body", label: "Point 1 — body", type: "textarea", rows: 2, default: A.quality1Body },
      { name: "aboutQuality2Title", label: "Point 2 — title", type: "text", default: A.quality2Title },
      { name: "aboutQuality2Body", label: "Point 2 — body", type: "textarea", rows: 2, default: A.quality2Body },
      { name: "aboutQuality3Title", label: "Point 3 — title", type: "text", default: A.quality3Title },
      { name: "aboutQuality3Body", label: "Point 3 — body", type: "textarea", rows: 2, default: A.quality3Body },
      { name: "aboutQuality4Title", label: "Point 4 — title", type: "text", default: A.quality4Title },
      { name: "aboutQuality4Body", label: "Point 4 — body", type: "textarea", rows: 2, default: A.quality4Body },
      { name: "aboutQuality5Title", label: "Point 5 — title", type: "text", default: A.quality5Title },
      { name: "aboutQuality5Body", label: "Point 5 — body", type: "textarea", rows: 2, default: A.quality5Body },
    ],
  },
  {
    title: "Our Promise",
    fields: [
      { name: "aboutPromiseTitle", label: "Box title", type: "text", default: A.promiseTitle },
      { name: "aboutPromise1Label", label: "Promise 1 — label", type: "text", default: A.promise1Label },
      { name: "aboutPromise1Desc", label: "Promise 1 — description", type: "textarea", rows: 2, default: A.promise1Desc },
      { name: "aboutPromise2Label", label: "Promise 2 — label", type: "text", default: A.promise2Label },
      { name: "aboutPromise2Desc", label: "Promise 2 — description", type: "textarea", rows: 2, default: A.promise2Desc },
      { name: "aboutPromise3Label", label: "Promise 3 — label", type: "text", default: A.promise3Label },
      { name: "aboutPromise3Desc", label: "Promise 3 — description", type: "textarea", rows: 2, default: A.promise3Desc },
      { name: "aboutPromise4Label", label: "Promise 4 — label", type: "text", default: A.promise4Label },
      { name: "aboutPromise4Desc", label: "Promise 4 — description", type: "textarea", rows: 2, default: A.promise4Desc },
      { name: "aboutPromiseNote", label: "Closing note (small text)", type: "textarea", rows: 2, default: A.promiseNote },
    ],
  },
  {
    title: "Where to find us",
    description: "Addresses come from the global Site settings page.",
    fields: [
      { name: "aboutWhereTitle", label: "Section title", type: "text", default: A.whereTitle },
      { name: "aboutWhereIntro", label: "Section intro", type: "textarea", rows: 2, default: A.whereIntro },
    ],
  },
  {
    title: "Bottom CTA",
    fields: [
      { name: "aboutCtaTitle", label: "CTA heading", type: "text", default: A.ctaTitle },
      { name: "aboutCtaBody", label: "CTA body text", type: "textarea", default: A.ctaBody },
    ],
  },
  {
    title: "Search engine listing (SEO)",
    fields: [
      { name: "aboutMetaTitle", label: "Meta title", type: "textarea", rows: 2, default: A.metaTitle },
      { name: "aboutMetaDescription", label: "Meta description", type: "textarea", default: A.metaDescription, hint: "Aim for 150–160 characters." },
    ],
  },
];

export const CONTACT_SECTIONS: ContentSection[] = [
  {
    title: "Hero",
    fields: [
      { name: "contactHeroEyebrow", label: "Eyebrow", type: "text", default: C.heroEyebrow },
      { name: "contactHeroTitle", label: "Title", type: "textarea", rows: 2, default: C.heroTitle },
      { name: "contactHeroIntro", label: "Intro paragraph", type: "textarea", default: C.heroIntro },
    ],
  },
  {
    title: "Office cards & hours",
    description: "Addresses, phone and email come from the global Site settings page.",
    fields: [
      { name: "contactCorporateLabel", label: "Corporate office label", type: "text", default: C.corporateLabel },
      { name: "contactRegisteredLabel", label: "Registered office label", type: "text", default: C.registeredLabel },
      { name: "contactHoursTitle", label: "Hours box title", type: "text", default: C.hoursTitle },
      { name: "contactHoursWeekdays", label: "Weekdays line", type: "text", default: C.hoursWeekdays, hint: 'Use " · " between the days and the time.' },
      { name: "contactHoursSunday", label: "Sunday line", type: "text", default: C.hoursSunday, hint: 'Use " · " between the day and the time.' },
      { name: "contactHoursNote", label: "Hours note (small text)", type: "textarea", rows: 2, default: C.hoursNote },
    ],
  },
  {
    title: "Enquiry form",
    fields: [
      { name: "contactFormTitle", label: "Form title", type: "text", default: C.formTitle },
      { name: "contactFormIntro", label: "Form intro", type: "textarea", rows: 2, default: C.formIntro },
    ],
  },
  {
    title: "Search engine listing (SEO)",
    fields: [
      { name: "contactMetaTitle", label: "Meta title", type: "textarea", rows: 2, default: C.metaTitle },
      { name: "contactMetaDescription", label: "Meta description", type: "textarea", default: C.metaDescription, hint: "Aim for 150–160 characters." },
    ],
  },
];

export const RESOURCES_SECTIONS: ContentSection[] = [
  {
    title: 'Notes & guides — header',
    description: "The purple header on /resources/blog (the blog listing).",
    fields: [
      { name: "blogHeroEyebrow", label: "Eyebrow", type: "text", default: B.heroEyebrow },
      { name: "blogHeroHeading", label: "Heading", type: "text", default: B.heroHeading },
      { name: "blogHeroIntro", label: "Intro paragraph", type: "textarea", default: B.heroIntro },
    ],
  },
  {
    title: "Notes & guides — other copy",
    fields: [
      { name: "blogEmptyText", label: '"No posts yet" message', type: "text", default: B.emptyText },
      { name: "blogCtaText", label: "Bottom CTA text", type: "text", default: B.ctaText },
      { name: "blogCtaButtonLabel", label: "Bottom CTA button label", type: "text", default: B.ctaButtonLabel },
    ],
  },
  {
    title: "Notes & guides — SEO",
    fields: [
      { name: "blogMetaTitle", label: "Meta title", type: "textarea", rows: 2, default: B.metaTitle },
      { name: "blogMetaDescription", label: "Meta description", type: "textarea", default: B.metaDescription, hint: "Aim for 150–160 characters." },
    ],
  },
  {
    title: "FAQs page — header",
    description: "The purple header on /resources/faqs. (The questions are managed under FAQs.)",
    fields: [
      { name: "faqsHeroEyebrow", label: "Eyebrow", type: "text", default: F.heroEyebrow },
      { name: "faqsHeroHeading", label: "Heading", type: "text", default: F.heroHeading },
      { name: "faqsHeroIntro", label: "Intro paragraph", type: "textarea", default: F.heroIntro },
    ],
  },
  {
    title: "FAQs page — bottom CTA",
    fields: [
      { name: "faqsCtaText", label: "CTA text", type: "text", default: F.ctaText },
      { name: "faqsCtaButtonLabel", label: "CTA button label", type: "text", default: F.ctaButtonLabel },
    ],
  },
  {
    title: "FAQs page — SEO",
    fields: [
      { name: "faqsMetaTitle", label: "Meta title", type: "textarea", rows: 2, default: F.metaTitle },
      { name: "faqsMetaDescription", label: "Meta description", type: "textarea", default: F.metaDescription, hint: "Aim for 150–160 characters." },
    ],
  },
];

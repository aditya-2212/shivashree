/**
 * Single source of truth for CMS fallbacks. Public pages and the admin
 * Site Settings form use the same strings when a field is empty in the DB.
 */

/** Use saved value when non-empty after trim; otherwise the live-site default. */
export function withSiteDefault(
  value: string | null | undefined,
  fallback: string
): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

export const contactPageDefaults = {
  metaTitle: "Contact Shivashree Developers | Apartments in Kumbakonam & Chennai",
  metaDescription:
    "Get in touch with Shivashree Developers for luxury 2 & 3 BHK apartments in Kumbakonam and Chennai. Enquire about projects, pricing, and bookings today.",
  heroEyebrow: "Contact",
  heroTitle: "Two offices, one team, real phones.",
  heroIntro:
    "Walk in, call, or fill in the form. Whichever way you reach us, the same person handles the conversation from start to finish.",
  corporateLabel: "Corporate office — Chennai",
  registeredLabel: "Registered office — Kumbakonam",
  hoursTitle: "When we're in office",
  hoursWeekdays: "Monday – Saturday · 9:00am – 6:00pm",
  hoursSunday: "Sunday · 10:00am – 2:00pm",
  hoursNote:
    "Sunday hours are limited — call ahead so a project advisor is available when you arrive.",
  formTitle: "Send us an enquiry",
  formIntro:
    "Two fields are required — your name and your number. The rest help us route the call to the right project advisor.",
} as const;

export const homePageDefaults = {
  projectsEyebrow: "Discover Your Dream With Us",
  projectsHeading:
    "Step Into Excellence with Shivashree Developers — Where Dreams Find a Home",
  projectsSubheading:
    "For over a decade, we have been creating exceptional apartments in Kumbakonam, blending quality, dedication, reliability, and excellence. Known for transforming plots into stunning homes, we've earned a solid reputation as a trusted property developer.",
  whyEyebrow: "Why Us?",
  whyHeading: "Crafting Spaces with Care and Precision",
  card1Title: "A Legacy of Trust, A Decade of Expertise",
  card1Body:
    "For over a decade, Shivashree Developers has been a trusted name in real estate, delivering exceptional service with integrity. We offer tailored solutions, ensuring a seamless experience for first-time buyers and seasoned investors alike.",
  card2Title: "Building Trust, Delivering Excellence",
  card2Body:
    "Trust and excellence define everything we do. We take pride in delivering high-quality homes that embody comfort, value, and reliability. Whether buying or investing, count on us to make your real estate journey seamless and rewarding.",
  card3Title: "Creating Spaces with Diligence and Precision",
  card3Body:
    "Every space we build is planned carefully and designed thoughtfully to meet high standards. From the foundation to the finishing touches, we focus on creating homes that are comfortable, long-lasting, and full of value.",
  ctaEyebrow: "Enquire Now",
  ctaHeading: "At the heart of our work is a commitment to customer satisfaction.",
  ctaBody:
    "Your dream home isn't just built — it's brought to life. Tell us your name and number and we'll call you back to find the right home for you.",
} as const;

export const aboutPageDefaults = {
  heroEyebrow: "About Shivashree Developers",
  heroTitle: "About Shivashree Developers",
  heroLead:
    "At Shivashree Developers, we believe in building more than just properties — we build dreams, trust, and lasting relationships. With a legacy of excellence and a commitment to innovation, we have established ourselves as a trusted name in the real estate industry.",
  storyTitle: "Why we still build only here.",
  commitmentsTitle: "What you can hold us to.",
  c1Title: "RERA-first paperwork",
  c1Body:
    "Every project is registered before we take a booking advance. You see the registration number on hoardings, brochures, and your agreement.",
  c2Title: "No surprise add-ons",
  c2Body:
    "The price sheet lists what is included in the base rate and what is optional. If it is not on the sheet, we do not invoice it mid-construction.",
  c3Title: "One team end-to-end",
  c3Body:
    "The person who walks you through the model flat is the same team that coordinates handover. You are not handed off between departments.",
  whereTitle: "Where to find us in person.",
  whereIntro:
    "We'd much rather you walked in than filled in a form. Both offices have a model floor plan you can see on the table.",
  ctaTitle: "Create your dream home.",
  ctaBody:
    "Tell us what you're looking for — whether you're a first-time buyer, an NRI investor, or a parent buying for an adult child. The advisor who handles your city will call you back.",
} as const;

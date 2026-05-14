/**
 * Default copy for every Site Settings field introduced for full-site CMS.
 * Public pages merge DB values over these (non-empty DB wins).
 */

export type FaqItem = { question: string; answer: string };
export type AboutProcessStep = { n: string; title: string; body: string };
export type AboutQualityPoint = { title: string; body: string };
export type AboutPromiseItem = { label: string; desc: string };

export const DEFAULT_ABOUT_PROCESS_STEPS: AboutProcessStep[] = [
  {
    n: "01",
    title: "Explore Options",
    body: "We help you choose from a range of thoughtfully designed apartments in prime locations. Whether it's the size, layout, or amenities, we guide you in finding the perfect fit for your needs.",
  },
  {
    n: "02",
    title: "Explore layouts and finishes",
    body: "Review floor plans, specifications, and finishes with our team so you can compare options and choose what fits your family before you book.",
  },
  {
    n: "03",
    title: "Book and Secure",
    body: "Once you've chosen your dream apartment, we ensure a smooth booking process with transparent documentation and flexible payment plans to suit your budget.",
  },
  {
    n: "04",
    title: "Handover and Support",
    body: "After construction is complete, we hand over your apartment, fully inspected and ready for you to move in. Our team remains available for any post-handover assistance you may need.",
  },
];

export const DEFAULT_ABOUT_QUALITY_POINTS: AboutQualityPoint[] = [
  {
    title: "Premium Materials",
    body: "We use only the finest materials, sourced from trusted suppliers, to ensure every apartment is built to the highest standards.",
  },
  {
    title: "Expert Craftsmanship",
    body: "Our team of experienced architects, engineers, and construction professionals ensures precision and excellence at every stage of development.",
  },
  {
    title: "Attention to Detail",
    body: "From structural integrity to interior finishes, we leave no detail overlooked, ensuring a perfect blend of aesthetics and functionality.",
  },
  {
    title: "Sustainable Practices",
    body: "We incorporate eco-friendly building techniques and materials to create spaces that are environmentally conscious and energy-efficient.",
  },
  {
    title: "Rigorous Quality Checks",
    body: "Every project undergoes multiple levels of inspection and quality control to meet both industry standards and our own stringent benchmarks.",
  },
];

export const DEFAULT_ABOUT_PROMISES: AboutPromiseItem[] = [
  { label: "Durability", desc: "Apartments designed to stand the test of time." },
  { label: "Comfort", desc: "Thoughtful layouts and modern amenities for a superior living experience." },
  { label: "Transparency", desc: "Clear communication and complete documentation at every step." },
  { label: "Customer Satisfaction", desc: "Your happiness is our top priority, even after the handover." },
];

export const DEFAULT_HOME_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What are the best 2 & 3 BHK apartments for sale in Kumbakonam?",
    answer:
      "Shivashree Developers offers premium 2 & 3 BHK apartments for sale in Kumbakonam with modern amenities, prime locations, and quality construction, ideal for both families and investors.",
  },
  {
    question: "Are there affordable 2 BHK flats for sale in Kumbakonam?",
    answer:
      "Yes, affordable 2 BHK flats for sale in Kumbakonam are available with essential amenities and good connectivity. These homes are perfect for first-time buyers and small families.",
  },
  {
    question: "Why should Chennai buyers invest in apartments in Kumbakonam?",
    answer:
      "Chennai buyers prefer investing in Kumbakonam apartments due to lower property prices, peaceful living environment, and high future appreciation potential compared to metro cities.",
  },
  {
    question: "What amenities are included in 2 & 3 BHK apartments in Kumbakonam?",
    answer:
      "Apartments typically include car parking, 24/7 security, power backup, water supply, and easy access to schools, hospitals, and transport facilities.",
  },
  {
    question: "Are 3 BHK apartments in Kumbakonam a good investment?",
    answer:
      "Yes, 3 BHK apartments in Kumbakonam offer larger space, better resale value, and growing demand, making them a strong long-term investment option.",
  },
  {
    question: "How is the location advantage of buying flats in Kumbakonam?",
    answer:
      "Kumbakonam offers excellent connectivity to Chennai and other cities, along with a calm lifestyle, cultural importance, and developing infrastructure, making it a preferred residential location.",
  },
];

export const DEFAULT_PROJECTS_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What ongoing apartment projects are available in Kumbakonam?",
    answer:
      "Shivashree Developers offers ongoing residential projects in Kumbakonam featuring premium 2 and 3 BHK apartments with modern amenities and quality construction.",
  },
  {
    question: "Are 2 & 3 BHK apartments available for sale in Kumbakonam projects?",
    answer:
      "Yes, the projects include well-designed 2 and 3 BHK apartments for sale in Kumbakonam suitable for families and investors.",
  },
  {
    question: "Why invest in ongoing projects in Kumbakonam?",
    answer:
      "Ongoing projects in Kumbakonam offer better pricing, flexible payment options, and strong appreciation potential, making them a smart investment choice.",
  },
  {
    question: "What amenities are included in these apartment projects?",
    answer:
      "Projects typically include car parking, security, power backup, water supply, and proximity to schools, hospitals, and transport facilities.",
  },
  {
    question: "Are these projects suitable for Chennai-based buyers?",
    answer:
      "Yes, Chennai buyers prefer investing in Kumbakonam due to affordable pricing, peaceful environment, and long-term growth potential.",
  },
  {
    question: "How to book an apartment in Shivashree Developers projects?",
    answer:
      "You can book an apartment by contacting Shivashree Developers through their website or visiting the project site for consultation and booking assistance.",
  },
];

/** Scalar + JSON defaults keyed like Prisma `SiteSettings` (camelCase). */
export const SITE_COPY_DEFAULTS = {
  aboutMetaTitle: "About Shivashree Developers | Trusted Builders in Kumbakonam & Chennai",
  aboutMetaDescription:
    "Learn about Shivashree Developers, a trusted real estate company in Kumbakonam delivering premium 2 & 3 BHK apartments with quality construction, transparency, and customer satisfaction.",
  homeMetaTitle:
    "Luxury 2 & 3 BHK Apartments for sale in Kumbakonam & Chennai | Shivashree Developers",
  homeMetaDescription:
    "Explore premium 2 & 3 BHK apartments in Kumbakonam and Chennai by Shivashree Developers. Modern amenities, prime locations, quality construction and affordable pricing. Book your dream home today.",
  projectsMetaTitle: "Ongoing Residential Projects in Kumbakonam | 2 & 3 BHK Apartments for Sale",
  projectsMetaDescription:
    "Explore ongoing residential projects in Kumbakonam by Shivashree Developers. Premium 2 & 3 BHK apartments for sale with modern amenities, prime locations, and quality construction. Ideal for homebuyers and Chennai investors.",

  aboutVisionEyebrow: "Our Vision",
  aboutVisionBody:
    "To redefine urban living by creating sustainable, innovative, and luxurious spaces that inspire and enrich lives.",
  aboutMissionEyebrow: "Our Mission",
  aboutMissionBody:
    "At Shivashree Developers, our mission is to deliver exceptional quality, value, and transparency in every project we undertake. We are dedicated to creating environments where families and businesses thrive.",
  aboutProcessEyebrow: "Our Process",
  aboutProcessHeading:
    "At Shivashree Developers, we understand that purchasing an apartment is more than just a transaction — it's a life-changing decision.",
  aboutProcessImageAlt: "Our process",
  aboutProcessEmptyTitle: "Upload an image via CMS",
  aboutProcessEmptyHintLine1: "Site Settings → Homepage → Card 1 Image",
  aboutProcessEmptyHintLine2: "",
  aboutQualityEyebrow: "Our Quality Guarantee",
  aboutQualityHeading: "Quality isn't just a commitment — it's the foundation of everything we do.",
  aboutQualityIntro:
    "We take pride in delivering apartments that exceed expectations, combining world-class craftsmanship with thoughtful design and lasting durability.",
  aboutQualitySubheading: "What Sets Our Quality Apart?",
  aboutPromiseBlockTitle: "Our Promise to You",
  aboutPromiseFooter:
    "At Shivashree Developers, we don't just build apartments; we build trust and long-lasting relationships with our customers.",
  aboutWhereCorporateBadge: "Corporate office — Chennai",
  aboutWhereRegisteredBadge: "Registered office — Kumbakonam",
  aboutCtaBrowseProjectsLabel: "Or browse our current projects",

  contactMetaDescription:
    "Get in touch with Shivashree Developers for luxury 2 & 3 BHK apartments in Kumbakonam and Chennai. Enquire about projects, pricing, and bookings today.",
  contactMapIframeTitle: "Shivashree Developers — Chennai office on Google Maps",

  homeProjectsSeeAllLabel: "See every project",
  homeProjectsEmptyMessage:
    "No published projects yet. The team is preparing the next announcement.",
  homeHeroFallback1Heading: "Sivasree's Syamala – Arumbakkam\nThe Ultimate Address for Luxury",
  homeHeroFallback1Sub: "Designed for Those Who Desire the Finest.",
  homeHeroFallback1CtaLabel: "Enquire Now",
  homeHeroFallback1CtaUrl: "/contact",
  homeHeroFallback2Heading: "Sivasree's Galaxy at Kumbakonam\nWhere Comfort Meets Culture",
  homeHeroFallback2Sub: "Where tradition meets luxury, and every sunrise feels spiritual.",
  homeHeroFallback2CtaLabel: "Enquire Now",
  homeHeroFallback2CtaUrl: "/contact",
  homeHeroSlideEyebrowFallback: "Shivashree Developers · Kumbakonam & Chennai",
  homeHeroEmptyEyebrow: "Shivashree Developers",
  homeHeroEmptyHeading:
    "Apartments in Kumbakonam & Chennai —\nbuilt by people who live here.",
  homeHeroEmptyCtaLabel: "See current projects",
  homeHeroEmptyCtaUrl: "/projects",
  homeCardNoImageText: "Image being uploaded",
  homeCardStartingAtLabel: "Starting at",
  homeCardPricingOnRequest: "Pricing on request",
  homeCardProjectPageLabel: "Project page",
  homeCardTnreraPrefix: "TNRERA:",
  homeCtaCallbackTitle: "Request a callback",
  homeCtaCallbackSubtitle: "No spam. No mailing list. Just a phone call.",
  homeCtaPreferCallPrefix: "Prefer to call? Dial",
  homeCtaPreferCallSuffix: "— Monday to Saturday, 9am–6pm.",

  projectsHeroEyebrow: "All projects",
  projectsHeroTitle: "What we're building right now.",
  projectsHeroIntro:
    "Three live developments — one with units already handed over, one on site, and one announcing soon. Skip to whichever stage matches where you are.",
  projectsSecOngoingLabel: "Now selling",
  projectsSecOngoingSub: "Booking is open and construction is in progress.",
  projectsSecProposedLabel: "Coming soon",
  projectsSecProposedSub: "Designs being finalised — register interest for pre-launch pricing.",
  projectsSecCompletedLabel: "Delivered",
  projectsSecCompletedSub:
    "Possession-ready apartments. Walkthroughs and handovers by appointment year-round.",
  projectsSecSoldOutLabel: "Sold Out",
  projectsSecSoldOutSub: "All units have been sold. Contact us for resale opportunities.",
  projectsCardNoImageText: "Image being uploaded",
  projectsCardStartingAtLabel: "Starting at",
  projectsCardPricingOnRequest: "Pricing on request",
  projectsCardProjectPageLabel: "Project page",
  projectsCardTnreraPrefix: "TNRERA:",

  statusLabelProposed: "Coming Soon",
  statusLabelOngoing: "Now Selling",
  statusLabelCompleted: "Ready to Move",
  statusLabelSoldOut: "Sold Out",

  footerBrandTagline:
    "A Kumbakonam-rooted developer building RERA-registered residential apartments in Kumbakonam and Chennai.",
  footerSitemapHeading: "Sitemap",
  footerCorporateHeading: "Corporate Office — Chennai",
  footerRegisteredHeading: "Registered Office — Kumbakonam",
  footerReraTitle: "TNRERA Registered",
  footerReraBody:
    "Each Shivashree project carries its own TNRERA number — printed on the project page and on every brochure we hand you.",
  footerBottomLocationLine: "Kumbakonam · Chennai",
  footerMapIframeTitle: "Shivashree Developers — corporate office on Google Maps",

  navLabelHome: "Home",
  navLabelProjects: "Projects",
  navLabelResources: "Resources",
  navLabelContact: "Contact Us",
  navLabelAbout: "About Us",
  navProjectsSeeAllLabel: "See every project →",
  navResourcesBlogTitle: "Notes & guides",
  navResourcesBlogSubtitle: "Buying tips, neighbourhood snapshots",
  navResourcesFaqsTitle: "FAQs",
  navResourcesFaqsSubtitle: "Booking, loans, RERA, possession",
  navWhatsappCtaLabel: "Talk to a sales advisor",
  navWhatsappPrefillMessage:
    "Hi Shivashree Developers, I'd like to know more about your apartments.",
  navMobileMenuOpenA11y: "Open menu",
  navMobileMenuCloseA11y: "Close menu",
  navMobileAllProjectsLabel: "All Projects",

  enquiryThankTitle: "Got it — we'll call you back.",
  enquiryThankBody:
    "Usually within the day, sometimes within an hour. Our advisor will ring you on the number you gave us.",
  enquiryPlaceholderName: "Your full name *",
  enquiryPlaceholderMobile: "Mobile number *",
  enquiryPlaceholderEmail: "Email address (optional)",
  enquiryPlaceholderLooking: "Looking for property in… (optional)",
  enquiryPlaceholderProject: "Project you're interested in (optional)",
  enquirySubmitSending: "Sending…",
  enquirySubmitLabel: "Request a callback",
  enquiryPrivacyNote: "We don't share your number. We don't add you to a mailing list.",
  enquiryErrorAlert: "Something went wrong. Please try again or call us directly.",

  floatWhatsappPrefillMessage:
    "Hello! I'm interested in learning more about Shivashree Developers' properties.",
  floatWhatsappAriaLabel: "Chat with us on WhatsApp",

  structuredOrgName: "Shivashree Developers",
  structuredOrgDescription:
    "Shivashree Developers is a regional real estate developer offering premium RERA-registered residential apartments in Kumbakonam and Chennai.",

  propDetailBreadcrumbHome: "Home",
  propDetailBreadcrumbProjects: "Projects",
  propDetailDtStartingAt: "Starting at",
  propDetailDtConfigurations: "Configurations",
  propDetailDtTnrera: "TNRERA No.",
  propDetailDtLocation: "Location",
  propDetailHighlightsHeading: "Project highlights",
  propDetailGalleryHeading: "Gallery",
  propDetailAmenitiesHeading: "Amenities included",
  propDetailSpecificationsHeading: "Specifications",
  propDetailFloorPlansHeading: "Floor plans",
  propDetailNeighbourhoodHeading: "The neighbourhood",
  propDetailFaqsHeading: "Questions buyers ask about this project",
  propDetailBackLinkLabel: "Back to all projects",
  propDetailEnquiryTitleTemplate: "Speak to the {tail} team",
  propDetailEnquiryIntro:
    "Leave your number and a project advisor will call you back the same working day.",
  propDetailStatusBoxLabel: "Project status",
  propDetailStatusBlurbProposed:
    "Designs are being finalised. Register interest now to get pre-launch pricing.",
  propDetailStatusBlurbOngoing:
    "Construction in progress. Floor plans and pricing are finalised — bookings open.",
  propDetailStatusBlurbCompleted:
    "Units are ready for handover. Walkthroughs available seven days a week with prior appointment.",
  propDetailStatusBlurbSoldOut: "All units have been sold. Contact us for resale opportunities.",
  propSpecLabelBuilding: "Building & structure",
  propSpecLabelBathroom: "Bathroom",
  propSpecLabelKitchen: "Kitchen",
  propSpecLabelFlooring: "Flooring",
  propSpecLabelDoors: "Doors",
  propSpecLabelWindows: "Windows",
} as const;

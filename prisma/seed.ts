import { PrismaClient, PropertyStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ─── Admin User ─────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? "admin@shivashreedev.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeThisPassword123!";
  const name = process.env.ADMIN_NAME ?? "Shivashree Admin";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({
      data: { email, password: hashed, name, role: "SUPER_ADMIN" },
    });
    console.log(`✅ Admin user created: ${email}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${email}`);
  }

  // ─── Site Settings ──────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      corporateOfficeAddress:
        "First Floor, Prashanth Enclave, No.15, Rukmani Street, West Mambalam, Chennai – 600 033",
      corporateOfficeEmail: "info@shivashreedev.com",
      corporateOfficePhone: "+91 44 0000 0000",
      registeredOfficeAddress:
        "Old No.75, Bakthapuri Street, Kumbakonam – 612 001",
      registeredOfficeTel: "+91 435 000 0000",
      whatsappNumber: "919400000000",
      facebookUrl: "https://facebook.com/shivashreedev",
      instagramUrl: "https://instagram.com/shivashreedev",
      youtubeUrl: "https://youtube.com/@shivashreedev",
      // Default Google Maps embed URL for the West Mambalam corporate office.
      // Admin can replace this from Site Settings without touching code.
      corporateMapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.5499024076717!2d80.21520487480633!3d13.039199787287244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526715c2f6e8c9%3A0x0!2sWest+Mambalam,+Chennai,+Tamil+Nadu!5e0!3m2!1sen!2sin!4v1714000000000",
      footerText:
        "Shivashree Developers — Building Homes, Building Trust since 2000.",
    },
  });
  console.log("✅ Site settings seeded");

  // ─── Hero Slides ────────────────────────────────────────────────────────────
  const heroCount = await prisma.heroSlide.count();
  if (heroCount === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          imageUrl: "/images/hero-1.jpg",
          overlayHeading: "Building Homes,\nBuilding Trust",
          subheading: "Premium residential apartments in Kumbakonam & Chennai",
          ctaLabel: "Explore Projects",
          ctaUrl: "/projects",
          sortOrder: 0,
        },
        {
          imageUrl: "/images/hero-2.jpg",
          overlayHeading: "Your Dream Home\nAwaits in Kumbakonam",
          subheading: "RERA-registered projects with transparent pricing",
          ctaLabel: "View Ongoing Projects",
          ctaUrl: "/projects#ongoing",
          sortOrder: 1,
        },
      ],
    });
    console.log("✅ Hero slides seeded");
  }

  // ─── Properties ─────────────────────────────────────────────────────────────

  const properties: Array<{
    title: string;
    slug: string;
    city: string;
    locality: string;
    fullAddress: string;
    status: PropertyStatus;
    priceStartingFrom: number | null;
    heroImage: string | null;
    heroImageAlt: string | null;
    bhkTypes: string[];
    highlights: string[];
    keySpecifications: Record<string, string>;
    locationAdvantages: string[];
    isPublished: boolean;
  }> = [
    {
      title: "Shivashree's Syamala",
      slug: "shivashrees-syamala-arumbakkam-chennai",
      city: "Chennai",
      locality: "Janakiram Colony, Arumbakkam",
      fullAddress: "Janakiram Colony, Arumbakkam, Chennai",
      status: "COMPLETED" as PropertyStatus,
      priceStartingFrom: null,
      heroImage: "/images/syamala-hero.jpg",
      heroImageAlt:
        "Shivashree's Syamala residential apartments in Arumbakkam, Chennai",
      bhkTypes: ["2 BHK", "3 BHK"],
      highlights: [
        "RERA Registered",
        "Prime Arumbakkam Location",
        "Vastu Compliant",
        "24hr Security",
        "Power Backup",
        "Car Parking",
      ],
      keySpecifications: {
        building: "G+4 floors, RCC framed structure",
        bathroom: "Premium quality CP fittings, anti-skid flooring",
        kitchen: "Granite platform, stainless steel sink",
        flooring: "Vitrified tiles in living & bedrooms",
        doors: "Teak wood main door, hollow core internal doors",
        windows: "UPVC sliding windows with mosquito mesh",
      },
      locationAdvantages: [
        "2 min from Arumbakkam Metro Station",
        "5 min from Vadapalani Bus Terminus",
        "10 min from CMBT (Koyambedu)",
        "Proximity to schools: DAV, PSBB",
        "Near major hospitals: MIOT, Fortis",
      ],
      isPublished: true,
    },
    {
      title: "Shivashree's Mahalakshmi",
      slug: "shivashrees-mahalakshmi-swamimalai-kumbakonam",
      city: "Kumbakonam",
      locality: "Swamimalai Main Road",
      fullAddress: "Swamimalai Main Road, Kumbakonam – 612 301",
      status: "ONGOING" as PropertyStatus,
      priceStartingFrom: 45,
      heroImage: "/images/mahalakshmi-hero.jpg",
      heroImageAlt:
        "Shivashree's Mahalakshmi apartments on Swamimalai Main Road, Kumbakonam",
      bhkTypes: ["2 BHK", "3 BHK"],
      highlights: [
        "RERA Registered",
        "Swamimalai Road Frontage",
        "Vastu Compliant Design",
        "Underground Sump + OHT",
        "24hr Power Backup",
        "Covered Car Parking",
      ],
      keySpecifications: {
        building: "G+3 floors, earthquake resistant RCC structure",
        bathroom: "Anti-skid tiles, premium CP fittings, exhaust fan provision",
        kitchen: "Black granite platform, Jaquar/equivalent fittings",
        flooring: "800×800 mm vitrified tiles throughout",
        doors: "Country teak main door with PU polish, flush internal doors",
        windows: "UPVC windows with MS grills",
      },
      locationAdvantages: [
        "3 km from Kumbakonam town centre",
        "1 km from Swamimalai Murugan Temple",
        "Near Kumbakonam Engineering College",
        "20 min from Kumbakonam Railway Station",
        "Easy access to NH-67",
      ],
      isPublished: true,
    },
    {
      title: "Shivashree's Aishwaryam",
      slug: "shivashrees-aishwaryam-east-dabeer-kumbakonam",
      city: "Kumbakonam",
      locality: "East Dabeer Street",
      fullAddress: "East Dabeer Street, Kumbakonam – 612 001",
      status: "PROPOSED" as PropertyStatus,
      priceStartingFrom: null,
      heroImage: "/images/aishwaryam-hero.jpg",
      heroImageAlt:
        "Shivashree's Aishwaryam proposed project in East Dabeer Street, Kumbakonam",
      bhkTypes: ["2 BHK", "3 BHK"],
      highlights: [
        "Heritage Heart of Kumbakonam",
        "Vastu Compliant Design",
        "Modern Amenities",
        "Well-connected Location",
        "Pre-launch Pricing",
      ],
      keySpecifications: {
        building: "Details to be finalised — contact us for updates",
        bathroom: "Premium fittings",
        kitchen: "Modern kitchen design",
        flooring: "High-quality vitrified tiles",
        doors: "Teak wood main door",
        windows: "UPVC windows",
      },
      locationAdvantages: [
        "Heart of Kumbakonam old town",
        "Walking distance to Adi Kumbeswarar Temple",
        "Near Kumbakonam bus stand",
        "Close to all essential amenities",
        "Well-connected by roads",
      ],
      isPublished: true,
    },
  ];

  for (const prop of properties) {
    const existing = await prisma.property.findUnique({
      where: { slug: prop.slug },
    });
    if (existing) {
      console.log(`ℹ️  Property already exists: ${prop.title}`);
      continue;
    }

    const { bhkTypes, highlights, keySpecifications, locationAdvantages, ...rest } = prop;

    await prisma.property.create({
      data: {
        ...rest,
        bhkTypes: JSON.stringify(bhkTypes),
        highlights: JSON.stringify(highlights),
        keySpecifications: JSON.stringify(keySpecifications),
        locationAdvantages: JSON.stringify(locationAdvantages),
        amenities: {
          create: getDefaultAmenities(prop.status),
        },
        faqs: {
          create: getDefaultFAQs(prop.title, prop.status),
        },
      },
    });
    console.log(`✅ Property seeded: ${prop.title}`);
  }

  // ─── FAQs ───────────────────────────────────────────────────────────────────
  const faqCount = await prisma.fAQEntry.count();
  if (faqCount === 0) {
    await prisma.fAQEntry.createMany({
      data: [
        {
          question: "What is RERA and why is it important?",
          answer:
            "RERA (Real Estate Regulatory Authority) is a government body that regulates the real estate sector in India. It ensures transparency, accountability, and protects buyers' interests. All our projects are RERA-registered, giving you legal protection and peace of mind.",
          category: "GENERAL",
          sortOrder: 1,
        },
        {
          question: "How do I book a property with Shivashree Developers?",
          answer:
            "You can book by visiting our office, calling us, or submitting an enquiry form on our website. Our team will guide you through the booking process, documentation, and payment schedule.",
          category: "BUYING",
          sortOrder: 1,
        },
        {
          question: "What documents do I need to buy a flat?",
          answer:
            "You will need identity proof (Aadhaar/PAN), address proof, income proof (salary slips or IT returns for the past 2 years), and bank statements for the past 6 months. Our sales team will provide you with a complete checklist.",
          category: "BUYING",
          sortOrder: 2,
        },
        {
          question: "Do you assist with home loans?",
          answer:
            "Yes. We have tie-ups with leading banks and NBFCs including SBI, HDFC, and LIC Housing Finance. Our team will help you with the home loan application process at no extra charge.",
          category: "BUYING",
          sortOrder: 3,
        },
      ],
    });
    console.log("✅ FAQ entries seeded");
  }

  console.log("🎉 Seed completed successfully!");
}

function getDefaultAmenities(status: PropertyStatus) {
  const base = [
    { icon: "shield-check", label: "24hr Security" },
    { icon: "zap", label: "Power Backup" },
    { icon: "car", label: "Car Parking" },
    { icon: "droplets", label: "Water Supply" },
    { icon: "tree-pine", label: "Landscaped Garden" },
  ];

  if (status === "COMPLETED" || status === "ONGOING") {
    return [
      ...base,
      { icon: "cctv", label: "CCTV Surveillance" },
      { icon: "trash-2", label: "Waste Management" },
    ];
  }
  return base;
}

function getDefaultFAQs(title: string, status: PropertyStatus) {
  const faqs = [
    {
      question: `What is the current status of ${title}?`,
      answer:
        status === "COMPLETED"
          ? "This project is fully completed and ready for possession. All units have been handed over."
          : status === "ONGOING"
          ? "Construction is actively ongoing. Expected completion date will be communicated. Please contact us for the latest update."
          : "This project is in the planning stage. Pre-launch registrations of interest are now open. Contact us to be among the first to know.",
      sortOrder: 1,
    },
    {
      question: "Is this project RERA registered?",
      answer:
        "Yes, all Shivashree Developer projects are registered under TNRERA (Tamil Nadu Real Estate Regulatory Authority). The RERA registration number is displayed on this page.",
      sortOrder: 2,
    },
  ];
  return faqs;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

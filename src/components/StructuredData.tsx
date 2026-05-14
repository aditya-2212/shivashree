interface Props {
  data: Record<string, unknown>;
}

export default function StructuredData({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Schema Builders ──────────────────────────────────────────────────────────

export function organizationSchema(settings?: {
  corporateOfficeAddress?: string;
  corporateOfficePhone?: string;
  corporateOfficeEmail?: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
}) {
  const sameAs = [
    settings?.facebookUrl,
    settings?.instagramUrl,
    settings?.youtubeUrl,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Shivashree Developers",
    url: process.env.NEXTAUTH_URL ?? "https://shivashreedev.com",
    logo: `${process.env.NEXTAUTH_URL ?? "https://shivashreedev.com"}/images/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "First Floor, Prashanth Enclave, No.15, Rukmani Street",
      addressLocality: "West Mambalam",
      addressRegion: "Chennai",
      postalCode: "600 033",
      addressCountry: "IN",
    },
    telephone: settings?.corporateOfficePhone,
    email: settings?.corporateOfficeEmail,
    sameAs: sameAs.length ? sameAs : undefined,
    areaServed: ["Kumbakonam", "Chennai", "Tamil Nadu"],
    description:
      "Shivashree Developers is a regional real estate developer offering premium RERA-registered residential apartments in Kumbakonam and Chennai.",
  };
}

export function propertySchema(property: {
  title: string;
  slug: string;
  fullAddress: string;
  city: string;
  priceStartingFrom: number | null;
  heroImage: string | null;
  status: string;
  reraNumber: string | null;
  bhkTypes: string[];
}) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://shivashreedev.com";
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    url: `${baseUrl}/projects/${property.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.fullAddress,
      addressLocality: property.city,
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    image: property.heroImage
      ? `${baseUrl}${property.heroImage}`
      : undefined,
    offers: property.priceStartingFrom
      ? {
          "@type": "Offer",
          price: property.priceStartingFrom * 100000,
          priceCurrency: "INR",
          availability:
            property.status === "COMPLETED"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
        }
      : undefined,
    description: `${property.title} — ${property.bhkTypes.join(", ")} in ${property.city}. ${property.reraNumber ? `RERA: ${property.reraNumber}` : ""}`,
    brand: {
      "@type": "Brand",
      name: "Shivashree Developers",
    },
  };
}

export function articleSchema(post: {
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  coverImage: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
}) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://shivashreedev.com";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    url: `${baseUrl}/resources/blog/${post.slug}`,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Shivashree Developers",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    image: post.coverImage ? `${baseUrl}${post.coverImage}` : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

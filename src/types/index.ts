import { Property, PropertyStatus, LeadStatus, FAQCategory } from "@prisma/client";

export type { Property, PropertyStatus, LeadStatus, FAQCategory };

export interface PropertyWithRelations extends Property {
  galleryImages: { id: number; url: string; alt: string | null; sortOrder: number }[];
  floorPlans: { id: number; label: string; imageUrl: string; sortOrder: number }[];
  amenities: { id: number; icon: string; label: string }[];
  faqs: { id: number; question: string; answer: string; sortOrder: number }[];
  leads: { id: number }[];
}

export interface ParsedProperty {
  id: number;
  title: string;
  slug: string;
  city: string;
  locality: string;
  fullAddress: string;
  status: PropertyStatus;
  priceStartingFrom: number | null;
  reraNumber: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  bhkTypes: string[];
  highlights: string[];
  keySpecifications: Record<string, string>;
  locationAdvantages: string[];
  mapEmbedUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  galleryImages: { id: number; url: string; alt: string | null; sortOrder: number }[];
  floorPlans: { id: number; label: string; imageUrl: string; sortOrder: number }[];
  amenities: { id: number; icon: string; label: string }[];
  faqs: { id: number; question: string; answer: string; sortOrder: number }[];
}

export interface SiteSettingsData {
  id: number;
  corporateOfficeAddress: string;
  corporateOfficeEmail: string;
  corporateOfficePhone: string;
  registeredOfficeAddress: string;
  registeredOfficeTel: string;
  whatsappNumber: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  footerText: string;
}

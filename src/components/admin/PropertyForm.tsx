"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Upload,
  Loader2,
  Eye,
  Save,
  MapPin,
  ImageIcon,
  Info,
  CheckSquare,
} from "lucide-react";

// ─── Schema ──────────────────────────────────────────────────────────────────

const propertySchema = z.object({
  title: z.string().min(1, "Project name is required"),
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality is required"),
  fullAddress: z.string().min(1, "Full address is required"),
  status: z.enum(["PROPOSED", "ONGOING", "COMPLETED"]),
  priceStartingFrom: z.string().optional(),
  reraNumber: z.string().optional(),
  bhkTypes: z.array(z.string()).min(1, "Select at least one BHK type"),
  highlights: z.array(z.object({ value: z.string().min(1) })),
  locationAdvantages: z.array(z.object({ value: z.string().min(1) })),
  amenities: z.array(
    z.object({ icon: z.string().min(1), label: z.string().min(1) })
  ),
  faqs: z.array(
    z.object({
      question: z.string().min(1, "Question required"),
      answer: z.string().min(1, "Answer required"),
    })
  ),
  keySpecifications: z.object({
    building: z.string().optional(),
    bathroom: z.string().optional(),
    kitchen: z.string().optional(),
    flooring: z.string().optional(),
    doors: z.string().optional(),
    windows: z.string().optional(),
  }),
  mapEmbedUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

// ─── Types ───────────────────────────────────────────────────────────────────

interface GalleryImage {
  id?: number;
  url: string;
  alt?: string;
  isNew?: boolean;
}

interface FloorPlan {
  id?: number;
  label: string;
  imageUrl: string;
  isNew?: boolean;
}

interface PropertyData {
  id?: number;
  title: string;
  city: string;
  locality: string;
  fullAddress: string;
  status: "PROPOSED" | "ONGOING" | "COMPLETED";
  priceStartingFrom?: number | null;
  reraNumber?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  bhkTypes: string[];
  highlights: string[];
  keySpecifications: Record<string, string>;
  locationAdvantages: string[];
  galleryImages?: GalleryImage[];
  floorPlans?: FloorPlan[];
  amenities?: { id?: number; icon: string; label: string }[];
  faqs?: { id?: number; question: string; answer: string; sortOrder?: number }[];
  mapEmbedUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface Props {
  mode: "create" | "edit";
  initialData?: PropertyData;
}

// ─── BHK Options ─────────────────────────────────────────────────────────────

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa", "Plot"];

const AMENITY_ICONS = [
  { value: "shield-check", label: "Security" },
  { value: "zap", label: "Power Backup" },
  { value: "car", label: "Parking" },
  { value: "droplets", label: "Water Supply" },
  { value: "tree-pine", label: "Garden" },
  { value: "cctv", label: "CCTV" },
  { value: "trash-2", label: "Waste Mgmt" },
  { value: "wifi", label: "WiFi" },
  { value: "dumbbell", label: "Gym" },
  { value: "waves", label: "Swimming Pool" },
  { value: "baby", label: "Play Area" },
  { value: "users", label: "Club House" },
  { value: "flame", label: "Fire Safety" },
  { value: "accessibility", label: "Lift" },
];

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand-purple-600" />
          <h2 className="font-semibold text-stone-900 text-sm">{title}</h2>
        </div>
        {description && (
          <p className="text-stone-500 text-xs mt-0.5 ml-6">{description}</p>
        )}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-600 text-xs mt-1">{message}</p>;
}

function Label({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-medium text-stone-700 mb-1.5">
      {children}
      {hint && <span className="text-stone-400 font-normal ml-1">({hint})</span>}
    </label>
  );
}

// ─── Image Upload Hook ────────────────────────────────────────────────────────

function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.url as string;
    } catch {
      toast.error("Image upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PropertyForm({ mode, initialData }: Props) {
  const router = useRouter();
  const { upload, uploading } = useImageUpload();

  const [heroImage, setHeroImage] = useState<string | null>(
    initialData?.heroImage ?? null
  );
  const [gallery, setGallery] = useState<GalleryImage[]>(
    initialData?.galleryImages ?? []
  );
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(
    initialData?.floorPlans ?? []
  );
  const [saving, setSaving] = useState(false);

  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title ?? "",
      city: initialData?.city ?? "",
      locality: initialData?.locality ?? "",
      fullAddress: initialData?.fullAddress ?? "",
      status: initialData?.status ?? "PROPOSED",
      priceStartingFrom: initialData?.priceStartingFrom
        ? String(initialData.priceStartingFrom)
        : "",
      reraNumber: initialData?.reraNumber ?? "",
      bhkTypes: initialData?.bhkTypes ?? [],
      highlights: (initialData?.highlights ?? []).map((v) => ({ value: v })),
      locationAdvantages: (initialData?.locationAdvantages ?? []).map((v) => ({
        value: v,
      })),
      amenities: initialData?.amenities ?? [],
      faqs: initialData?.faqs ?? [],
      keySpecifications: {
        building: initialData?.keySpecifications?.building ?? "",
        bathroom: initialData?.keySpecifications?.bathroom ?? "",
        kitchen: initialData?.keySpecifications?.kitchen ?? "",
        flooring: initialData?.keySpecifications?.flooring ?? "",
        doors: initialData?.keySpecifications?.doors ?? "",
        windows: initialData?.keySpecifications?.windows ?? "",
      },
      mapEmbedUrl: initialData?.mapEmbedUrl ?? "",
      seoTitle: initialData?.seoTitle ?? "",
      seoDescription: initialData?.seoDescription ?? "",
    },
  });

  const { fields: highlightFields, append: addHighlight, remove: removeHighlight } =
    useFieldArray({ control, name: "highlights" });
  const { fields: locationFields, append: addLocation, remove: removeLocation } =
    useFieldArray({ control, name: "locationAdvantages" });
  const { fields: amenityFields, append: addAmenity, remove: removeAmenity } =
    useFieldArray({ control, name: "amenities" });
  const { fields: faqFields, append: addFaq, remove: removeFaq } =
    useFieldArray({ control, name: "faqs" });

  const bhkTypes = watch("bhkTypes");
  const seoTitle = watch("seoTitle") ?? "";
  const seoDesc = watch("seoDescription") ?? "";
  const mapUrl = watch("mapEmbedUrl") ?? "";

  const toggleBhk = (type: string) => {
    const current = bhkTypes ?? [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue("bhkTypes", next, { shouldValidate: true });
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) setHeroImage(url);
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const url = await upload(file);
      if (url) {
        setGallery((prev) => [...prev, { url, isNew: true }]);
      }
    }
  };

  const handleFloorPlanUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) {
      setFloorPlans((prev) => [...prev, { label, imageUrl: url, isNew: true }]);
    }
  };

  const submitForm = async (data: PropertyFormData, publish: boolean) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        priceStartingFrom: data.priceStartingFrom
          ? parseFloat(data.priceStartingFrom)
          : null,
        highlights: data.highlights.map((h) => h.value),
        locationAdvantages: data.locationAdvantages.map((l) => l.value),
        heroImage,
        gallery,
        floorPlans,
        isPublished: publish,
      };

      const url =
        mode === "create"
          ? "/api/admin/properties"
          : `/api/admin/properties/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Unknown error");
      }

      toast.success(
        publish ? "Property published successfully!" : "Draft saved!"
      );
      router.push("/admin/properties");
      router.refresh();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Something went wrong. Please retry."
      );
    } finally {
      setSaving(false);
    }
  };

  const onSaveDraft = handleSubmit((data) => submitForm(data, false));
  const onPublish = handleSubmit((data) => submitForm(data, true));

  const inputClass =
    "w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition";
  const textareaClass = inputClass + " resize-none";

  return (
    <div className="space-y-6">
      {/* ─── Section 1: Basic Info ─────────────────────────────────────────── */}
      <FormSection
        title="Basic Information"
        description="Core details about this project"
        icon={Info}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Project Name</Label>
            <input
              {...register("title")}
              className={inputClass}
              placeholder="e.g. Shivashree's Mahalakshmi"
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <Label>City</Label>
            <input
              {...register("city")}
              className={inputClass}
              placeholder="e.g. Kumbakonam"
            />
            <FieldError message={errors.city?.message} />
          </div>

          <div>
            <Label>Locality / Area</Label>
            <input
              {...register("locality")}
              className={inputClass}
              placeholder="e.g. Swamimalai Main Road"
            />
            <FieldError message={errors.locality?.message} />
          </div>

          <div className="sm:col-span-2">
            <Label>Full Address</Label>
            <input
              {...register("fullAddress")}
              className={inputClass}
              placeholder="Complete postal address"
            />
            <FieldError message={errors.fullAddress?.message} />
          </div>

          <div>
            <Label hint="optional">RERA Number</Label>
            <input
              {...register("reraNumber")}
              className={inputClass}
              placeholder="e.g. TN/01/Building/0001/2024"
            />
          </div>

          <div>
            <Label hint="₹ lakhs, optional">Starting Price</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
                ₹
              </span>
              <input
                {...register("priceStartingFrom")}
                type="number"
                step="0.5"
                className={inputClass + " pl-7"}
                placeholder="e.g. 45"
              />
            </div>
            <p className="text-stone-400 text-xs mt-1">
              Enter amount in lakhs (e.g. 45 = ₹45 Lakhs)
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <Label>Project Status</Label>
          <p className="text-stone-400 text-xs mb-2">
            This controls which section the project appears in on the website.
          </p>
          <div className="flex gap-3 flex-wrap">
            {(["PROPOSED", "ONGOING", "COMPLETED"] as const).map((s) => {
              const labels = {
                PROPOSED: "Proposed — Coming Soon",
                ONGOING: "Ongoing — Under Construction",
                COMPLETED: "Completed — Ready to Move",
              };
              const colors = {
                PROPOSED: "border-blue-400 bg-blue-50 text-blue-700",
                ONGOING: "border-brand-purple-300 bg-brand-purple-50 text-brand-purple-600",
                COMPLETED: "border-green-400 bg-green-50 text-green-700",
              };
              const isSelected = watch("status") === s;
              return (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition text-sm font-medium ${
                    isSelected
                      ? colors[s]
                      : "border-stone-200 text-stone-500 hover:border-stone-300"
                  }`}
                >
                  <input
                    {...register("status")}
                    type="radio"
                    value={s}
                    className="sr-only"
                  />
                  {labels[s]}
                </label>
              );
            })}
          </div>
        </div>

        {/* BHK Types */}
        <div>
          <Label>Flat Types Available</Label>
          <div className="flex gap-2 flex-wrap">
            {BHK_OPTIONS.map((option) => {
              const selected = (bhkTypes ?? []).includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleBhk(option)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    selected
                      ? "bg-brand-purple-600 border-brand-purple-600 text-white"
                      : "border-stone-300 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.bhkTypes?.message} />
        </div>
      </FormSection>

      {/* ─── Section 2: Images ────────────────────────────────────────────── */}
      <FormSection
        title="Images"
        description="Upload the main hero image and gallery photos"
        icon={ImageIcon}
      >
        {/* Hero Image */}
        <div>
          <Label>Main Project Image</Label>
          <p className="text-stone-400 text-xs mb-3">
            This is the first image visitors see. Use a high-quality exterior or
            rendered image. Minimum 1200×600px recommended.
          </p>
          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            onChange={handleHeroUpload}
            className="hidden"
          />
          {heroImage ? (
            <div className="relative rounded-xl overflow-hidden border border-stone-200 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Hero preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="bg-white text-stone-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-stone-100 transition"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={() => setHeroImage(null)}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => heroInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center gap-2 text-stone-400 hover:border-brand-purple-300 hover:text-brand-purple-500 transition"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">
                {uploading ? "Uploading…" : "Click to upload hero image"}
              </span>
              <span className="text-xs">JPG, PNG, WebP — max 10MB</span>
            </button>
          )}
        </div>

        {/* Gallery */}
        <div>
          <Label>Gallery Photos</Label>
          <p className="text-stone-400 text-xs mb-3">
            Add multiple photos of the property, construction progress, or
            amenities.
          </p>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className="hidden"
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {gallery.map((img, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-stone-200 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? "Gallery image"}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setGallery((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-brand-purple-300 hover:text-brand-purple-500 transition"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span className="text-xs">Add Photo</span>
            </button>
          </div>
        </div>

        {/* Floor Plans */}
        <div>
          <Label>Floor Plans</Label>
          <p className="text-stone-400 text-xs mb-3">
            Upload site plan, unit floor plans, etc. Each needs a label.
          </p>
          <div className="space-y-3">
            {floorPlans.map((plan, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={plan.imageUrl}
                  alt={plan.label}
                  className="w-16 h-12 object-cover rounded-md border border-stone-200 shrink-0"
                />
                <input
                  value={plan.label}
                  onChange={(e) =>
                    setFloorPlans((prev) =>
                      prev.map((p, j) =>
                        j === i ? { ...p, label: e.target.value } : p
                      )
                    )
                  }
                  className="flex-1 px-3 py-1.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-500"
                  placeholder="e.g. 2BHK Unit Plan"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFloorPlans((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <FloorPlanUploadButton onUpload={handleFloorPlanUpload} uploading={uploading} />
          </div>
        </div>
      </FormSection>

      {/* ─── Section 3: Project Details ───────────────────────────────────── */}
      <FormSection
        title="Project Details"
        description="Highlights, amenities, and key specifications"
        icon={CheckSquare}
      >
        {/* Highlights */}
        <div>
          <Label>Key Highlights</Label>
          <p className="text-stone-400 text-xs mb-3">
            Short feature phrases shown prominently on the project page (e.g.
            &quot;24hr Power Backup&quot;, &quot;RERA Registered&quot;).
          </p>
          <div className="space-y-2">
            {highlightFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`highlights.${i}.value`)}
                  className={inputClass + " flex-1"}
                  placeholder="e.g. Vastu Compliant Design"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="p-2.5 text-stone-400 hover:text-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addHighlight({ value: "" })}
            className="mt-2 flex items-center gap-1.5 text-brand-purple-600 hover:text-brand-purple-700 text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Add Highlight
          </button>
        </div>

        {/* Amenities */}
        <div>
          <Label>Amenities</Label>
          <div className="space-y-2">
            {amenityFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <select
                  {...register(`amenities.${i}.icon`)}
                  className="px-3 py-2.5 border border-stone-300 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-purple-500 w-40"
                >
                  <option value="">Select icon</option>
                  {AMENITY_ICONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  {...register(`amenities.${i}.label`)}
                  className={inputClass + " flex-1"}
                  placeholder="Amenity name (e.g. 24hr Security)"
                />
                <button
                  type="button"
                  onClick={() => removeAmenity(i)}
                  className="p-2.5 text-stone-400 hover:text-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addAmenity({ icon: "", label: "" })}
            className="mt-2 flex items-center gap-1.5 text-brand-purple-600 hover:text-brand-purple-700 text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Add Amenity
          </button>
        </div>

        {/* Key Specifications */}
        <div>
          <Label>Key Specifications</Label>
          <p className="text-stone-400 text-xs mb-3">
            Technical details about construction, finishes, and fittings.
          </p>
          <div className="space-y-3">
            {(
              [
                ["building", "Building / Structure"],
                ["bathroom", "Bathroom / Toilets"],
                ["kitchen", "Kitchen"],
                ["flooring", "Flooring"],
                ["doors", "Doors"],
                ["windows", "Windows"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  {label}
                </label>
                <input
                  {...register(`keySpecifications.${key}`)}
                  className={inputClass}
                  placeholder={`e.g. ${
                    key === "building"
                      ? "G+4 floors, RCC framed structure"
                      : key === "bathroom"
                      ? "Anti-skid tiles, premium CP fittings"
                      : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </FormSection>

      {/* ─── Section 4: Location ──────────────────────────────────────────── */}
      <FormSection
        title="Location"
        description="Nearby landmarks and Google Maps embed"
        icon={MapPin}
      >
        {/* Location Advantages */}
        <div>
          <Label>Nearby Landmarks & Advantages</Label>
          <p className="text-stone-400 text-xs mb-3">
            List nearby schools, hospitals, transport links, and landmarks. This
            helps buyers and improves Google search rankings.
          </p>
          <div className="space-y-2">
            {locationFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`locationAdvantages.${i}.value`)}
                  className={inputClass + " flex-1"}
                  placeholder="e.g. 2 min from Arumbakkam Metro Station"
                />
                <button
                  type="button"
                  onClick={() => removeLocation(i)}
                  className="p-2.5 text-stone-400 hover:text-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addLocation({ value: "" })}
            className="mt-2 flex items-center gap-1.5 text-brand-purple-600 hover:text-brand-purple-700 text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Add Location Advantage
          </button>
        </div>

        {/* Map Embed */}
        <div>
          <Label hint="optional">Google Maps Embed URL</Label>
          <p className="text-stone-400 text-xs mb-2">
            In Google Maps, click Share → Embed a map → Copy the src= URL from
            the iframe code.
          </p>
          <input
            {...register("mapEmbedUrl")}
            className={inputClass}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          {mapUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-stone-200">
              <iframe
                src={mapUrl}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </FormSection>

      {/* ─── Section 5: FAQs ──────────────────────────────────────────────── */}
      <FormSection
        title="Frequently Asked Questions"
        description="Add questions specific to this project"
        icon={Info}
      >
        <div className="space-y-4">
          {faqFields.map((field, i) => (
            <div
              key={field.id}
              className="p-4 bg-stone-50 rounded-xl border border-stone-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Question {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="text-stone-400 hover:text-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  {...register(`faqs.${i}.question`)}
                  className={inputClass}
                  placeholder="e.g. What is the expected completion date?"
                />
                <textarea
                  {...register(`faqs.${i}.answer`)}
                  rows={3}
                  className={textareaClass}
                  placeholder="Write a clear, helpful answer…"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addFaq({ question: "", answer: "" })}
          className="flex items-center gap-1.5 text-brand-purple-600 hover:text-brand-purple-700 text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Question & Answer
        </button>
      </FormSection>

      {/* ─── Section 6: SEO ───────────────────────────────────────────────── */}
      <FormSection
        title="SEO Settings"
        description="How this page appears in Google search results"
        icon={Eye}
      >
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Page Title</Label>
            <span
              className={`text-xs ${
                seoTitle.length > 60 ? "text-red-500" : "text-stone-400"
              }`}
            >
              {seoTitle.length}/60
            </span>
          </div>
          <input
            {...register("seoTitle")}
            className={inputClass}
            placeholder="e.g. Shivashree Mahalakshmi — 2 & 3 BHK Flats in Kumbakonam"
          />
          <p className="text-stone-400 text-xs mt-1">
            Keep under 60 characters. Will auto-generate from project name if
            left empty.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Meta Description</Label>
            <span
              className={`text-xs ${
                seoDesc.length > 160 ? "text-red-500" : "text-stone-400"
              }`}
            >
              {seoDesc.length}/160
            </span>
          </div>
          <textarea
            {...register("seoDescription")}
            rows={3}
            className={textareaClass}
            placeholder="A brief description of this property for search engines (1-2 sentences)."
          />
          <p className="text-stone-400 text-xs mt-1">
            Aim for 120–160 characters.
          </p>
        </div>
      </FormSection>

      {/* ─── Action Buttons ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2 pb-8">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition disabled:opacity-60 text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-60 text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          Publish to Website
        </button>
        <a
          href="/admin/properties"
          className="ml-auto text-sm text-stone-400 hover:text-stone-600 transition"
        >
          Cancel
        </a>
      </div>
    </div>
  );
}

// ─── Floor Plan Upload Sub-Component ─────────────────────────────────────────

function FloorPlanUploadButton({
  onUpload,
  uploading,
}: {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, label: string) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          onUpload(e, label || "Floor Plan");
          setLabel("");
        }}
        className="hidden"
      />
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="flex-1 px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-500 placeholder:text-stone-400"
        placeholder="Label first (e.g. 2BHK Unit Plan)"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || !label.trim()}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-brand-purple-500 text-brand-purple-600 rounded-lg text-sm font-medium hover:bg-brand-purple-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        Upload
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle } from "lucide-react";
import { useEnquiryCopy } from "@/components/public/SiteUiProvider";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  lookingIn: z.string().optional(),
  projectEnquiry: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  source: string;
  projectId?: number;
  projectName?: string;
  variant?: "light" | "dark";
}

export default function EnquiryForm({ source, projectId, projectName, variant = "light" }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const ec = useEnquiryCopy();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectEnquiry: projectName ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, propertyId: projectId }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      alert(ec.enquiryErrorAlert);
    }
  };

  const isDark = variant === "dark";
  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-500 transition ${
    isDark
      ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-brand-purple-300"
      : "bg-white border-stone-300 text-stone-900 placeholder:text-stone-400"
  }`;

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDark ? "bg-white/10" : "bg-green-50"}`}>
          <CheckCircle className={`w-8 h-8 ${isDark ? "text-green-400" : "text-green-600"}`} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-stone-900"}`}>
          {ec.enquiryThankTitle}
        </h3>
        <p className={isDark ? "text-white/70" : "text-stone-600"}>{ec.enquiryThankBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("name")}
          className={inputClass}
          placeholder={ec.enquiryPlaceholderName}
          autoComplete="name"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register("mobile")}
          className={inputClass}
          placeholder={ec.enquiryPlaceholderMobile}
          autoComplete="tel"
          type="tel"
        />
        {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile.message}</p>}
      </div>

      <div>
        <input
          {...register("email")}
          className={inputClass}
          placeholder={ec.enquiryPlaceholderEmail}
          autoComplete="email"
          type="email"
        />
      </div>

      <div>
        <input
          {...register("lookingIn")}
          className={inputClass}
          placeholder={ec.enquiryPlaceholderLooking}
        />
      </div>

      {!projectName && (
        <div>
          <input
            {...register("projectEnquiry")}
            className={inputClass}
            placeholder={ec.enquiryPlaceholderProject}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {ec.enquirySubmitSending}
          </>
        ) : (
          ec.enquirySubmitLabel
        )}
      </button>

      <p className={`text-xs text-center ${isDark ? "text-white/40" : "text-stone-500"}`}>
        {ec.enquiryPrivacyNote}
      </p>
    </form>
  );
}

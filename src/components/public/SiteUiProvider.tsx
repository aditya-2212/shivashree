"use client";

import { createContext, useContext, type ReactNode } from "react";
import { buildPublicSiteCopy, enquiryCopyFrom, type EnquiryCopy } from "@/lib/site-copy";

const EnquiryCopyContext = createContext<EnquiryCopy | null>(null);

export function SiteUiProvider({
  children,
  enquiryCopy,
}: {
  children: ReactNode;
  enquiryCopy: EnquiryCopy;
}) {
  return <EnquiryCopyContext.Provider value={enquiryCopy}>{children}</EnquiryCopyContext.Provider>;
}

export function useEnquiryCopy(): EnquiryCopy {
  const v = useContext(EnquiryCopyContext);
  if (v) return v;
  return enquiryCopyFrom(buildPublicSiteCopy(null));
}

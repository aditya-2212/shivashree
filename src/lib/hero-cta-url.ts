/**
 * Hero slides store arbitrary `ctaUrl` strings from the CMS. Invalid internal
 * paths (typos, old routes like /enquire) 404 — normalize to safe defaults.
 */
function isValidInternalHeroPath(path: string): boolean {
  const noQuery = path.split("?")[0].split("#")[0];
  const trimmed = noQuery.replace(/\/+$/, "") || "/";
  const lower = trimmed.toLowerCase();
  if (lower === "/") return true;
  if (lower === "/contact" || lower.startsWith("/contact/")) return true;
  if (lower === "/about" || lower.startsWith("/about/")) return true;
  if (lower === "/projects" || lower.startsWith("/projects/")) return true;
  if (lower === "/resources" || lower.startsWith("/resources/")) return true;
  return false;
}

/** Returns a safe href for hero primary CTAs. External URLs are left unchanged. */
export function normalizeHeroCtaUrl(url: string | null | undefined): string {
  const raw = (url ?? "").trim();
  if (!raw) return "/contact";
  if (/^https?:\/\//i.test(raw)) return raw;

  let path = raw.split("?")[0].split("#")[0].trim();
  if (!path.startsWith("/")) path = `/${path}`;

  if (!isValidInternalHeroPath(path)) return "/contact";
  return path;
}

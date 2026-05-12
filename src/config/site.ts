import { computeShellMetaDescription } from "@/config/shellMeta";

/** Public canonical origin — set VITE_SITE_URL in env (scheme + host, no trailing slash). */
export function getSiteOrigin(): string {
  const raw = typeof import.meta !== "undefined" ? import.meta.env.VITE_SITE_URL : undefined;
  const env = typeof raw === "string" ? raw.trim() : "";
  if (env) return env.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function getSiteDisplayName(): string {
  const raw =
    typeof import.meta !== "undefined" ? import.meta.env.VITE_SITE_NAME : undefined;
  return typeof raw === "string" && raw.trim() ? raw.trim() : "";
}

/** Home page `<SEO description />` — same composition as `index.html` shell meta. */
export function getHomeSeoDescription(): string {
  return computeShellMetaDescription(getSiteDisplayName(), import.meta.env);
}

/** `alt` for header logo when `VITE_SITE_NAME` is unset — from `VITE_SITE_LOGO_ALT_FALLBACK`. */
export function getSiteLogoAlt(): string {
  const name = getSiteDisplayName();
  if (name) return name;
  const fb =
    typeof import.meta !== "undefined"
      ? import.meta.env.VITE_SITE_LOGO_ALT_FALLBACK
      : undefined;
  return typeof fb === "string" && fb.trim() ? fb.trim() : "Logo";
}

/** Deploy path prefix — empty when app is hosted at repo root (`/`). */
export function getDeployPathPrefix(): string {
  const base = typeof import.meta !== "undefined" ? import.meta.env.BASE_URL : "/";
  const b = base || "/";
  if (b === "/") return "";
  return b.endsWith("/") ? b.slice(0, -1) : b;
}

/**
 * Resolves SPA route paths / query-bearing paths to absolute public URLs,
 * respecting base path (`VITE_BASE_URL`). Absolute HTTP(S) values pass through unchanged.
 */
export function absolutePublicUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const origin = getSiteOrigin();
  const base = getDeployPathPrefix();
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (!origin) return `${base}${path}`;
  return `${origin}${base}${path}`;
}

/** Default OG / Twitter image — place at `public/images/og-default.svg` (stable URL). */
const DEFAULT_OG_PATH = "/images/og-default.svg";

export function resolveOgImageUrl(
  image: string | undefined,
  fallback: string = DEFAULT_OG_PATH,
): string {
  const img = image?.trim() || fallback;
  if (/^https?:\/\//i.test(img)) return img;
  const normalized = img.startsWith("/") ? img : `/${img}`;
  return absolutePublicUrl(normalized);
}

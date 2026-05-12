/** Shared shell `index.html` / Home SEO description composition (reads `VITE_*` keys). */

export type ShellMetaEnvLike = {
  readonly VITE_SHELL_META_AR_PREFIX?: string;
  readonly VITE_SITE_DESCRIPTION_TAGLINE?: string;
  readonly VITE_SITE_DESCRIPTION_FALLBACK?: string;
};

/** Bilingual snippet for `<meta name="description">` in shell + Home SEO when branding is absent. */
export function computeShellMetaDescription(
  brandName: string,
  env: ShellMetaEnvLike,
): string {
  const arPrefix = typeof env.VITE_SHELL_META_AR_PREFIX === "string" ? env.VITE_SHELL_META_AR_PREFIX.trim() : "";
  const tagline = typeof env.VITE_SITE_DESCRIPTION_TAGLINE === "string" ? env.VITE_SITE_DESCRIPTION_TAGLINE.trim() : "";
  const fallback = typeof env.VITE_SITE_DESCRIPTION_FALLBACK === "string" ? env.VITE_SITE_DESCRIPTION_FALLBACK.trim() : "";
  const brand = brandName.trim();

  if (brand && tagline && arPrefix) return `${arPrefix} ${brand} ${tagline}`.trim();
  if (!brand && fallback && arPrefix) return `${arPrefix} ${fallback}`.trim();
  if (!brand && fallback) return fallback;
  if (brand && tagline) return `${brand} ${tagline}`.trim();
  return tagline || brand || fallback;
}

import { absolutePublicUrl } from "@/config/site";

/**
 * Matches `useLocale()`'s pathWithoutLocale (locale segment stripped; home is `'/'`).
 * Only routes that mirror `/en/*` vs default locale get alternates — keep in sync with `AppRouter.tsx`.
 */
const BILINGUAL_PATH_WITHOUT_LOCALE = /^\/(?:$|about$|facility$|blog(?:Detail)?$|admission$|academic-degrees$|gallery$|publications(?:\/[^/?#]+)?$|president-message$)$/;

function arabicHrefPath(pathWithoutLocale: string, search: string): string {
  const p =
    pathWithoutLocale === "/" || pathWithoutLocale === ""
      ? "/"
      : pathWithoutLocale.startsWith("/")
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;
  return `${p}${search}`;
}

function englishHrefPath(pathWithoutLocale: string, search: string): string {
  if (pathWithoutLocale === "/" || pathWithoutLocale === "") {
    return `/en${search}`;
  }
  const p = pathWithoutLocale.startsWith("/")
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`;
  return `/en${p}${search}`;
}

/** Returns `{ ar, en }` absolute URLs for hreflang tags, or `null` when the route has no English mirror. */
export function getLocaleAlternates(pathWithoutLocale: string, search: string): {
  ar: string;
  en: string;
} | null {
  const nw = pathWithoutLocale === "" ? "/" : pathWithoutLocale;
  if (!BILINGUAL_PATH_WITHOUT_LOCALE.test(nw)) return null;

  const arHref = absolutePublicUrl(arabicHrefPath(pathWithoutLocale, search));
  const enHref = absolutePublicUrl(englishHrefPath(pathWithoutLocale, search));
  return { ar: arHref, en: enHref };
}

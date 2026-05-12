/**
 * Canonical pathnames emitted in `dist/sitemap.xml` (pathname after SPA basename).
 * Mirrors `routes/AppRouter.tsx` — bilingual routes repeat as `/path` + `/en/path`.
 */

const BILINGUAL_SEGMENTS = [
  "",
  "about",
  "facility",
  "blog",
  "blogDetail",
  "admission",
  "academic-degrees",
  "gallery",
  "publications",
  "president-message",
] as const;

/** Arabic-only locale routes (no `/en/...` equivalent in router today). */
const AR_ONLY_SEGMENTS = [
  "training-and-development",
  "future-police",
  "agreements",
  "multimedia",
  "police-entities",
] as const;

function segmentToPathname(seg: string): string {
  if (seg === "") return "/";
  return `/${seg}`;
}

export function computeSitemapPathnames(): string[] {
  const out: string[] = [];

  for (const seg of AR_ONLY_SEGMENTS) {
    out.push(segmentToPathname(seg));
  }

  for (const seg of BILINGUAL_SEGMENTS) {
    const ar = segmentToPathname(seg);
    out.push(ar);
    out.push(seg === "" ? "/en" : `/en/${seg}`);
  }

  return [...new Set(out)];
}

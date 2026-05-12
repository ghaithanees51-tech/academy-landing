export const PDF_JS_ASSET_BASE = "/pdfjs";
export const PDF_JS_CMAP_URL = `${PDF_JS_ASSET_BASE}/cmaps/`;
export const PDF_JS_STANDARD_FONT_URL = `${PDF_JS_ASSET_BASE}/standard_fonts/`;

/**
 * Base pdf.js document params applied to every PDF load.
 * - cMapUrl / cMapPacked: needed for CJK encoded PDFs.
 * - standardFontDataUrl: fallback fonts served from node_modules.
 * - disableFontFace: render glyphs as vector paths from the embedded font
 *   data instead of creating @font-face rules. This is the key fix for
 *   Arabic PDFs where the browser's text-shaping engine would re-shape
 *   already-shaped glyphs, producing disconnected (isolated) letters.
 * - useSystemFonts: false – prevent OS font substitution so we stay
 *   consistent across environments.
 */
export const PDF_JS_DOC_PARAMS = {
  cMapUrl: PDF_JS_CMAP_URL,
  cMapPacked: true,
  standardFontDataUrl: PDF_JS_STANDARD_FONT_URL,
  disableFontFace: true,
  useSystemFonts: false,
} as const;

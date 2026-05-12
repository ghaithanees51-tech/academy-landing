type AssetModule = { default: string };

const ALL_IMAGE_MODULES = import.meta.glob<AssetModule>(
  "../assets/**/*.{png,jpg,jpeg,webp,svg,gif,avif}",
  { eager: true },
);

const DOCUMENTS_MODULES = import.meta.glob<AssetModule>(
  "../assets/documents/**/*.pdf",
  { eager: true },
);

const ASSET_MAP: Record<string, string> = {};

for (const [fullPath, mod] of Object.entries(ALL_IMAGE_MODULES)) {
  const rel = fullPath.replace(/^\.\.\/assets\//, "");
  ASSET_MAP[rel] = mod.default;

  if (rel.startsWith("images/")) {
    ASSET_MAP[rel.slice("images/".length)] = mod.default;
  }
}

const DOCUMENT_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DOCUMENTS_MODULES).map(([fullPath, mod]) => {
    const rel = fullPath.replace(/^\.\.\/assets\//, "");
    return [rel, mod.default];
  }),
);

function normalizeImageKey(input: string): string {
  return input.trim().replace(/^\/+/, "").replace(/^images\//, "");
}

export function imageAsset(path: string): string {
  const key = normalizeImageKey(path);
  return ASSET_MAP[key] ?? path;
}

export function pdfAsset(path: string): string {
  const key = path.trim().replace(/^\/+/, "");
  return DOCUMENT_MAP[key] ?? `/${key}`;
}

/** Returns true when pdfAsset() resolved the path to a real bundled file. */
export function isPdfBundled(resolvedUrl: string): boolean {
  return resolvedUrl.startsWith("/assets/");
}

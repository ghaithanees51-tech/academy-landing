/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string;
  readonly VITE_API_URL?: string;
  readonly VITE_PUBLICATIONS_PER_PAGE?: string;
  readonly VITE_BLOG_HOME_PREVIEW_COUNT?: string;
  readonly VITE_BLOG_HOME_GRID_COLS_MD?: string;
  readonly VITE_BLOG_HOME_GRID_COLS_LG?: string;
  readonly VITE_SHELL_META_AR_PREFIX?: string;
  readonly VITE_SITE_DESCRIPTION_TAGLINE?: string;
  readonly VITE_SITE_DESCRIPTION_FALLBACK?: string;
  readonly VITE_SITE_LOGO_ALT_FALLBACK?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_TWITTER_SITE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "swiper/css" {}
declare module "swiper/css/navigation" {}
declare module "swiper/css/effect-fade" {}
declare module "pdfjs-dist/build/pdf.worker.min.js" {
  const workerSrc: string;
  export default workerSrc;
}

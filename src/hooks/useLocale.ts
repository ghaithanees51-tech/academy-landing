import { useLocation } from "react-router-dom";

export const LOCALE_EN = "en" as const;
export const LOCALE_AR = "ar" as const;
export type Locale = typeof LOCALE_EN | typeof LOCALE_AR;

export function useLocale(): {
  locale: Locale;
  isRtl: boolean;
  basePath: string;
  pathWithoutLocale: string;
} {
  const { pathname } = useLocation();
  const isEn = pathname.startsWith("/en");
  const locale: Locale = isEn ? LOCALE_EN : LOCALE_AR;
  const basePath = isEn ? "/en" : "";
  const pathWithoutLocale = isEn ? pathname.slice(3) || "/" : pathname;

  return {
    locale,
    isRtl: !isEn,
    basePath,
    pathWithoutLocale,
  };
}

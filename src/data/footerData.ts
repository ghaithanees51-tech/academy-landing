import type { FooterRelatedLink, FooterSocialLink } from "@/types/page.d.ts";

export type { FooterSocialKey } from "@/types/page.d.ts";

export const footerData = {
  brandLogoAlt: "أكاديمية الشرطة",
  socialIntro: "نسعد بتواصلكم على مواقع التواصل الاجتماعي",
  contactTitle: "معلومات التواصل",
  locationText: "الدوحة — قطر",
  poBoxText: "صندوق البريد: 7157",
  relatedLinksAriaLabel: "روابط ذات صلة",
  relatedLinksTitle: "روابط ذات صلة",
  copyrightPrefix: "حقوق النشر محفوظة © وزارة الداخلية",
} as const;

export const footerRelatedLinks: FooterRelatedLink[] = [
  { id: 1, label: "بوابة القبول الإلكتروني للجنة الدائمة الموحدة", href: "https://upc.moi.gov.qa/" },
  { id: 2, label: "نظام التعليم الإلكتروني", href: "https://lms.moi.gov.qa/" },
  { id: 3, label: "وزارة الداخلية - قطر", href: "https://portal.moi.gov.qa/wps/portal/ar" },
  { id: 4, label: "جامعة قطر", href: "https://www.qu.edu.qa/ar/" },
  { id: 5, label: "وزارة التربية والتعليم والتعليم العالي", href: "https://www.edu.gov.qa/ar/" },
];

export const footerSocialLinks: FooterSocialLink[] = [
  { id: 1, key: "snapchat", href: "#", label: "سناب شات : moi.qatar" },
  { id: 2, key: "youtube", href: "https://www.youtube.com/user/moigovqa", label: "يوتيوب" },
  { id: 3, key: "instagram", href: "https://www.instagram.com/policeacademy.qa/?hl=ar", label: "إنستغرام" },
  { id: 4, key: "facebook", href: "https://www.facebook.com/policecollege.qatar", label: "فيسبوك" },
  { id: 5, key: "x", href: "https://x.com/moi_qatar", label: "إكس" },
];


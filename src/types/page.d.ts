import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Page header about aside */
export type PageHeaderAboutAsideItemKey = "lms" | "admissions";
export type PageHeaderAboutAsideItem = {
    key: PageHeaderAboutAsideItemKey;
    href: string;
    title: string;
    description: string;
};

/** About page quick links */
export type AboutQuickLink = { 
    id: string; 
    title: string; 
    icon: LucideIcon 
};
export type AboutSectionImage = {
    src: string;
    alt: string;
    caption?: string;
};
export type AboutSectionEntry = {
    title: string;
    body: ReactNode;
    images?: AboutSectionImage[];
};

/** Police entity info cards (per-entity quick-facts section) */
export type EntityInfoCard = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
};

/**
 * Examples:
 * - 3 cols on laptop+: `{ base: 1, md: 2, lg: 3 }`
 * - 4 cols on laptop+: `{ base: 1, md: 2, lg: 4 }`
 * - Same from tablet up: `{ base: 1, sm: 3 }` or `{ base: 1, sm: 4 }`
 * - Extra-wide tweak: `xl?: 4` with `lg: 3`.
 */
export type EntityInfoCardsGrid = {
  base?: 1 | 2 | 3 | 4;
  sm?: 1 | 2 | 3 | 4;
  md?: 1 | 2 | 3 | 4;
  lg?: 1 | 2 | 3 | 4;
  xl?: 1 | 2 | 3 | 4;
};

export type EntityInfoCardsBlock = {
  cards: EntityInfoCard[];
  grid?: EntityInfoCardsGrid;
};

/** Police entity tabs */
export type PoliceEntityTabKey = "intro" | "tasks" | "orgChartBrief" | "chart" | "contact";
export type PoliceEntityImage = {
  src: string;
  alt: string;
};

export type PoliceEntityOrgChartPdf = {
  path: string;
  documentTitle: string;
  pages?: number;
  intro?: string;
};

export type PoliceEntity = {
  id: string;
  menuTitle: string;
  badge: string;
  heroTitle: string;
  images: PoliceEntityImage[];
  /** PDF for the organizational chart tab (see `PoliceEntity.tsx` chart tab); each entity may use its own file path */
  chartPdf?: PoliceEntityOrgChartPdf;
  tabs: {
    intro: ReactNode[];
    tasks?: ReactNode[];
    /** Optional tab shown immediately before the PDF organizational chart (`chart`) tab */
    orgChartBrief?: ReactNode[];
    /** Fallback markup for chart tab when `chartPdf` is omitted */
    chart?: ReactNode[];
    contact?: ReactNode[];
  };
};

/** Admission page quick links */
export type AdmissionQuickLink = {
    id: string;
    title: string;
    icon: LucideIcon;
};
export type AdmissionSectionEntry = {
    title: string;
    body: ReactNode;
};

/** Training page quick links */
export type TrainingQuickLink = {
    id: string;
    title: string;
    icon: LucideIcon;
};  
export type TrainingSectionEntry = {
    title: string;
    body: ReactNode;
};

/** Future Police page quick links */
export type FuturePoliceQuickLink = {
    id: string;
    title: string;
    icon: LucideIcon;
};
export type FuturePoliceSectionImage = {
    src: string;
    alt: string;
    caption?: string;
};  
export type FuturePoliceSectionEntry = {
    title: string;
    body: ReactNode;
    images?: FuturePoliceSectionImage[];
};

/** Publications page – categories are driven by the backend; "all" is a client-side virtual tab. */
export type PublicationCategory = string;

export type PublicationType = "pdf" | "link";

export type PublicationItem = {
    id: number;
    category: string;
    title: string;
    image: string;
    link?: string;
    /** Opens /publications with this category tab (see `PublicationCategory`). */
    listCategory?: PublicationCategory;
};
export type PublicationDoc = {
    id: number;
    type: PublicationType;
    category: Exclude<PublicationCategory, "all">;
    category_name?: string;
    title: string;
    subtitle?: string;
    description?: string;
    cover: string;
    date: string;
    url: string;
    pages?: number;
    author?: string;
    publisher?: string;
    edition?: string;
    year?: string;
    isbn?: string;
    language?: string;
    audio?: string;
    video?: string;
    has_text_extraction?: boolean;
    extraction_summary?: string | null;
};

/** Partners page */
export type PartnerItem = {
    id: number;
    logo: string;
    alt: string;
    /** Resolved absolute URL from the remote HTML `<a href>`, when present */
    href?: string;
};

/** Multimedia page */
export type MultimediaItem = {
    id: number;
    type: "youtube" | "direct";
    url: string;
    cover: string;
    title: string;
    description?: string;
    category: string;
    date: string;
    duration?: string;
};

/** Gallery page */
export type GalleryCategory = string;

export type GalleryItem = {
    id: number;
    src: string;
    caption: string;
    category: Exclude<GalleryCategory, "all">;
    date: string;
};

/** Academy facilities page */
export type AcademyFacilityImage = {
    src: string;
    alt: string;
};  
export type AcademyFacilityItem = {
    id: string;
    number: string;
    title: string;
    description: string;
    body: ReactNode;
    images: AcademyFacilityImage[];
};

/** Floating actions page */
export type FloatingContactDepartment = {
    title: string;
    email: string;
    phone: string;
};
  
/** Footer page */
export type FooterSocialKey = "snapchat" | "youtube" | "instagram" | "facebook" | "x";
export type FooterRelatedLink = {
    id: number;
    label: string;
    href: string;
};
export type FooterSocialLink = {
    id: number;
    key: FooterSocialKey;
    href: string;
    label: string;
};
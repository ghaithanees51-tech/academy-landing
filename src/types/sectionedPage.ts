import type { ReactNode } from "react";

export type DocumentPageDegree = {
  title: string;
  body: ReactNode;
};

export type DocumentPageCollege = {
  collegeTitle: string;
  degrees?: DocumentPageDegree[];
  listItems?: string[];
  footer?: ReactNode;
};

export type DocumentPageData = {
  seo: { title: string; description: string };
  routePath: string;
  pageHeader: { badge: string; title: string };
  intro: ReactNode;
  headerAside?: ReactNode;
  colleges: DocumentPageCollege[];
};

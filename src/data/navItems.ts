import type { NavItem } from "@/types";

export type { DropdownItem, NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "عن الأكاديمية", href: "/about"},
  { label: "كيانات الأكاديمية", href: "/police-entities"},
  { label: "منشآت الأكاديمية", href: "/Facility"},
  { label: "قواعد القبول", href: "/admission"},
  { label: "برامج الأكاديمية", href: "/academic-degrees"},
  {label: "التدريب والتأهيل", href: "/training-and-development"},
  {
    label: "المركز الإعلامي",
    children: [
      { label: "أخبار وفعاليات", href: "/blog" },
      { label: "ألبوم الصور", href: "/gallery" },
      { label: "وسائط متعددة ", href: "/multimedia" },
      { label: "إصدارات ومطبوعات", href: "/publications" },
    ],
  },
  { label: "برنامج شرطة الغد", href: "/future-police"},
  { label: "الاتفاقيات والمذكرات", href: "/agreements"},
];

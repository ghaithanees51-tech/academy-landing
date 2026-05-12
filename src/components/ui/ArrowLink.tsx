import { Link } from "react-router-dom";
import type { ReactElement } from "react";

type ArrowLinkVariant =
  | "pillCta"
  | "plainPrimary"
  | "plainSecondary"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";

type IconType = "arrow" | "chevron" | "none";
type IconAnimation = "none" | "slide" | "bounce";

type ArrowLinkProps = {
  to: string;
  label: string;
  className?: string;
  variant?: ArrowLinkVariant;
  iconType?: IconType;
  iconAnimation?: IconAnimation;
};

const VARIANT_CLASSNAME: Record<ArrowLinkVariant, string> = {
  pillCta:
    "inline-flex items-center gap-3 rounded-full border border-primary px-8 py-3 text-md font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white",
  plainPrimary:
    "inline-flex items-center gap-2 text-primary text-primary font-semibold hover:text-primary/90",
  plainSecondary:
    "inline-flex items-center gap-2 text-secondary text-secondary font-semibold hover:text-secondary/90",
  primary:
    "inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white font-semibold hover:bg-primary/90 transition",
  secondary:
    "inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-2 text-white font-semibold hover:bg-secondary/90 transition",
  outline:
    "inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-2 text-primary font-semibold hover:bg-primary hover:text-white transition",
  ghost:
    "inline-flex items-center gap-2 rounded-lg px-6 py-2 text-primary hover:bg-primary/10 transition",
};

const ICONS: Record<Exclude<IconType, "none">, ReactElement> = {
  arrow: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  ),
  chevron: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
};

const ICON_ANIMATION: Record<IconAnimation, string> = {
  none: "",
  slide: "group-hover:translate-x-1 transition-transform duration-300",
  bounce: "group-hover:animate-bounce",
};

export default function ArrowLink({
  to,
  label,
  className = "",
  variant = "pillCta",
  iconType = "arrow",
  iconAnimation = "slide",
}: ArrowLinkProps) {
  const icon =
    iconType !== "none" ? (
      <span className={ICON_ANIMATION[iconAnimation]}>
        {ICONS[iconType]}
      </span>
    ) : null;

  return (
    <Link
      to={to}
      className={`${VARIANT_CLASSNAME[variant]} group ${className}`.trim()}
    >
      {label}
      {icon}
    </Link>
  );
}
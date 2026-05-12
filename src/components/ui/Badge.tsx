import React from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "light"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  /** Applied to the label text wrapper (e.g. truncate, tabular-nums). */
  labelClassName?: string;
};

const badgeVariantClassName: Record<BadgeVariant, string> = {
  secondary: "border-secondary/25 text-secondary pt-1.5",
  primary: "border-primary/25 text-primary pt-1.5",
  light: "border-white/30 text-white bg-white/15 pt-1.5",
  success: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10 pt-1.5",
  danger: "border-red-400/30 text-red-400 bg-red-400/10 pt-1.5",
  warning: "border-amber-400/30 text-amber-400 bg-amber-400/10 pt-1.5",
  info: "border-sky-400/30 text-sky-400 bg-sky-400/10 pt-1.5",
  dark: "border-gray-600/40 text-gray-200 bg-gray-800/50 pt-1.5",
};

const dotVariantClassName: Record<BadgeVariant, string> = {
  secondary: "bg-secondary ring-secondary/20 -mt-1.5",
  primary: "bg-primary ring-primary/15 -mt-1.5",
  light: "bg-white ring-white/20 -mt-1.5",
  success: "bg-emerald-400 ring-emerald-400/20 -mt-1.5",
  danger: "bg-red-400 ring-red-400/20 -mt-1.5",
  warning: "bg-amber-400 ring-amber-400/20 -mt-1.5",
  info: "bg-sky-400 ring-sky-400/20 -mt-1.5",
  dark: "bg-gray-400 ring-gray-400/20 -mt-1.5",
};

const Badge = ({
  label,
  variant = "secondary",
  icon,
  className,
  labelClassName,
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex h-9 px-5 items-center gap-2 whitespace-nowrap rounded-full border bg-white/10 backdrop-blur-md shadow-soft ${badgeVariantClassName[variant]} ${className ?? ""}`}
    >
      {icon ? (
        <span className="flex shrink-0 items-center text-xs">{icon}</span>
      ) : (
        <span className={`h-2 w-2 shrink-0 rounded-full ring-4 ${dotVariantClassName[variant]}`} />
      )}
      <span className={`min-w-0 pr-1 truncate text-md md:text-lg font-bold ${labelClassName ?? ""}`.trim()}>{label}</span>
    </span>
  );
};

export default Badge;

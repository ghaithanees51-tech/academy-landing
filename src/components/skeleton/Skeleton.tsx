import type { CSSProperties, HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Tailwind size classes (e.g. "h-4 w-32"). */
  className?: string;
  /** Rounded corners utility (defaults to rounded-xl). */
  rounded?: string;
};

export function Skeleton({ className = "", rounded = "rounded-xl", ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={`skeleton-shimmer bg-border/60 ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonLine({ className = "", ...props }: Omit<SkeletonProps, "rounded">) {
  return <Skeleton rounded="rounded-md" className={`h-3 ${className}`} {...props} />;
}

export function SkeletonAvatar({
  size = 40,
  className = "",
  ...props
}: Omit<SkeletonProps, "rounded"> & { size?: number }) {
  return (
    <Skeleton
      rounded="rounded-full"
      className={className}
      style={{ width: size, height: size, ...(props.style || ({} as CSSProperties)) }}
      {...props}
    />
  );
}


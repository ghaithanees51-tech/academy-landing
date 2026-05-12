type FadeHairlineProps = {
  /** Positioning and horizontal inset, e.g. `absolute inset-x-0 top-0` or `absolute top-0 left-6 right-6` */
  className: string;
};

/**
 * Single-pixel rule: neutral grey strongest near the center, fully transparent at both ends
 * (gradient line — not a CSS border).
 */
export default function FadeHairline({ className }: FadeHairlineProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none h-px shrink-0 bg-linear-to-r from-transparent from-4% via-border via-50% to-transparent to-96% ${className}`.trim()}
    />
  );
}

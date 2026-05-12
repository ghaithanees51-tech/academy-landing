import Badge from "@/components/ui/Badge";
import { Calendar } from "lucide-react";
import { toWesternDigits } from "@/utils/digits";

type CardDateOverlayProps = {
  /** Raw date string from CMS; nothing is rendered if empty. */
  date?: string | null;
};

/**
 * Date on card hero images — frosted glass {@link Badge} (secondary accents, light panel).
 */
export default function CardDateOverlay({ date }: CardDateOverlayProps) {
  const raw = typeof date === "string" ? date.trim() : "";
  if (!raw) return null;

  const display = toWesternDigits(raw);

  return (
    <div
      className="pointer-events-none absolute bottom-3 inset-s-3 max-w-[min(100%,14rem)]"
      aria-label={`التاريخ: ${raw}`}
    >
      <div className="max-w-full min-w-0">
        <Badge
          variant="secondary"
          label={display}
          icon={
            <Calendar
              className="h-3.5 w-3.5 text-black/80"
              strokeWidth={2}
              aria-hidden
            />
          }
          labelClassName="font-semibold tabular-nums tracking-wide text-black! mt-1!"
          className="h-auto! max-w-full min-w-0 gap-1.5! border-secondary/20! bg-white/40! px-1.5! py-1! text-[11px]! text-black! shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-md backdrop-saturate-150 ring-1 ring-inset ring-white/50 sm:gap-2! sm:px-3! sm:py-1.5! sm:text-xs!"
        />
      </div>
    </div>
  );
}

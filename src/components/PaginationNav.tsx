import type { ReactNode } from "react";
import type { PageToken } from "@/utils/pagination";

export default function PaginationNav({
  ariaLabel,
  rangeText,
  page,
  totalPages,
  pageNumbers,
  onPage,
  prevLabel,
  nextLabel,
  gapLabel = "…",
}: {
  ariaLabel: string;
  rangeText: ReactNode;
  page: number;
  totalPages: number;
  pageNumbers: PageToken[];
  onPage: (p: number) => void;
  prevLabel: string;
  nextLabel: string;
  gapLabel?: string;
}) {
  return (
    <nav className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-10" aria-label={ariaLabel}>
      <p className="text-center text-sm text-body tabular-nums">{rangeText}</p>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            className={`inline-flex min-w-24 cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
              page <= 1
                ? "cursor-not-allowed border-border text-body/50"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {prevLabel}
          </button>

          <ul className="flex flex-wrap items-center justify-center gap-1.5">
            {pageNumbers.map((n, i) =>
              n === "gap" ? (
                <li key={`gap-${i}`}>
                  <span className="px-1 text-body" aria-hidden>
                    {gapLabel}
                  </span>
                </li>
              ) : n === page ? (
                <li key={n}>
                  <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white tabular-nums">
                    {n}
                  </span>
                </li>
              ) : (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => onPage(n)}
                    className="inline-flex min-w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-white px-3 py-2 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary/5 tabular-nums"
                  >
                    {n}
                  </button>
                </li>
              ),
            )}
          </ul>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPage(page + 1)}
            className={`inline-flex min-w-24 cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
              page >= totalPages
                ? "cursor-not-allowed border-border text-body/50"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {nextLabel}
          </button>
        </div>
      )}
    </nav>
  );
}


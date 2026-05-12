import { type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";
import TabPanelSpinnerOverlay from "./TabPanelSpinnerOverlay.tsx";

export type MobileSectionDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  titleId: string;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
  tabContentLoading: boolean;
  children: ReactNode;
  /** Shown under the title row, above the scroll area (e.g. entity hero + tab strip). */
  betweenHeaderAndBody?: ReactNode;
};

export default function MobileSectionDrawer({
  open,
  onClose,
  title,
  titleId,
  closeButtonRef,
  tabContentLoading,
  children,
  betweenHeaderAndBody,
}: MobileSectionDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-100 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close panel"
        className={`absolute inset-0 z-0 bg-black/45 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!open}
        className={`absolute top-0 right-0 z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-lg ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-primary px-4 py-4 text-white sm:px-5">
          <h2 id={titleId} className="min-w-0 flex-1 text-right text-lg font-extrabold leading-snug sm:text-xl">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
        {betweenHeaderAndBody != null ? (
          <div className="shrink-0">{betweenHeaderAndBody}</div>
        ) : null}
        <div
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6"
          aria-busy={tabContentLoading}
        >
          <TabPanelSpinnerOverlay show={tabContentLoading} className="" />
          {children}
        </div>
      </div>
    </div>
  );
}

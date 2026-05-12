import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  id: string;
  title: string;
  icon: LucideIcon;
};

type SectionNavMobileProps = {
  ariaLabel: string;
  items: SidebarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function SectionNavMobile({ ariaLabel, items, selectedId, onSelect }: SectionNavMobileProps) {
  return (
    <nav className="mb-14 md:mb-16 md:hidden" aria-label={ariaLabel}>
      <ul className="space-y-2">
        {items.map(({ id, title, icon: Icon }) => {
          const active = selectedId === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-right text-sm font-semibold leading-snug shadow-soft transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  active
                    ? "border-secondary/40 bg-secondary/8 text-primary"
                    : "border-border bg-white text-primary hover:border-secondary/35 hover:shadow-md"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/6 text-primary">
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

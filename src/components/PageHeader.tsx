import type { ReactNode } from "react";

export type PageHeaderProps = {
  title: string;
  className?: string;
  status?: ReactNode;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  className = "mb-4 md:mb-8",
  status,
  actions,
}: PageHeaderProps) {

  return (
    <header className={className}>
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
        <div className="flex flex-col gap-4 px-6 py-4 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-6 md:py-6">
          <div className="relative flex min-w-0 flex-1 items-center gap-3">
            <h1 className="text-right text-2xl font-extrabold leading-tight text-primary">
              {title}
            </h1>
            {status != null ? <div className="shrink-0">{status}</div> : null}
          </div>
          {actions != null ? (
            <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 md:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}


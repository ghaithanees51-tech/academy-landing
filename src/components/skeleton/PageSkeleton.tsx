import { Skeleton, SkeletonLine } from "./Skeleton";

export default function PageSkeleton() {
  return (
    <main className="relative overflow-hidden bg-linear-to-b from-white to-[#f4f6f9] py-10 pb-20" dir="rtl">
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-layout px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-border bg-white p-7 shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <Skeleton className="h-5 w-32" rounded="rounded-full" />
              <div className="mt-4 space-y-3">
                <SkeletonLine className="h-6 w-[min(460px,85%)]" />
                <SkeletonLine className="h-4 w-[min(560px,95%)]" />
                <SkeletonLine className="h-4 w-[min(520px,90%)]" />
              </div>
            </div>
            <div className="w-full md:w-56">
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>

        {/* cards */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
                <Skeleton className="aspect-16/11 w-full" rounded="rounded-none" />
                <div className="space-y-3 px-4 py-4">
                  <SkeletonLine className="h-4 w-4/5" />
                  <SkeletonLine className="h-3 w-full" />
                  <SkeletonLine className="h-3 w-11/12" />
                  <SkeletonLine className="h-3 w-9/12" />
                </div>
                <div className="border-t border-border px-4 py-3">
                  <SkeletonLine className="h-3 w-28" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}


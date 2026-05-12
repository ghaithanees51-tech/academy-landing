import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import PublicationCard from "@/components/PublicationCard";
import { MobileQrCard } from "@/components/qrcode/MobileQrCard";
import PaginationNav from "@/components/PaginationNav";
import { useLocale } from "@/hooks/useLocale";
import { useTabPanelLoader } from "@/hooks/useTabPanelLoader";
import {
  publicationCategories,
  publicationsUiText,
  publicationsListPath,
  type PublicationCategory,
  type PublicationDoc,
} from "@/data/publicationsData";
import { fetchPublicationCategories, fetchPublicationStats, fetchPublications } from "@/services/publicationsApi";
import type { PublicationCategoryItem } from "@/services/publicationsApi";
import { buildPageNumbers } from "@/utils/pagination";

const PUBLICATIONS_PER_PAGE =
  Number.parseInt((import.meta.env.VITE_PUBLICATIONS_PER_PAGE as string | undefined) ?? "", 10) || 12;

const Home = () => {
  const { basePath } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [publications, setPublications] = useState<PublicationDoc[]>([]);
  const [publicationsLoading, setPublicationsLoading] = useState(true);
  const [publicationsError, setPublicationsError] = useState<string | null>(null);
  const [publicationCategoryCounts, setPublicationCategoryCounts] = useState<Record<string, number>>({});
  const [publicationStatsLoading, setPublicationStatsLoading] = useState(true);
  const [categories, setCategories] = useState<PublicationCategoryItem[]>(publicationCategories);

  const ALL_CAT = publicationCategories[0].id; // "all" – always the virtual first tab
  const rawCategory = searchParams.get("cat") ?? ALL_CAT;
  const validCategories = categories.map((c) => c.id);
  const category: PublicationCategory = validCategories.includes(rawCategory) ? rawCategory : ALL_CAT;

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const loadPublications = async () => {
      setPublicationsLoading(true);
      setPublicationStatsLoading(true);
      setPublicationsError(null);

      try {
        const [itemsResult, statsResult, categoriesResult] = await Promise.allSettled([
          fetchPublications(controller.signal),
          fetchPublicationStats(controller.signal),
          fetchPublicationCategories(controller.signal),
        ]);

        if (!alive) return;

        if (itemsResult.status === "fulfilled") {
          setPublications(itemsResult.value);
        } else if (!(itemsResult.reason instanceof DOMException && itemsResult.reason.name === "AbortError")) {
          setPublications([]);
          setPublicationsError(
            itemsResult.reason instanceof Error ? itemsResult.reason.message : "تعذر تحميل الإصدارات",
          );
        }

        if (statsResult.status === "fulfilled") {
          setPublicationCategoryCounts(statsResult.value.counts);
        } else if (!(statsResult.reason instanceof DOMException && statsResult.reason.name === "AbortError")) {
          setPublicationCategoryCounts({});
        }

        if (categoriesResult.status === "fulfilled" && categoriesResult.value.length > 0) {
          // Prepend the virtual "all" tab; backend categories follow in DB order
          setCategories([{ id: "all", label: "الكل" }, ...categoriesResult.value]);
        }
      } finally {
        if (alive) {
          setPublicationsLoading(false);
          setPublicationStatsLoading(false);
        }
      }
    };

    void loadPublications();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  const filtered = useMemo(() => {
    const byCategory = category === "all" ? publications : publications.filter((d) => d.category === category);
    if (!searchQuery.trim()) return byCategory;
    const q = searchQuery.toLowerCase();
    return byCategory.filter((d) => d.title.toLowerCase().includes(q));
  }, [category, publications, searchQuery]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PUBLICATIONS_PER_PAGE));
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const page = Math.min(Math.max(1, Number.isFinite(rawPage) ? rawPage : 1), totalPages);
  const start = (page - 1) * PUBLICATIONS_PER_PAGE;
  const pageItems = filtered.slice(start, start + PUBLICATIONS_PER_PAGE);
  const pageNumbers = buildPageNumbers(page, totalPages);

  const listPanelKey = `${category}:${page}`;
  const { tabContentLoading, startTabTransition } = useTabPanelLoader(listPanelKey);
  const isLoading = tabContentLoading || publicationsLoading || publicationStatsLoading;

  const setCategory = (cat: PublicationCategory) => {
    if (cat === category) return;
    startTabTransition();
    const p = new URLSearchParams();
    if (cat !== ALL_CAT) p.set("cat", cat);
    setSearchParams(p, { replace: true });
  };

  const setPage = (p: number) => {
    if (p === page) return;
    startTabTransition();
    const params = new URLSearchParams(searchParams);
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    setSearchParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canonical = publicationsListPath(basePath, page, category);

  const pageShareUrl = (() => {
    try { return new URL(canonical, window.location.origin).toString(); }
    catch { return canonical; }
  })();


  return (
    <>
      <main className="relative overflow-clip bg-linear-to-b from-white to-[#f4f6f9] py-10 pb-24" dir="rtl">
        <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-layout px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:hidden">
            <MobileQrCard url={pageShareUrl} title={publicationsUiText.qrQuickShareTitle} scanHint={publicationsUiText.qrShareScanHint} />
          </div>
          <section
            className="relative min-w-0 rounded-2xl border border-border bg-white px-6 py-8 shadow-soft sm:px-8 md:py-10"
            aria-live="polite"
            aria-busy={isLoading}
            dir="rtl"
          >
            <div className="mb-8 flex flex-col gap-3 rounded-xl bg-surface/80 p-3 ring-1 ring-border/60 sm:flex-row sm:items-center sm:justify-between">
              <div
                className="flex flex-wrap items-center gap-2"
                role="tablist"
                aria-label={publicationsUiText.categoryFilterAriaLabel}
              >
                {categories.map((cat) => {
                  const active = category === cat.id;
                  const catBackendCount = cat.id === "all"
                    ? Object.values(publicationCategoryCounts).reduce((s, n) => s + n, 0) || undefined
                    : publicationCategoryCounts[cat.id];
                  const catStaticCount = cat.id === "all"
                    ? publications.length
                    : publications.filter((d) => d.category === cat.id).length;
                  const count = catBackendCount ?? catStaticCount;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(cat.id)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                        active ? "bg-primary text-white shadow" : "text-primary/80 hover:bg-primary/8 hover:text-primary"
                      }`}
                    >
                      {cat.label}
                      <span
                        className={`inline-flex w-6 h-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none tabular-nums ${
                          active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-auto sm:min-w-[240px] md:min-w-[280px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-body" aria-hidden />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    const params = new URLSearchParams(searchParams);
                    params.delete("page");
                    setSearchParams(params, { replace: true });
                  }}
                  placeholder="بحث..."
                  className="w-full rounded-xl border border-border bg-white py-2 pl-10 pr-8 text-sm text-right text-primary placeholder:text-body/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="بحث في الإصدارات"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-body hover:text-primary"
                    aria-label="مسح البحث"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {searchQuery && (
              <p className="mb-4 text-xs text-body">
                {filtered.length === 0
                  ? "لا توجد نتائج"
                  : `تم العثور على ${filtered.length} نتيجة`}
              </p>
            )}

            <div className="relative min-h-48">
              {publicationsLoading ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/40 text-center">
                  <p className="text-lg font-bold text-primary">جارٍ تحميل الإصدارات...</p>
                  <p className="text-sm text-body">يرجى الانتظار قليلًا</p>
                </div>
              ) : publicationsError && publications.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/40 text-center">
                  <p className="text-lg font-bold text-primary">تعذر تحميل الإصدارات</p>
                  <p className="text-sm text-body">{publicationsError}</p>
                </div>
              ) : pageItems.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/40 text-center">
                  <p className="text-lg font-bold text-primary">{publicationsUiText.emptyStateTitle}</p>
                  <p className="text-sm text-body">{publicationsUiText.emptyStateSubtitle}</p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {pageItems.map((doc) => (
                    <li key={doc.id} className="h-full min-w-0">
                      <PublicationCard
                        doc={doc}
                        basePath={basePath}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <PaginationNav
            ariaLabel={publicationsUiText.paginationAriaLabel}
            rangeText={
              <>
                {publicationsUiText.paginationRangePrefix} {Math.min(start + 1, totalItems)}–
                {Math.min(start + PUBLICATIONS_PER_PAGE, totalItems)} {publicationsUiText.paginationOfLabel} {totalItems}{" "}
                {publicationsUiText.paginationItemSuffix}
              </>
            }
            page={page}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPage={setPage}
            prevLabel={publicationsUiText.paginationPrevLabel}
            nextLabel={publicationsUiText.paginationNextLabel}
          />
        </div>
      </main>
    </>
  );
};

export default Home;

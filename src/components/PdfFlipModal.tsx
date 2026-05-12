import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, LoaderCircle, Minus, Plus, RotateCcw, X } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import { PDF_JS_DOC_PARAMS } from "@/config/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  url: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
};

type PageSlotProps = {
  pageNum: number;
  pdf: pdfjsLib.PDFDocumentProxy | null;
  pageWidth: number;
  pageHeight: number;
  /** 0-based flipbook index (from onFlip) — drives lazy rendering */
  currentPage: number;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Render PDF pages within this many slots of the visible spread */
const RENDER_BUFFER = 4;

/** Zoom factor applied when rendering each page onto its canvas (1.0 = fit-to-slot) */
const ZOOM = 1.25;

// ---------------------------------------------------------------------------
// Layout note
// ---------------------------------------------------------------------------
//
// react-pageflip with showCover=true and startPage=0 shows page 0 (cover)
// alone on the RIGHT side — exactly matching an Arabic book where the front
// cover is on the right.  flipNext() folds the right page to the left, which
// is the natural Arabic page-turn gesture.  No CSS mirroring is needed.
//
// RTL navigation buttons are simply placed on the correct edges:
//   RIGHT edge  → "التالي"  (goNext = flipNext)
//   LEFT  edge  → "السابق" (goPrev = flipPrev)
//
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// PageSlot — one leaf of the book (forwardRef is required by react-pageflip)
// ---------------------------------------------------------------------------

const PageSlot = forwardRef<HTMLDivElement, PageSlotProps>(
  ({ pageNum, pdf, pageWidth, pageHeight, currentPage }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [rendered, setRendered] = useState(false);

    // 0-based index of this slot = pageNum - 1
    const distance = Math.abs(pageNum - 1 - currentPage);
    const shouldRender = distance <= RENDER_BUFFER;

    useEffect(() => {
      if (!shouldRender || !pdf || !canvasRef.current) return;
      let cancelled = false;

      (async () => {
        try {
          const pdfPage = await pdf.getPage(pageNum);
          if (cancelled || !canvasRef.current) return;

          const raw = pdfPage.getViewport({ scale: 1 });
          const scale = Math.min(pageWidth / raw.width, pageHeight / raw.height) * ZOOM;
          const sv = pdfPage.getViewport({ scale });

          const canvas = canvasRef.current;
          canvas.width = Math.floor(sv.width);
          canvas.height = Math.floor(sv.height);

          const ctx = canvas.getContext("2d");
          if (!ctx || cancelled) return;

          await pdfPage.render({ canvasContext: ctx, viewport: sv }).promise;
          if (!cancelled) setRendered(true);
        } catch (err) {
          if (!cancelled) console.error("PdfFlipModal: render page", pageNum, err);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [pdf, pageNum, shouldRender, pageWidth, pageHeight]);

    return (
      <div
        ref={ref}
        style={{
          width: pageWidth,
          height: pageHeight,
          background: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Counter-mirror: undo the scaleX(-1) applied to the book wrapper so text is readable */}
        <div
          style={{
            transform: "scaleX(-1)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
        {shouldRender && (
          <>
            <canvas
              ref={canvasRef}
              style={{ display: "block", maxWidth: "100%", maxHeight: "100%" }}
            />
            {!rendered && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f8f8f8",
                }}
              >
                <LoaderCircle
                  style={{ width: 28, height: 28, color: "#9ca3af" }}
                  className="animate-spin"
                  aria-hidden
                />
              </div>
            )}
          </>
        )}
        </div>
      </div>
    );
  },
);
PageSlot.displayName = "BookPage";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** A4 page dimensions that fill as much of the modal book area as possible. */
function calcPageDims(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 420, height: 595 };

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Modal outer bounds (matches Tailwind max-w-[1180px] h-[min(92vh,860px)])
  const modalH = Math.min(vh * 0.92, 860);
  const modalW = Math.min(vw - 32, 1180); // 32px = p-4 on both sides of backdrop

  // Book area: subtract header (≈52px) + footer (≈52px)
  const areaH = modalH - 104;
  const areaW = modalW; // flex-center handles margins; give pages maximum width

  // Fit A4 (595×842) into areaW/2 wide × areaH tall
  const maxPageW  = Math.floor(areaW / 2);
  const pageWFromH = Math.floor(areaH  * (595 / 842));
  const pageHFromW = Math.floor(maxPageW * (842 / 595));

  let pageW: number, pageH: number;
  if (pageHFromW <= areaH) {
    pageW = maxPageW;    // width-constrained
    pageH = pageHFromW;
  } else {
    pageW = pageWFromH;  // height-constrained
    pageH = areaH;
  }

  return { width: Math.max(pageW, 200), height: Math.max(pageH, 300) };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const PdfFlipModal: FC<Props> = ({ url, title = "PDF", isOpen, onClose }) => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  /** 0-based index of the current left page, reported by onFlip */
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageDims, setPageDims] = useState(calcPageDims);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    if (isOpen) setPageDims(calcPageDims());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setCurrentPage(0);

    const task = pdfjsLib.getDocument({ url, ...PDF_JS_DOC_PARAMS });

    (async () => {
      try {
        const loaded = await task.promise;
        if (cancelled) return;
        setPdf(loaded);
        setNumPages(loaded.numPages);
      } catch (err) {
        if (!cancelled) {
          setLoadError("تعذر تحميل ملف PDF");
          console.error("PdfFlipModal: load PDF", err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      task.destroy();
      setPdf(null);
      setNumPages(0);
      setCurrentPage(0);
    };
  }, [isOpen, url]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  const flipAPI = () => bookRef.current?.pageFlip();

  // flipNext: right page folds LEFT → natural Arabic "open the book" gesture
  const goNext = useCallback(() => { flipAPI()?.flipNext(); }, []);
  // flipPrev: left page folds RIGHT → going back toward the cover
  const goPrev = useCallback(() => { flipAPI()?.flipPrev(); }, []);

  const canGoNext = currentPage < numPages - 2;
  const canGoPrev = currentPage > 0;

  // After scaleX(-1) mirror:
  //   visual RIGHT = LTR LEFT page = index currentPage     = PDF page currentPage + 1
  //   visual LEFT  = LTR RIGHT page = index currentPage + 1 = PDF page currentPage + 2
  const visualRightPage = currentPage + 1;                                        // lower → read first in Arabic
  const visualLeftPage  = currentPage + 2 <= numPages ? currentPage + 2 : null;  // higher → read second
  const pageLabel =
    visualLeftPage != null
      ? `${visualRightPage} - ${visualLeftPage}`
      : `${visualRightPage}`;

  if (!isOpen) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── RIGHT edge → "التالي" — arrow points right (into the book) ── */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        onMouseDown={(e) => e.stopPropagation()}
        disabled={!canGoNext}
        aria-label="الصفحة التالية"
        title="الصفحة التالية"
        className="fixed left-3 top-1/2 z-60 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/90 text-primary shadow-lg shadow-black/20 backdrop-blur-md transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-40 sm:left-6 sm:h-14 sm:w-14"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
      </button>

      {/* ── RIGHT edge → "السابق" — arrow points left (into the book) ── */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        onMouseDown={(e) => e.stopPropagation()}
        disabled={!canGoPrev}
        aria-label="الصفحة السابقة"
        title="الصفحة السابقة"
        className="fixed right-3 top-1/2 z-60 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/90 text-primary shadow-lg shadow-black/20 backdrop-blur-md transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-40 sm:right-6 sm:h-14 sm:w-14"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />        
      </button>

      {/* ── Modal card ── */}
      <div
        className="relative mx-auto flex h-[min(92vh,860px)] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-surface px-4 py-3 sm:px-5">
          <h3 className="line-clamp-1 text-sm font-extrabold text-primary sm:text-base">
            {title}
          </h3>
          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => transformRef.current?.zoomIn(0.4)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-primary/80 transition hover:bg-primary/5 hover:text-primary"
              aria-label="تكبير"
              title="تكبير"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => transformRef.current?.zoomOut(0.4)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-primary/80 transition hover:bg-primary/5 hover:text-primary"
              aria-label="تصغير"
              title="تصغير"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => { transformRef.current?.resetTransform(); setZoomScale(1); }}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-primary/80 transition hover:bg-primary/5 hover:text-primary"
              aria-label="إعادة ضبط التكبير"
              title="إعادة ضبط"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
            </button>
            <span className="min-w-12 text-center text-xs font-semibold text-body">
              {Math.round(zoomScale * 100)}%
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-primary/80 transition hover:bg-primary/5 hover:text-primary"
            aria-label="إغلاق"
            title="إغلاق"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Book area */}
        {isLoading ? (
          <div className="flex grow items-center justify-center gap-2 px-5 text-sm font-semibold text-body">
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
            جاري التحميل...
          </div>
        ) : loadError ? (
          <div className="flex grow items-center justify-center px-5 text-sm font-semibold text-red-600">
            {loadError}
          </div>
        ) : (
          <div
            className="relative grow overflow-hidden bg-neutral-300"
            style={{ cursor: zoomScale > 1 ? "grab" : "default" }}
          >
            {pdf && numPages > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
              <TransformWrapper
                key={`${pageDims.width}x${pageDims.height}`}
                ref={transformRef}
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                wheel={{ step: 0.08 }}
                pinch={{ step: 5 }}
                doubleClick={{ disabled: false, step: 0.7 }}
                panning={{ disabled: zoomScale <= 1, velocityDisabled: false }}
                limitToBounds={false}
                onTransform={(_: ReactZoomPanPinchContentRef, state: { scale: number; positionX: number; positionY: number }) => setZoomScale(state.scale)}
              >
                <TransformComponent
                  wrapperStyle={{ overflow: "visible" }}
                  contentStyle={{}}
                >
                  {/* scaleX(-1) mirrors the book so Arabic pages appear on the correct sides:
                      lower-numbered page → visual RIGHT, higher-numbered → visual LEFT.
                      Each PageSlot applies a counter-mirror so the canvas text stays readable. */}
                  <div style={{ transform: "scaleX(-1)" }}>
                    <HTMLFlipBook
                      ref={bookRef}
                      width={pageDims.width}
                      height={pageDims.height}
                      startPage={0}
                      size="fixed"
                      minWidth={200}
                      maxWidth={600}
                      minHeight={300}
                      maxHeight={820}
                      drawShadow={true}
                      flippingTime={700}
                      usePortrait={false}
                      startZIndex={0}
                      autoSize={false}
                      maxShadowOpacity={0.65}
                      showCover={false}
                      mobileScrollSupport={false}
                      clickEventForward={false}
                      useMouseEvents={zoomScale <= 1}
                      swipeDistance={30}
                      showPageCorners={true}
                      disableFlipByClick={zoomScale > 1}
                      className=""
                      style={{}}
                      onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                    >
                      {Array.from({ length: numPages }, (_, i) => (
                        <PageSlot
                          key={i + 1}
                          pageNum={i + 1}
                          pdf={pdf}
                          pageWidth={pageDims.width}
                          pageHeight={pageDims.height}
                          currentPage={currentPage}
                        />
                      ))}
                    </HTMLFlipBook>
                  </div>
                </TransformComponent>
              </TransformWrapper>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 border-t border-border/70 bg-white px-4 py-3 sm:px-5"
          dir="rtl"
        >
          {/* RTL: "التالي" is on the right in the footer (dir=rtl, it renders first) */}          
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="الصفحة السابقة"
            title="الصفحة السابقة"
            className="inline-flex min-w-24 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
            السابق
          </button>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-body">
            صفحة {pageLabel}
            {numPages ? ` من ${numPages}` : ""}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="الصفحة التالية"
            title="الصفحة التالية"
            className="inline-flex min-w-24 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            التالي
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return modalContent;
  return createPortal(modalContent, document.body);
};

export default PdfFlipModal;

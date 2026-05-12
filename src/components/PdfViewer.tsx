import type { ReactNode } from "react";
import type { LoadError } from "@react-pdf-viewer/core";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FileText, Download, BookOpen } from "lucide-react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import { PDF_JS_DOC_PARAMS } from "@/config/pdf";

export type PdfViewerProps = {
  src: string;
  documentTitle?: string;
  description?: ReactNode;
  height?: string;
  pages?: number;
};

function PdfErrorView() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 py-20 text-center" dir="rtl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-border/50 text-body/40">
        <FileText className="h-8 w-8" strokeWidth={1.1} aria-hidden />
      </div>
      <p className="text-sm font-medium text-body/60">لا يوجد ملف</p>
    </div>
  );
}

export default function PdfViewer({
  src,
  documentTitle = "مستند PDF",
  description,
  height = "calc(100dvh - 50px)",
  pages,
}: PdfViewerProps) {
  const defaultLayout = defaultLayoutPlugin();

  const renderError = (_error: LoadError) => {
    void _error;
    return <PdfErrorView />;
  };

  return (
    <div className="flex flex-col gap-5">
      {description && (
        <div className="space-y-4 text-justify text-sm leading-8 text-body sm:text-[15px] sm:leading-8">
          {description}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.10)]">

        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-linear-to-r from-[#f8fafc] to-[#f1f5fb] px-5 py-3.5" dir="rtl">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-border/80">
              <BookOpen className="h-4.5 w-4.5 text-secondary" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-primary leading-tight">{documentTitle}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-body">
                <span className="rounded bg-secondary/10 px-1.5 py-px font-semibold text-secondary">PDF</span>
                {pages && <span className="tabular-nums">{pages} صفحة</span>}
              </div>
            </div>
          </div>

          <a
            href={src}
            download
            title={`تنزيل ${documentTitle}`}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-primary shadow-sm transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            تنزيل
          </a>
        </div>

        {/* Viewer */}
        <div style={{ height }} className="w-full" dir="ltr">
          <Worker workerUrl={workerUrl}>
            <Viewer
              fileUrl={src}
              plugins={[defaultLayout]}
              renderError={renderError}
              transformGetDocumentParams={(params) => ({
                ...params,
                ...PDF_JS_DOC_PARAMS,
              })}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, Link2, Info } from "lucide-react";
import { useState } from "react";
import PdfFlipModal from "./PdfFlipModal";
import {
  publicationCategories,
  publicationsUiText,
  type PublicationDoc,
} from "@/data/publicationsData";

type Props = {
  doc: PublicationDoc;
  basePath: string;
};

export default function PublicationCard({ doc, basePath }: Props) {
  const navigate = useNavigate();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const catLabel = doc.category_name ?? publicationCategories.find((c) => c.id === doc.category)?.label ?? "";

  const handleClick = () => {
    if (doc.type === "link") {
      window.open(doc.url, "_blank", "noreferrer");
      return;
    }

    if (doc.type === "pdf") {
      setIsPdfOpen(true);
      return;
    }

    navigate(`${basePath}/publications/${doc.id}`, { state: { doc } });
  };

  const authorLine = doc.author || doc.publisher || doc.edition || doc.year || doc.language || "";

  return (
    <div
      role="article"
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      tabIndex={0}
      className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      aria-label={`${publicationsUiText.viewPublicationAriaPrefix}: ${doc.title}`}
    >
      <div className="relative mx-2 mt-3 overflow-hidden rounded-xl ring-1 ring-black/6 sm:mx-3 sm:mt-4">
        <div className="aspect-3/4 overflow-hidden">
          {doc.cover && !coverError ? (
            <img
              src={doc.cover}
              alt={doc.title}
              loading="lazy"
              decoding="async"
              onError={() => setCoverError(true)}
              className="size-full object-cover transition duration-500 ease-out"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-surface to-surface/70 px-4 text-center">
              <div className="space-y-2">
                <BookOpen className="mx-auto h-10 w-10 text-primary/30" aria-hidden />
                <p className="text-sm font-semibold text-primary/50">لا توجد صورة غلاف</p>
              </div>
            </div>
          )}
        </div>        
        <div className="absolute top-2 right-2 rounded-md bg-secondary-dark/90 px-2 py-1 text-[10px] font-bold text-white">
          {catLabel}
        </div>
      </div>

      <div className="flex flex-none flex-col gap-2 px-3 pb-3.5 pt-2.5 text-right sm:px-4 sm:pb-4 sm:pt-3" dir="rtl">
        <p className="line-clamp-2 text-sm font-extrabold leading-5 text-primary">{doc.title}</p>

        {authorLine ? (
          <p className="line-clamp-1 text-xs font-semibold text-body">{authorLine}</p>
        ) : null}

        {/* Footer actions */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {doc.audio ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(doc.audio!, "_blank", "noreferrer");
                }}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-primary/80 transition hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                aria-label="صوت"
                title="صوت"
              >
                <Headphones className="h-4 w-4" aria-hidden />
              </button>
            ) : null}

            {doc.type === "pdf" ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPdfOpen(true);
                  }}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-primary/80 transition hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  aria-label="عرض PDF"
                  title="عرض PDF"
                >
                  <BookOpen className="h-4 w-4" aria-hidden />
                </button>
                <PdfFlipModal
                  url={doc.url}
                  title={doc.title}
                  isOpen={isPdfOpen}
                  onClose={() => setIsPdfOpen(false)}
                />
              </>
            ) : null}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`${basePath}/publications/${doc.id}`, { state: { doc } });
              }}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-primary/80 transition hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              aria-label="عرض التفاصيل"
              title="عرض التفاصيل"
            >
              <Info className="h-4 w-4" aria-hidden />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(doc.url, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-primary/80 transition hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              aria-label="فتح PDF في المتصفح"
              title="فتح PDF في المتصفح"
            >
              <Link2 className="h-4 w-4" aria-hidden />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}


import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Bot, ChevronDown, CheckCircle2, Download, FileText, MessageSquare, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import PageHeader from "@/components/PageHeader";
import PublicationChatModal, {
  type ChatMessage,
} from "@/components/PublicationChatModal";
import PdfFlipModal from "@/components/PdfFlipModal";
import { useLocale } from "@/hooks/useLocale";
import { publicationsUiText } from "@/data/publicationsData";
import { fetchPublications } from "@/services/publicationsApi";
import { API_BASE_URL } from "@/config/api";
import type { PublicationDoc } from "@/types/page.d.ts";

const DEFAULT_CHAT_MESSAGE: ChatMessage = {
  role: "assistant",
  text: "مرحبًا، يمكنك سؤالي عن هذا الإصدار أو طلب تلخيصه.",
};

export default function PublicationView() {
  const { id } = useParams<{ id: string }>();
  const { basePath } = useLocale();
  const location = useLocation();

  const stateDoc =
    (location.state as { doc?: PublicationDoc } | null)?.doc ?? null;

  const [publications, setPublications] = useState<PublicationDoc[]>(
    stateDoc ? [stateDoc] : [],
  );

  const [isFetching, setIsFetching] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_CHAT_MESSAGE]);

  const qrDownloadRef = useRef<HTMLDivElement | null>(null);

  const loadChatHistory = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return [];

      const response = await fetch(`${API_BASE_URL}/api/publications/${id}/chat-history/`, {
        headers: { Accept: "application/json" },
        signal,
      });

      if (!response.ok) return [];

      const data = (await response.json()) as ChatLog[];
      return data.slice().reverse();
    },
    [id],
  );

  const syncChatHistory = useCallback(
    async (options?: { signal?: AbortSignal; syncMessages?: boolean }) => {
      const logs = await loadChatHistory(options?.signal);
      setChatLogs(logs);
      setLogsPage(1);
      setOpenLogId(null);

      if (options?.syncMessages) {
        const historical: ChatMessage[] = logs.flatMap((log) => [
          { role: "user" as const, text: log.question },
          { role: "assistant" as const, text: log.answer },
        ]);

        setMessages(
          historical.length > 0
            ? [DEFAULT_CHAT_MESSAGE, ...historical]
            : [DEFAULT_CHAT_MESSAGE],
        );
      }

      return logs;
    },
    [loadChatHistory],
  );

  // Load chat history from DB whenever the chat panel opens
  useEffect(() => {
    if (!isChatOpen || !id) return;

    const controller = new AbortController();
    setIsHistoryLoading(true);

    void syncChatHistory({ signal: controller.signal, syncMessages: true })
      .catch(() => {/* ignore abort/network errors */})
      .finally(() => setIsHistoryLoading(false));

    return () => controller.abort();
  }, [isChatOpen, id, syncChatHistory]);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const loadPublications = async () => {
      setIsFetching(true);
      setLoadError(null);

      try {
        const items = await fetchPublications(controller.signal);
        if (!alive) return;
        setPublications(items);
      } catch (error) {
        if (
          !alive ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "تعذر تحميل تفاصيل الإصدار",
        );
      } finally {
        if (alive) setIsFetching(false);
      }
    };

    void loadPublications();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  const doc = useMemo(
    () => publications.find((item) => String(item.id) === id) ?? stateDoc,
    [id, publications, stateDoc],
  );

  const showLoading = isFetching && !doc;
  const canonical = doc ? `${basePath}/publications/${doc.id}` : "";

  const pageShareUrl = (() => {
    try {
      return canonical
        ? new URL(canonical, window.location.origin).toString()
        : "";
    } catch {
      return canonical;
    }
  })();

  const pdfUrl = doc?.url?.trim() ?? "";

  // Extraction state — loaded directly from book_publicationtextextraction by book_id
  const [isExtracted, setIsExtracted] = useState(false);
  const [extractionSummary, setExtractionSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!doc?.id) return;

    const controller = new AbortController();

    fetch(`${API_BASE_URL}/api/publications/${doc.id}/summary/`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { has_text_extraction?: boolean; summary?: string | null } | null) => {
        if (!data) return;
        setIsExtracted(Boolean(data.has_text_extraction));
        setExtractionSummary(data.summary ?? null);
      })
      .catch(() => {/* silently ignore abort / network errors */});

    return () => controller.abort();
  }, [doc?.id]);

  const extractionStatusLabel = isExtracted ? "تم الاستخراج" : "لم يتم الاستخراج بعد";

  type ChatLog = { id: number; question: string; answer: string; asked_at: string };
  const LOGS_PER_PAGE = 5;
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [openLogId, setOpenLogId] = useState<number | null>(null);
  const [logsPage, setLogsPage] = useState(1);

  useEffect(() => {
    if (!doc?.id) return;
    const controller = new AbortController();
    setLogsLoading(true);
    void syncChatHistory({ signal: controller.signal })
      .catch(() => {})
      .finally(() => setLogsLoading(false));
    return () => controller.abort();
  }, [doc?.id, syncChatHistory]);

  const logsTotalPages = Math.max(1, Math.ceil(chatLogs.length / LOGS_PER_PAGE));
  const logsPageItems = chatLogs.slice(
    (logsPage - 1) * LOGS_PER_PAGE,
    logsPage * LOGS_PER_PAGE,
  );

  const handleDownloadQr = () => {
    if (!pageShareUrl || typeof window === "undefined") return;

    const svg = qrDownloadRef.current?.querySelector("svg");
    if (!svg) return;

    const svgText = new XMLSerializer().serializeToString(svg);

    const svgPayload = svgText.includes('xmlns="http://www.w3.org/2000/svg"')
      ? svgText
      : svgText.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svgPayload,
    )}`;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `publication-${doc?.id ?? "qr"}.svg`;
    link.rel = "noopener";

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleAskPdf = async () => {
    const question = chatInput.trim();
    if (!question || !doc) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setChatInput("");
    setIsAsking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/publications/${doc.id}/ask/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to ask PDF");
      }

      const data: { answer?: string } = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer ?? "لم أتمكن من إنشاء إجابة.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "حدث خطأ أثناء معالجة السؤال.",
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    void syncChatHistory().catch(() => {});
  };

  if (showLoading) {
    return (
      <main
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
        dir="rtl"
      >
        <p className="text-xl font-extrabold text-primary">
          جارٍ تحميل الإصدار...
        </p>
        <p className="text-sm text-body">يرجى الانتظار قليلًا</p>
      </main>
    );
  }

  if (!doc) {
    return (
      <main
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
        dir="rtl"
      >
        <p className="text-xl font-extrabold text-primary">
          {loadError ? "تعذر تحميل الإصدار" : "الإصدار غير موجود"}
        </p>
        <p className="text-sm text-body">
          {loadError ?? "لم يتم العثور على هذا الإصدار"}
        </p>
      </main>
    );
  }

  const detailRows: { label: string; value: string }[] = [
    ...(doc.date ? [{ label: "التاريخ", value: doc.date }] : []),
    ...(doc.pages ? [{ label: "الصفحات", value: `${doc.pages} ${publicationsUiText.pagesSuffix}` }] : []),
    ...(doc.author ? [{ label: "المؤلف", value: doc.author }] : []),
    ...(doc.publisher ? [{ label: "الناشر", value: doc.publisher }] : []),
    ...(doc.edition ? [{ label: "الطبعة", value: doc.edition }] : []),
    ...(doc.year ? [{ label: "السنة", value: doc.year }] : []),
    ...(doc.language ? [{ label: "اللغة", value: doc.language }] : []),
    ...(doc.isbn ? [{ label: "ISBN", value: doc.isbn }] : []),
  ];

  return (
    <>
      <main
        className="relative overflow-clip bg-linear-to-b from-white to-[#f4f6f9] py-10 pb-24"
        dir="rtl"
      >
        <div
          className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-layout px-4 sm:px-6 lg:px-8">
          <PageHeader
            title={doc.title}
            className="mb-6"
            status={
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                  isExtracted
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
                title={extractionStatusLabel}
                aria-label={extractionStatusLabel}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {extractionStatusLabel}
              </span>
            }
            actions={
              <>
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border/70 bg-white px-4 py-3 text-sm font-bold text-primary shadow-soft transition hover:bg-primary/5"
                  aria-label="عرض رمز QR"
                  title="عرض رمز QR"
                >
                  <QrCode className="h-6 w-6 text-secondary" aria-hidden />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPdfOpen(true)}
                  disabled={!pdfUrl}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border/70 bg-white px-4 py-3 text-sm font-bold text-primary shadow-soft transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="فتح قارئ PDF"
                  title="فتح قارئ PDF"
                >
                  <FileText className="h-6 w-6" aria-hidden />
                </button>

                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  disabled={!pdfUrl}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border/70 bg-white px-4 py-3 text-sm font-bold text-primary shadow-soft transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="اسأل عن الإصدار"
                  title="اسأل عن الإصدار"
                >
                  <Bot className="h-6 w-6 text-secondary" aria-hidden />
                </button>
              </>
            }
          />

          {detailRows.length > 0 ? (
            <div className="mt-6 mb-6 rounded-3xl border border-border/70 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <img
                  src={doc.cover}
                  alt={doc.title}
                  className="h-56 w-40 shrink-0 rounded-2xl object-cover ring-1 ring-black/5"
                  loading="lazy"
                  decoding="async"
                />

                <div className="min-w-0 flex-1">
                  {detailRows.length > 0 ? (
                    <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {detailRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-baseline justify-between gap-3 rounded-2xl bg-surface/70 px-4 py-3"
                        >
                          <dt className="shrink-0 text-xs font-semibold text-body/70">{row.label}</dt>
                          <dd className="min-w-0 truncate text-right text-sm font-bold text-body">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                </div>
              </div>
            </div>
          ) : null}

          {/* Summary card — shown only when extraction exists */}
          {isExtracted && extractionSummary ? (
            <div className="rounded-3xl border border-border/70 bg-white p-6 shadow-soft sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
                <h2 className="text-base font-extrabold text-primary">ملخص الإصدار</h2>
              </div>
              <p
                className="text-base font-medium leading-loose text-body text-justify"
                dir="rtl"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {extractionSummary}
              </p>
            </div>
          ) : null}

          {/* Chat history accordion */}
          <div className="mt-6 rounded-3xl border border-border/70 bg-white shadow-soft">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-border/60 px-6 py-5">
              <MessageSquare className="h-5 w-5 shrink-0 text-secondary" aria-hidden />
              <h2 className="text-base font-extrabold text-primary">سجل المحادثات</h2>
              {!logsLoading && chatLogs.length > 0 && (
                <span className="mr-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary">
                  {chatLogs.length}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {logsLoading ? (
                <div className="flex items-center justify-center gap-3 py-8">
                  <svg className="h-5 w-5 animate-spin text-primary/40" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span className="text-sm text-body">جارٍ تحميل السجل...</span>
                </div>
              ) : chatLogs.length === 0 ? (
                <p className="py-8 text-center text-sm text-body/60">لا توجد محادثات مسجّلة بعد</p>
              ) : (
                <>
                  <ul className="divide-y divide-border/50">
                    {logsPageItems.map((log) => {
                      const isOpen = openLogId === log.id;
                      return (
                        <li key={log.id}>
                          <button
                            type="button"
                            onClick={() => setOpenLogId(isOpen ? null : log.id)}
                            className="flex w-full cursor-pointer items-start justify-between gap-4 py-4 text-right transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                            aria-expanded={isOpen}
                          >
                            <span className="min-w-0 flex-1 text-sm font-bold text-primary leading-relaxed">
                              {log.question}
                            </span>
                            <span className="flex shrink-0 items-center gap-2 text-xs text-body/50">
                              {new Date(log.asked_at).toLocaleDateString("en", {
                                year: "numeric", month: "short", day: "numeric",
                              })}
                              <ChevronDown
                                className={`h-4 w-4 text-body/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                aria-hidden
                              />
                            </span>
                          </button>

                          {isOpen && (
                            <div
                              className="pb-4 pr-4 text-sm leading-7 text-body"
                              dir="rtl"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {log.answer}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {/* Pagination */}
                  {logsTotalPages > 1 && (
                    <div className="mt-5 flex items-center justify-center gap-1" dir="ltr">
                      <button
                        type="button"
                        onClick={() => { setLogsPage((p) => Math.max(1, p - 1)); setOpenLogId(null); }}
                        disabled={logsPage === 1}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border text-xs font-bold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ‹
                      </button>

                      {Array.from({ length: logsTotalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => { setLogsPage(p); setOpenLogId(null); }}
                          className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-xs font-bold transition ${
                            p === logsPage
                              ? "border-primary bg-primary text-white"
                              : "border-border text-primary hover:bg-primary/5"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => { setLogsPage((p) => Math.min(logsTotalPages, p + 1)); setOpenLogId(null); }}
                        disabled={logsPage === logsTotalPages}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border text-xs font-bold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {isQrOpen ? (
        <div className="fixed inset-0 z-50" dir="rtl" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="إغلاق نافذة QR"
            onClick={() => setIsQrOpen(false)}
          />

          <aside className="absolute inset-y-0 right-0 z-10 w-full max-w-2xl overflow-hidden bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
              <h3 className="text-base font-extrabold text-primary">
                {publicationsUiText.qrAsideTitle}
              </h3>

              <button
                type="button"
                onClick={() => setIsQrOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-primary transition hover:bg-primary/5"
                aria-label="إغلاق"
                title="إغلاق"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="h-full overflow-y-auto p-5 sm:p-6">
              <div className="rounded-3xl border border-border/70 bg-white p-5 shadow-soft sm:p-6">
                <p className="text-center text-sm leading-relaxed text-body">
                  {publicationsUiText.qrShareScanHint}
                </p>

                <div
                  ref={qrDownloadRef}
                  className="mt-5 flex items-center justify-center rounded-3xl bg-surface p-6"
                >
                  <QRCodeSVG
                    value={pageShareUrl}
                    size={320}
                    className="h-80 w-80"
                  />
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary/90"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    تنزيل
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {isChatOpen ? (
        <PublicationChatModal
          title={doc.title}
          messages={messages}
          chatInput={chatInput}
          isAsking={isAsking}
          isHistoryLoading={isHistoryLoading}
          onClose={handleCloseChat}
          onChatInputChange={setChatInput}
          onAsk={() => void handleAskPdf()}
          onClear={() =>
            setMessages([DEFAULT_CHAT_MESSAGE])
          }
          onPresetPrompt={setChatInput}
        />
      ) : null}

      {isPdfOpen ? (
        <PdfFlipModal
          url={pdfUrl}
          title={doc.title}
          isOpen={isPdfOpen}
          onClose={() => setIsPdfOpen(false)}
        />
      ) : null}
    </>
  );
}
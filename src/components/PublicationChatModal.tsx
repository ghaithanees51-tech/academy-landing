import { Send, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type PublicationChatModalProps = {
  title: string;
  messages: ChatMessage[];
  chatInput: string;
  isAsking: boolean;
  isHistoryLoading?: boolean;
  onClose: () => void;
  onClear: () => void;
  onChatInputChange: (value: string) => void;
  onAsk: () => void;
  onPresetPrompt: (prompt: string) => void;
};

export default function PublicationChatModal({
  title,
  messages,
  chatInput,
  isAsking,
  isHistoryLoading = false,
  onClose,
  onClear,
  onChatInputChange,
  onAsk,
  onPresetPrompt,
}: PublicationChatModalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAsking]);

  return (
    <div className="fixed inset-0 z-50" dir="rtl" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 cursor-pointer"
        aria-label="إغلاق نافذة المحادثة"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 z-10 flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
          <div>
            <h3 className="text-base font-extrabold text-primary">اسأل عن الإصدار</h3>
            <p className="mt-1 text-xs text-body">{title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              disabled={messages.length <= 1 || isAsking}
              className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-body transition hover:bg-red-50 hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="مسح المحادثة"
              title="مسح المحادثة"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-primary transition hover:bg-primary/5"
              aria-label="إغلاق"
              title="إغلاق"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-surface p-5">
          {isHistoryLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <svg
                className="h-7 w-7 animate-spin text-primary/40"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-xs text-body">جارٍ تحميل المحادثات السابقة...</p>
            </div>
          ) : null}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "border border-border/70 bg-white text-body"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isAsking ? (
              <div className="flex justify-end">
                <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border/70 bg-white px-4 py-3 shadow-soft">
                  <span className="flex gap-1" aria-label="جارٍ إنشاء الإجابة">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:300ms]" />
                  </span>
                  <span className="text-xs text-body">جارٍ إنشاء الإجابة...</span>
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-border/70 bg-white p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(event) => onChatInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void onAsk();
                }
              }}
              placeholder="اكتب: لخص هذا الإصدار"
              className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
            />

            <button
              type="button"
              onClick={() => void onAsk()}
              disabled={!chatInput.trim() || isAsking}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAsking ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <Send className="h-4 w-4" aria-hidden />
              )}
              {isAsking ? "جارٍ..." : "إرسال"}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "تلخيص",           prompt: "لخص هذا الإصدار بشكل مبسط" },
              { label: "أهم النقاط",      prompt: "ما هي أهم النقاط في هذا الإصدار؟" },
              { label: "شرح مبسط",        prompt: "اشرح هذا الإصدار بطريقة سهلة للطلاب" },
              { label: "الأهداف",         prompt: "ما هي الأهداف الرئيسية لهذا الإصدار؟" },
              { label: "التوصيات",        prompt: "ما هي أبرز التوصيات الواردة في هذا الإصدار؟" },
              { label: "المفاهيم الأساسية", prompt: "ما هي المفاهيم الأساسية التي يتناولها هذا الإصدار؟" },
              { label: "الفئة المستهدفة", prompt: "من هي الفئة المستهدفة من هذا الإصدار؟" },
              { label: "الخاتمة",         prompt: "ما هي أبرز نقاط خاتمة هذا الإصدار؟" },
            ].map(({ label, prompt }) => (
              <button
                key={label}
                type="button"
                onClick={() => onPresetPrompt(prompt)}
                className="cursor-pointer rounded-full border border-border/70 bg-white px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/5"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

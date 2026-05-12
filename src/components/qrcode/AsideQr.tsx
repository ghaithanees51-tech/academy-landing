import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type AsideQrProps = { url: string; title: string; hint: string };

export function AsideQr({ url, title, hint }: AsideQrProps) {
  if (!url) return null;
  return (
    <div className="flex w-full shrink-0 bg-linear-to-bl from-primary/7 to-secondary/6 px-6 py-6 md:w-64 md:px-4">
      <div className="hidden w-full md:block">
        <div className="rounded-2xl border border-border/80 bg-white/80 p-3 shadow-soft">
          <p className="flex items-center justify-center gap-1.5 text-center text-xs font-bold text-primary">
            <QrCode className="h-3.5 w-3.5 text-secondary" aria-hidden />
            {title}
          </p>
          <div className="mt-2 flex items-center justify-center rounded-xl bg-surface p-2">
            <QRCodeSVG value={url} size={112} className="h-28 w-28" />
          </div>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-body">
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}

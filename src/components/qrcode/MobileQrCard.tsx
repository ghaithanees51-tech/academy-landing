import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type MobileQrCardProps = { url: string; title: string; scanHint: string };

export function MobileQrCard({ url, title, scanHint }: MobileQrCardProps) {
  if (!url) return null;
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white px-4 py-4 shadow-soft" dir="rtl">
      <div className="min-w-0 text-right">
        <p className="flex items-center gap-1.5 text-sm font-extrabold text-primary">
          <QrCode className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-body">
          {scanHint}
        </p>
      </div>
      <div className="shrink-0 rounded-xl border border-border/80 bg-surface p-2">
        <QRCodeSVG value={url} size={80} className="h-20 w-20" />
      </div>
    </div>
  );
}

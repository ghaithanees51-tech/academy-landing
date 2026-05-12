import Spinner from "@/components/Spinner";

export default function TabPanelSpinnerOverlay({
  show,
  className = "",
}: {
  show: boolean;
  className?: string;
}) {
  if (!show) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 grid place-items-center bg-white/60 backdrop-blur-[1px] ${className}`}
      aria-hidden
    >
      <Spinner size="md" />
    </div>
  );
}


import { Link } from "react-router-dom";
import { notFoundUiText } from "@/data/commonData";

export default function NotFound() {
  return (
    <>
      <main className="relative overflow-clip bg-linear-to-b from-white to-[#f4f6f9] py-10 pb-24" dir="rtl">
        <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" aria-hidden />

        <h1 className="mb-4 text-5xl font-bold text-primary md:text-6xl">{notFoundUiText.heading}</h1>
        <p className="mb-6 text-base text-body md:text-lg">{notFoundUiText.subtitle}</p>
        <Link
          to="/"
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90"
        >
          {notFoundUiText.goHomeLabel}
        </Link>
      </main>     
    </>
  );
}
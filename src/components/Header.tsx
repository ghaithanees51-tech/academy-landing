import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import { getSiteLogoAlt } from "@/config/site";
import { imageAsset } from "@/utils/assets";

interface HeaderProps {
  variant?: "hero" | "internal";
}

const Header = ({ variant = "hero" }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const isHero = variant === "hero";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full text-white" dir="rtl">
      <div
        className={`border-b shadow-soft transition-all duration-300 ${
          isHero && !scrolled
            ? "border-white/10 bg-primary/95 backdrop-blur-xl"
            : "border-white/10 bg-primary backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto grid max-w-layout grid-cols-[auto_1fr] items-stretch px-3 sm:px-6 lg:px-8">
          <div className="flex items-center border-l border-white/10 py-2 pl-4 sm:pl-6 xl:pl-8">
            <NavLink to="/" aria-label={getSiteLogoAlt()} className="block">
              <img
                src={imageAsset("/images/logo-dark.png")}
                alt={getSiteLogoAlt()}
                className={`w-auto object-contain transition-all duration-300 ${
                  scrolled ? "h-21 sm:h-23 xl:h-25" : "h-21 sm:h-23 xl:h-25"
                }`}
              />
            </NavLink>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            {/* Website Title & QR Code */}
            <div className={`flex items-center justify-between px-4 transition-all duration-300 ${scrolled ? "py-2.5 xl:py-3" : "py-2.5 xl:py-3"}`}>
              <div className="flex min-w-0 flex-col items-start">
                <h1 className="text-base font-bold text-white sm:text-lg xl:text-xl">إصدارات ومطبوعات</h1>
                <NavLink
                  to="/"
                  className="mt-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/15"
                >
                  تصفح جميع الكتب
                </NavLink>
              </div>
              {/* QR Code */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden rounded-lg border border-white/20 bg-white/10 p-2 sm:block">
                  <QRCodeSVG value={typeof window !== "undefined" ? window.location.href : ""} size={48} className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
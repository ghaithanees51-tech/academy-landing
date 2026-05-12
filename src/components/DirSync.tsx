import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function DirSync({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const isEn = pathname.startsWith("/en");
    document.documentElement.dir = isEn ? "ltr" : "rtl";
    document.documentElement.lang = isEn ? "en" : "ar";
  }, [pathname]);

  return <>{children}</>;
}

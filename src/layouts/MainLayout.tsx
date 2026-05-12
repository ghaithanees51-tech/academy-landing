import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


function headerVariantForPath(pathname: string): "hero" | "internal" {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/" || normalized === "/en") return "hero";
  return "internal";
}

export default function MainLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant={headerVariantForPath(pathname)} />
      <div className="flex flex-1 flex-col max-md:pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
        <Footer />
      </div>

    </div>
  );
}

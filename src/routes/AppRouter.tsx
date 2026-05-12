import ScrollToTop from "@/components/ScrollToTop";
import PageSkeleton from "@/components/skeleton/PageSkeleton";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import PublicationView from "@/pages/PublicationView";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
export default function AppRouter() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
			{/* RTL base routes (default) */}
			<Route path="/" element={<Home />} />
			<Route path="/publications/:id" element={<PublicationView />} />

			{/* English LTR routes */}
			<Route path="/en" element={<Home />} />
			<Route path="/en/publications/:id" element={<PublicationView />} />
			<Route path="/404" element={<NotFound />} />
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

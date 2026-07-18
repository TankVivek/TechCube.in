import React, { useEffect, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/global.css";
import "./index.css";
import SEOHead from "./components/SEOHead";
// Import components with lazy loading
const Header = lazy(() => import("./pages/header"));
const Hero = lazy(() => import("./pages/hero"));
const Services = lazy(() => import("./pages/services"));
const AISolutions = lazy(() => import("./pages/aISolutions"));
const Contact = lazy(() => import("./pages/contact"));
const Footer = lazy(() => import("./pages/footer"));
import RobotsTxt from "./pages/RobotsTxt";
import SupportWidget from "./components/SupportWidget";
const SupportAdmin = lazy(() => import("./pages/SupportAdmin"));
const SupportTicket = lazy(() => import("./pages/SupportTicket"));
const VideoCall = lazy(() => import("./pages/VideoCall"));
const SoftwareCompanyMumbai = lazy(() => import("./pages/SoftwareCompanyMumbai"));

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-950 z-[100]">
    <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const PageWrapper = ({ children }) => (
  <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
    {children}
  </div>
);

const HomePage = () => {
  return (
    <PageWrapper>
      <SEOHead />
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <main>
          <Hero />
          <Services />
          <AISolutions />
          <Contact />
        </main>
        <Footer />
      </Suspense>
      <SupportWidget />
    </PageWrapper>
  );
};

const App = () => (
  <ThemeProvider>
    <Router>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/index.php" element={<Navigate to="/" replace />} />
          <Route path="/robots" element={<RobotsTxt />} />
          <Route path="/software-company-in-mumbai" element={<Suspense fallback={<LoadingSpinner />}><SoftwareCompanyMumbai /></Suspense>} />
          <Route path="/support-admin" element={<Suspense fallback={<LoadingSpinner />}><SupportAdmin /></Suspense>} />
          <Route path="/support-ticket" element={<Suspense fallback={<LoadingSpinner />}><SupportTicket /></Suspense>} />
          <Route path="/video-call/:roomId" element={<Suspense fallback={<LoadingSpinner />}><VideoCall /></Suspense>} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </HelmetProvider>
    </Router>
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

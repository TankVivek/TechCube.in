
import React, { useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';
import './index.css';
import SEOHead from './components/SEOHead';
// Import components with lazy loading
const Header = lazy(() => import('./pages/header'));
const Hero = lazy(() => import('./pages/hero'));
const Services = lazy(() => import('./pages/services'));
const AISolutions = lazy(() => import('./pages/aISolutions'));
const Contact = lazy(() => import('./pages/contact'));
const Footer = lazy(() => import('./pages/footer'));

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const PageWrapper = ({ children }) => (
  <div className="min-h-screen bg-white dark:bg-gray-900">
    <div className="container mx-auto px-4">{children}</div>
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
    </PageWrapper>
  );
};

const App = () => (
  <ThemeProvider>
    <Router>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </HelmetProvider>
    </Router>
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

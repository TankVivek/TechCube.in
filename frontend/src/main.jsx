import React, { useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import SEOHead from './components/SEOHead';

// Import components with lazy loading
const Header = lazy(() => import('./pages/header'));
const Hero = lazy(() => import('./pages/hero'));
const Services = lazy(() => import('./pages/services'));
const AISolutions = lazy(() => import('./pages/aISolutions'));
const Contact = lazy(() => import('./pages/contact'));
const Footer = lazy(() => import('./pages/footer'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="loader"></div>
  </div>
);

const PageWrapper = ({ children }) => (
  <div className="page-container">
    <div className="page-content">
      <div className="content-wrapper">{children}</div>
    </div>
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
  <Router>
    <HelmetProvider>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </HelmetProvider>
  </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
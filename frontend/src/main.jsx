import React, { useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import SEOHead from './components/SEOHead';

// Import components with lazy loading for better performance
const Header = lazy(() => import('./pages/header'));
const Hero = lazy(() => import('./pages/hero'));
const Services = lazy(() => import('./pages/services'));
const Expertise = lazy(() => import('./pages/expertise'));
const About = lazy(() => import('./pages/About'));
const AISolutions = lazy(() => import('./pages/aISolutions'));
const Industries = lazy(() => import('./pages/industries'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const BlogPreview = lazy(() => import('./pages/BlogPreview'));
const Contact = lazy(() => import('./pages/contact'));
const Footer = lazy(() => import('./pages/footer'));

// Page wrapper component
const PageWrapper = ({ children }) => (
  <div className="page-container">
    <div className="page-content">
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="loader"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// CSS styles - expanded with more performance optimizations
const styles = `
  /* Base styles */
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Animation classes */
  .service-card {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  }
  
  .gradient-bg {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    will-change: background-position;
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
    will-change: opacity, transform;
  }
  
  /* Image optimizations */
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Improved form inputs */
  .input-focus {
    transition: all 0.3s ease;
  }
  
  .input-focus:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  /* Accessibility improvements */
  :focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Print styles */
  @media print {
    header, footer, #contact {
      display: none;
    }
    body {
      font-size: 12pt;
    }
  }
  
  /* Mobile responsiveness - Tablets */
  @media (max-width: 1024px) {
    .container {
      width: 95%;
      padding: 0 15px;
    }
    
    h1 {
      font-size: 2.5rem;
    }
    
    h2 {
      font-size: 2rem;
    }
  }
  
  /* Mobile responsiveness - Mobile phones */
  @media (max-width: 768px) {
    html {
      scroll-padding-top: 4rem;
    }
    
    body {
      font-size: 16px;
    }
    
    h1 {
      font-size: 2rem;
      line-height: 1.2;
    }
    
    h2 {
      font-size: 1.75rem;
    }
    
    h3 {
      font-size: 1.4rem;
    }
    
    .container {
      width: 100%;
      padding: 0 20px;
    }
    
    /* Flex and grid adjustments */
    .flex-row {
      flex-direction: column;
    }
    
    .grid-cols-2, 
    .grid-cols-3, 
    .grid-cols-4 {
      grid-template-columns: 1fr;
    }
    
    /* Component spacing */
    section {
      padding: 40px 0;
    }
    
    /* Navigation adjustments */
    .nav-desktop {
      display: none;
    }
    
    .nav-mobile {
      display: block;
    }
    
    /* Button adjustments */
    .btn {
      padding: 10px 16px;
      font-size: 0.9rem;
    }
  }
  
  /* Small mobile devices */
  @media (max-width: 480px) {
    h1 {
      font-size: 1.75rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    h3 {
      font-size: 1.25rem;
    }
    
    p {
      font-size: 0.95rem;
    }
    
    .section-padding {
      padding: 30px 0;
    }
    
    .card, .service-card {
      padding: 15px;
    }
    
    /* Form elements */
    input, textarea, select {
      font-size: 16px; /* Prevents iOS zoom on focus */
      padding: 12px;
    }
  }

  /* Loader styles */
  .loader {
    border: 6px solid #e5e7eb;
    border-top: 6px solid #2563eb;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }
`;

const HomePage = () => {
  useEffect(() => {
    // Google Analytics setup
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: window.location.pathname,
      });
    }

    // Implement lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      // Fallback to Intersection Observer
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }, []);

  return (
    <PageWrapper>
      <SEOHead />
      <style>{styles}</style>
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
        <main>
          <Hero />
          <Services />
          {/* <Expertise /> */}
          {/* <About /> */}
          <AISolutions />
          {/* <Industries /> */}
          {/* <Testimonials /> */}
          {/* <BlogPreview /> */}
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
      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add other routes as needed for blog, etc. */}
        </Routes>
      </div>
    </HelmetProvider>
    </Router>
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
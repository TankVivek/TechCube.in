import React, { useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SEOHead from './components/SEOHead';

// Import components with lazy loading for better performance
const Header = lazy(() => import('./pages/header'));
const Hero = lazy(() => import('./pages/hero'));
const Services = lazy(() => import('./pages/services'));
const Expertise = lazy(() => import('./pages/expertise'));
const About = lazy(() => import('./pages/About'));
const AISolutions = lazy(() => import('./pages/AISolutions'));
const Industries = lazy(() => import('./pages/industries'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const BlogPreview = lazy(() => import('./pages/BlogPreview'));
const Contact = lazy(() => import('./pages/contact'));
const Footer = lazy(() => import('./pages/footer'));

// Loading component for Suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
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
    <>
      <SEOHead />
      <style>{styles}</style>
      <Suspense fallback={<Loading />}>
        <Header />
        <main>
          <Hero />
          <Services />
          <Expertise />
          <AISolutions />
          {/* <About /> */}
          {/* <Testimonials /> */}
          {/* <Industries /> */}
          {/* <BlogPreview /> */}
          <Contact />
        </main>
        <Footer />
      </Suspense>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add other routes as needed for blog, etc. */}
      </Routes>
    </Router>
  </HelmetProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
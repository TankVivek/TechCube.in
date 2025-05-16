import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import MainLayout from './layouts/MainLayout';
import { Loading } from './components';

// Lazy load pages with descriptive chunk names
const HomePage = lazy(() => import(/* webpackChunkName: "home" */ './pages/HomePage'));
const Services = lazy(() => import(/* webpackChunkName: "services" */ './pages/services'));
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ './pages/contact'));
// ...other imports

// Error Fallback Component
const ErrorFallback = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <HelmetProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<Loading />}>
                <HomePage />
              </Suspense>
            } />
            <Route path="/services" element={
              <Suspense fallback={<Loading />}>
                <Services />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<Loading />}>
                <Contact />
              </Suspense>
            } />
            {/* Add 404 route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </HelmetProvider>
  </ErrorBoundary>
);

// Performance monitoring
const reportWebVitals = ({ id, name, value }) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    window.gtag?.('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(value),
      non_interaction: true,
    });
  }
};

// Root rendering with strict mode
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize performance monitoring
reportWebVitals();
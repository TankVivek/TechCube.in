import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "TechCube - IT Solutions & Software Development Company",
  description = "TechCube delivers cutting-edge custom software development, web applications, mobile apps, and AI solutions for businesses across India.",
  canonicalUrl = "https://techcube.in",
  image = "https://techcube.in/images/og-image.jpg",
  type = "website"
}) => {
  // Structured data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechCube",
    "url": "https://techcube.in",
    "logo": "https://techcube.in/logo-small.png",
    "sameAs": [
      "https://facebook.com/techcube",
      "https://twitter.com/techcube",
      "https://linkedin.com/company/techcube",
      "https://instagram.com/techcube"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service",
      "email": "info@techcube.in"
    },
    "description": "TechCube is a leading IT solutions provider specializing in web development, mobile apps, AI solutions, and custom software development for businesses."
  };

  // Structured data for Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Software Development",
    "provider": {
      "@type": "Organization",
      "name": "TechCube"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "description": "Custom software development, web applications, mobile apps, and AI solutions for businesses.",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Keywords */}
      <meta
        name="keywords"
        content="software development, web development, mobile app development, AI solutions, machine learning, IT services, custom software, React.js, Node.js, Python development, full stack developer, cloud computing, AWS, DigitalOcean, web scraping, data extraction, API integration, DevOps, MongoDB, Express.js, RESTful APIs, responsive design, UI/UX, e-commerce solutions, microservices architecture, agile development, Scrum, offshore development, SaaS, PWA, containerization, Docker, Kubernetes, CI/CD, database management, PostgreSQL, MySQL, digital transformation, enterprise software, QA automation, performance optimization, cybersecurity, fintech solutions, real-time tracking"
      />
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
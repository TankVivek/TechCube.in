import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "TechCube - IT Solutions & Software Development Company",
  description = "TechCube (also known as tech cube or techcubes) delivers cutting-edge software development, web applications, mobile apps, and AI solutions for businesses across India.",
  canonicalUrl = "https://techcube.in",
  image = "https://techcube.in/images/og-image.jpg",
  type = "website"
}) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://techcube.in/#organization",
    "name": "TechCube",
    "url": "https://techcube.in",
    "logo": "https://techcube.in/logo-small.png",
    "image": "https://techcube.in/images/og-image.jpg",
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
      "telephone": "+91-9876543210",
      "contactType": "customer service",
      "email": "info@techcube.in"
    },
    "description": "TechCube is a leading IT solutions provider specializing in web development, mobile apps, AI solutions, and custom software development for businesses."
  };

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
      <html lang="en" />
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="author" content="TechCube" />
      <meta name="language" content="English" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#0a0a0a" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
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
        content="techcube, tech cube, techcubes, software development, web development, mobile app development, AI solutions, machine learning, IT services, custom software, React.js, Node.js, Python development, full stack developer, cloud computing, AWS, DigitalOcean, web scraping, data extraction, API integration, DevOps, MongoDB, Express.js, RESTful APIs, UI/UX, SaaS, PWA, Docker, Kubernetes, QA automation"
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

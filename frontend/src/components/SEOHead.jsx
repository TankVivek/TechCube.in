import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "TechCube | AI, Web & Mobile App Development Company India",
  description = "TechCube builds AI solutions, web applications, mobile apps, SaaS platforms, automation tools, and cloud software for startups and growing businesses.",
  canonicalUrl = "https://techcube.in/",
  image = "https://techcube.in/logo-square.png",
  type = "website"
}) => {
  const siteUrl = "https://techcube.in/";
  const logoUrl = "https://techcube.in/logo-square.png";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://techcube.in/#organization",
    "name": "TechCube",
    "alternateName": ["Tech Cube", "TechCube India"],
    "url": siteUrl,
    "logo": logoUrl,
    "image": logoUrl,
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": "contact@techcube.in",
      "availableLanguage": ["English", "Hindi"]
    },
    "description": description
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Custom Software Development Services",
    "serviceType": [
      "AI Development",
      "Web Application Development",
      "Mobile App Development",
      "SaaS Development",
      "Cloud Services",
      "Automation"
    ],
    "provider": {
      "@type": "Organization",
      "@id": "https://techcube.in/#organization",
      "name": "TechCube"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "description": description
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://techcube.in/#website",
    "name": "TechCube",
    "url": siteUrl,
    "publisher": {
      "@id": "https://techcube.in/#organization"
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
      <meta name="theme-color" content="#0f172a" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/png" href="/logo-square.png" />
      <link rel="apple-touch-icon" href="/logo-square.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="TechCube logo" />
      <meta property="og:site_name" content="TechCube" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="TechCube logo" />

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
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;

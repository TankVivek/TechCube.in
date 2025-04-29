import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "TechCube - IT Solutions & Software Development Company",
  description = "TechCube delivers cutting-edge custom software development, web applications, mobile apps, and AI solutions for businesses across India.",
  canonicalUrl = "https://techcube.in",
  image = "https://techcube.in/images/og-image.jpg",
  type = "website"
}) => {
  // Create structured data for organization
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

  // Create structured data for service
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
      <meta name="keywords" content="software development, web development, mobile app development, AI solutions, machine learning, IT company Mumbai, custom software, React.js, Node.js, Python development" />
      
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
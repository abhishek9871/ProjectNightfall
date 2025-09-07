import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface PrerenderMetaProps {
  canonical?: string;
  title?: string;
  description?: string;
}

export const PrerenderMeta: React.FC<PrerenderMetaProps> = ({
  canonical: providedCanonical,
  title: providedTitle,
  description: providedDescription
}) => {
  const location = useLocation();
  
  // Skip PrerenderMeta completely on all pages to avoid duplication
  // Each page will manage its own meta tags through Helmet
  return null;

  // Generate canonical URL based on current route
  const baseUrl = 'https://project-nightfall.pages.dev';
  const currentPath = location.pathname;
  const canonical = providedCanonical || `${baseUrl}${currentPath}`;
  
  // Default meta values
  const title = providedTitle || 'Project Nightfall - Premium Adult Entertainment Platform';
  const description = providedDescription || 'Explore a curated collection of high-quality adult entertainment. Project Nightfall features in-depth reviews, top-rated videos, and a premium viewing experience.';
  
  return (
    <Helmet>
      <link rel="canonical" href={canonical} />
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default PrerenderMeta;
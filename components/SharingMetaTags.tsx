import React, { useEffect } from 'react';
import { Video } from '../types';

interface SharingMetaTagsProps {
  video: Video;
}

export const SharingMetaTags: React.FC<SharingMetaTagsProps> = ({ video }) => {
  useEffect(() => {
    // Clean up existing meta tags first
    const existingMetaTags = document.querySelectorAll('meta[data-meta-type="sharing"]');
    existingMetaTags.forEach(tag => tag.remove());

    // Generate canonical URL
    const canonicalUrl = `https://project-nightfall.pages.dev/watch/${video.id}`;
    
    // Generate meta description (first 160 characters)
    const metaDescription = video.description.length > 160 
      ? video.description.substring(0, 157) + '...' 
      : video.description;
    
    // Parse duration for meta tags
    const [minutes, seconds] = video.duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    // Create optimized thumbnail URL with proper dimensions for WhatsApp/Telegram
    // Using Picsum with 1200x630 dimensions as recommended for social sharing
    const thumbnailUrl = video.thumbnailUrl 
      ? video.thumbnailUrl.replace('/400/225', '/1200/630') 
      : '';

    // Define all meta tags
    const metaTags = [
      // Primary Meta Tags
      { name: 'description', content: metaDescription },
      { name: 'keywords', content: `${video.title}, ${video.category}, adult video, premium content, ${video.tags?.join(', ') || ''}` },
      
      // Enhanced Open Graph Meta Tags for better sharing previews
      { property: 'og:type', content: 'video.other' },
      { property: 'og:title', content: video.title },
      { property: 'og:description', content: metaDescription },
      { property: 'og:image', content: thumbnailUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: 'Project Nightfall' },
      { property: 'og:video', content: video.embedUrls[0] },
      { property: 'og:video:duration', content: totalSeconds.toString() },
      { property: 'og:video:width', content: '1280' },
      { property: 'og:video:height', content: '720' },
      { property: 'og:video:type', content: 'text/html' },
      
      // Enhanced Twitter Card Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: video.title },
      { name: 'twitter:description', content: metaDescription },
      { name: 'twitter:image', content: thumbnailUrl },
      { name: 'twitter:site', content: '@ProjectNightfall' },
      
      // Additional Video Meta Tags for better indexing
      { name: 'video:duration', content: totalSeconds.toString() },
      { name: 'video:release_date', content: video.uploadDate },
      { name: 'video:tag', content: video.tags?.join(', ') || '' },
      
      // Platform-specific optimizations for WhatsApp and Telegram
      { property: 'og:image:secure_url', content: thumbnailUrl },
      { property: 'og:image:alt', content: video.title }
    ];

    // Inject meta tags into the document head
    metaTags.forEach(tagData => {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('data-meta-type', 'sharing');
      
      if (tagData.name) {
        metaTag.setAttribute('name', tagData.name);
      }
      
      if (tagData.property) {
        metaTag.setAttribute('property', tagData.property);
      }
      
      metaTag.setAttribute('content', tagData.content);
      document.head.appendChild(metaTag);
    });

    // Cleanup function
    return () => {
      const metaTags = document.querySelectorAll('meta[data-meta-type="sharing"]');
      metaTags.forEach(tag => tag.remove());
    };
  }, [video]);

  // Return null since we're handling DOM manipulation directly
  return null;
};
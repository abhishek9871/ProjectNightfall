import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Video } from '../types';

interface SharingMetaTagsProps {
  video: Video;
}

export const SharingMetaTags: React.FC<SharingMetaTagsProps> = ({ video }) => {
  // Derived values for social meta
  const canonicalUrl = `https://project-nightfall.pages.dev/watch/${video.id}`;
  const [minutes, seconds] = video.duration.split(':').map(Number);
  const totalSeconds = minutes * 60 + seconds;
  const thumbnailUrl = video.thumbnailUrl
    ? video.thumbnailUrl.replace('/400/225', '/1200/630')
    : '';
  const embedUrl = video.embedUrls[0] || '';
  const secureEmbedUrl = embedUrl.replace(/^http:\/\//i, 'https://');

  return (
    <Helmet>
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="video.other" />
      <meta property="og:title" content={video.title} />
      <meta
        property="og:description"
        content={video.description.length > 200 ? video.description.slice(0, 197) + '...' : video.description}
      />
      <meta property="og:image" content={thumbnailUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content={thumbnailUrl} />
      <meta property="og:image:alt" content={video.title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:video" content={secureEmbedUrl} />
      <meta property="og:video:secure_url" content={secureEmbedUrl} />
      <meta property="og:video:duration" content={totalSeconds.toString()} />
      <meta property="og:video:width" content="1280" />
      <meta property="og:video:height" content="720" />
      <meta property="og:video:type" content="text/html" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="player" />
      <meta name="twitter:title" content={video.title} />
      <meta
        name="twitter:description"
        content={video.description.length > 200 ? video.description.slice(0, 197) + '...' : video.description}
      />
      <meta name="twitter:image" content={thumbnailUrl} />
      <meta name="twitter:site" content="@ProjectNightfall" />
      <meta name="twitter:player" content={secureEmbedUrl} />
      <meta name="twitter:player:width" content="1280" />
      <meta name="twitter:player:height" content="720" />
    </Helmet>
  );
};
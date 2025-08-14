import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { videos } from '../../data/videos';
import { Layout } from '../../components/Layout';
import { assignVideoToCluster } from '../utils/clusterAssignment';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { Video } from '../../types';

export function WatchPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);

  // Get the correct category info for a video (handles cluster assignment)
  const getVideoCategory = (video: Video) => {
    const clusterId = assignVideoToCluster(video);
    const category = [...categories, ...specialtyClusters].find(c => c.id === clusterId);
    return category || { id: clusterId, name: video.category, slug: clusterId };
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Find video from data
    const foundVideo = videos.find(v => v.id.toString() === id);
    setVideo(foundVideo || null);
    setLoading(false);

    // Get related videos from same cluster
    if (foundVideo) {
      const videoClusterId = assignVideoToCluster(foundVideo);
      const related = videos
        .filter(v => assignVideoToCluster(v) === videoClusterId && v.id !== foundVideo.id)
        .slice(0, 6);
      setRelatedVideos(related);
    }
  }, [id]);

  // Enhanced JSON-LD Schema injection using direct DOM manipulation
  useEffect(() => {
    if (!video) return;

    // Clean up existing schemas first
    const existingSchemas = document.querySelectorAll('script[data-schema-type]');
    existingSchemas.forEach(script => script.remove());

    try {
      // Parse views number for schema
      const viewsNumber = parseInt(video.views.replace(/[^\d]/g, '')) * 1000;
      
      // Parse duration for schema
      const [minutes, seconds] = video.duration.split(':').map(Number);
      const totalSeconds = minutes * 60 + seconds;

      // Generate VideoObject schema
      const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": video.title,
        "description": video.description,
        "thumbnailUrl": video.thumbnailUrl,
        "uploadDate": video.uploadDate,
        "duration": `PT${Math.floor(totalSeconds / 60)}M${totalSeconds % 60}S`,
        "embedUrl": video.embedUrls[0],
        "contentUrl": video.embedUrls[0],
        "interactionCount": viewsNumber,
        "genre": video.category,
        "keywords": video.tags?.join(', ') || '',
        "isFamilyFriendly": false,
        "contentRating": "adult",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": video.rating,
          "ratingCount": Math.floor(viewsNumber / 100),
          "bestRating": 5,
          "worstRating": 1
        },
        "publisher": {
          "@type": "Organization",
          "name": "Project Nightfall",
          "url": "https://project-nightfall.pages.dev"
        }
      };

      // Generate BreadcrumbList schema with correct category
      const videoCategory = getVideoCategory(video);
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://project-nightfall.pages.dev"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": videoCategory.name,
            "item": `https://project-nightfall.pages.dev/category/${videoCategory.slug}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": video.title
          }
        ]
      };

      // Inject VideoObject schema
      const videoScript = document.createElement('script');
      videoScript.type = 'application/ld+json';
      videoScript.setAttribute('data-schema-type', 'video');
      videoScript.textContent = JSON.stringify(videoSchema);
      document.head.appendChild(videoScript);

      // Inject BreadcrumbList schema
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-schema-type', 'breadcrumb');
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScript);

    } catch (error) {
      console.error('Error injecting JSON-LD schemas:', error);
    }

    // Cleanup function
    return () => {
      const schemas = document.querySelectorAll('script[data-schema-type]');
      schemas.forEach(script => script.remove());
    };
  }, [video]);

  // Enhanced meta tag updates using direct DOM manipulation as fallback
  useEffect(() => {
    if (!video) return;

    try {
      // Generate meta description (first 160 characters)
      const metaDescription = video.description.length > 160 
        ? video.description.substring(0, 157) + '...' 
        : video.description;

      // Generate canonical URL
      const canonicalUrl = `https://project-nightfall.pages.dev/watch/${video.id}`;

      // Update or create meta tags directly
      const updateMetaTag = (selector: string, content: string) => {
        let meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta) {
          meta.content = content;
        } else {
          meta = document.createElement('meta');
          const parts = selector.match(/\[([^=]+)="([^"]+)"\]/);
          if (parts) {
            meta.setAttribute(parts[1], parts[2]);
            meta.content = content;
            document.head.appendChild(meta);
          }
        }
      };

      // Update canonical link
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonical) {
        canonical.href = canonicalUrl;
      } else {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = canonicalUrl;
        document.head.appendChild(canonical);
      }

      // Update meta tags
      updateMetaTag('meta[name="description"]', metaDescription);
      updateMetaTag('meta[name="keywords"]', video.tags?.join(', ') || '');
      updateMetaTag('meta[property="og:title"]', video.title);
      updateMetaTag('meta[property="og:description"]', metaDescription);
      updateMetaTag('meta[property="og:url"]', canonicalUrl);
      updateMetaTag('meta[property="og:image"]', video.thumbnailUrl || '');
      updateMetaTag('meta[name="twitter:title"]', video.title);
      updateMetaTag('meta[name="twitter:description"]', metaDescription);
      updateMetaTag('meta[name="twitter:image"]', video.thumbnailUrl || '');

    } catch (error) {
      console.error('Error updating meta tags:', error);
    }
  }, [video]);

  // Handle video not found
  if (!loading && !video) {
    return (
      <>
        <Helmet>
          <title>Video Not Found - Project Nightfall</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Video Not Found</h1>
            <p className="text-slate-400 mb-6">The video you're looking for doesn't exist.</p>
            <Link 
              to="/" 
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) return null;

  // Parse duration for meta tags
  const [minutes, seconds] = video.duration.split(':').map(Number);
  const totalSeconds = minutes * 60 + seconds;

  // Generate meta description (first 160 characters)
  const metaDescription = video.description.length > 160 
    ? video.description.substring(0, 157) + '...' 
    : video.description;

  // Generate canonical URL
  const canonicalUrl = `https://project-nightfall.pages.dev/watch/${video.id}`;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{video.title} - Project Nightfall</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={video.tags?.join(', ') || ''} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Adult Content Rating */}
        <meta name="rating" content="adult" />
        <meta name="content-rating" content="mature" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={video.thumbnailUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Project Nightfall" />
        <meta property="og:video" content={video.embedUrls[0]} />
        <meta property="og:video:duration" content={totalSeconds.toString()} />
        <meta property="og:video:width" content="800" />
        <meta property="og:video:height" content="450" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={video.thumbnailUrl} />
        <meta name="twitter:player" content={video.embedUrls[0]} />
        <meta name="twitter:player:width" content="800" />
        <meta name="twitter:player:height" content="450" />
        <meta name="twitter:site" content="@ProjectNightfall" />
        
        {/* Additional Video Meta Tags */}
        <meta name="video:duration" content={totalSeconds.toString()} />
        <meta name="video:release_date" content={video.uploadDate} />
        <meta name="video:tag" content={video.tags?.join(', ') || ''} />
      </Helmet>

      <Layout>
        {/* Header with Navigation */}
        <header className="bg-slate-900 border-b border-slate-800 p-4">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link 
                to={`/category/${getVideoCategory(video).slug}`}
                className="hover:text-white transition-colors"
              >
                {getVideoCategory(video).name}
              </Link>
              <span>/</span>
              <span className="text-white truncate">{video.title}</span>
            </nav>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="bg-slate-900 rounded-lg overflow-hidden mb-6">
                <div className="aspect-video">
                  <iframe
                    src={video.embedUrls[0]}
                    className="w-full h-full"
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    allowFullScreen
                    loading="eager"
                    referrerPolicy="origin-when-cross-origin"
                    style={{
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Video Info */}
              <div className="bg-slate-900 rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    👁️ {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    ⭐ {video.rating}/5
                  </span>
                  <span className="flex items-center gap-1">
                    ⏱️ {video.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    📅 {new Date(video.uploadDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    {video.category}
                  </span>
                  <Link 
                    to="/categories"
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    Browse All Categories →
                  </Link>
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-slate-300 leading-relaxed">
                  {video.description}
                </div>

                {video.actors && video.actors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <h3 className="text-lg font-semibold mb-2">Performers</h3>
                    <div className="flex flex-wrap gap-2">
                      {video.actors.map((actor, index) => (
                        <span 
                          key={index}
                          className="bg-slate-800 text-slate-300 px-3 py-1 rounded"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Videos Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Related Videos</h2>
                <div className="space-y-4">
                  {relatedVideos.map((relatedVideo) => (
                    <Link
                      key={relatedVideo.id}
                      to={`/watch/${relatedVideo.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={relatedVideo.thumbnailUrl}
                            alt={relatedVideo.title}
                            className="w-24 h-16 object-cover rounded group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                            {relatedVideo.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {relatedVideo.views}
                          </p>
                          <p className="text-xs text-slate-400">
                            {relatedVideo.duration}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
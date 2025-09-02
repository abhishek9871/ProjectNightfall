import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { videos } from '../../data/videos';
import { Layout } from '../../components/Layout';
import { assignVideoToCluster } from '../utils/clusterAssignment';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { useSearch } from '../contexts/SearchContext';
import FavoriteButton from '../components/FavoriteButton';
import { Video } from '../../types';
import { ShareButton } from '../../components/ShareButton';
import { SharingMetaTags } from '../../components/SharingMetaTags';
import { AddToPlaylistButton } from '../../components/playlist/AddToPlaylistButton';

export function WatchPage() {
  const { id } = useParams();
  const { searchQuery } = useSearch();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [searchResults, setSearchResults] = useState<Video[]>([]);

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

  // Smart scroll-to-top behavior when video changes
  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  // Enhanced search functionality for watch page
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    let filtered = [...videos];
    
    // Find if search query matches any category name
    const allCategories = [...categories, ...specialtyClusters];
    const matchingCategory = allCategories.find(cat => 
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query) ||
      cat.id.toLowerCase().includes(query)
    );
    
    if (matchingCategory) {
      // Category search: get all videos assigned to this category + text matches
      const categoryVideos = filtered.filter(video => 
        assignVideoToCluster(video) === matchingCategory.id
      );
      
      const textMatchVideos = filtered.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        video.category.toLowerCase().includes(query)
      );
      
      // Combine and deduplicate
      const videoIds = new Set();
      filtered = [...categoryVideos, ...textMatchVideos].filter(video => {
        if (videoIds.has(video.id)) return false;
        videoIds.add(video.id);
        return true;
      });
    } else {
      // Regular text search
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        video.category.toLowerCase().includes(query)
      );
    }
    
    // Exclude current video from search results
    if (video) {
      filtered = filtered.filter(v => v.id !== video.id);
    }
    
    // Sort by relevance and limit to 12 results
    const sortedResults = filtered.sort((a, b) => {
      const getViews = (viewStr: string) => {
        const match = viewStr.match(/(\d+\.?\d*)(K|M)/);
        if (!match) return 0;
        const num = parseFloat(match[1]);
        const unit = match[2];
        return unit === 'M' ? num * 1000000 : num * 1000;
      };
      
      const scoreA = (a.rating * 500000) + getViews(a.views);
      const scoreB = (b.rating * 500000) + getViews(b.views);
      return scoreB - scoreA;
    }).slice(0, 12);
    
    setSearchResults(sortedResults);
  }, [searchQuery, video]);

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

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{video.title} - Project Nightfall</title>
        <meta name="description" content={video.description.substring(0, 160) + '...'} />
        <meta name="keywords" content={`${video.title}, ${video.category}, adult video, premium content, ${video.tags?.join(', ') || ''}`} />
        <link rel="canonical" href={`https://project-nightfall.pages.dev/watch/${video.id}`} />
        
        {/* Adult Content Rating */}
        <meta name="rating" content="adult" />
        <meta name="content-rating" content="mature" />
      </Helmet>
      
      {/* Enhanced sharing meta tags - moved outside Helmet to avoid nesting issues */}
      <SharingMetaTags video={video} />

      <Layout>
        {/* Header with Navigation */}
        <header className="bg-slate-900 border-b border-slate-800 p-4">
          <div className="max-w-7xl mx-auto">
            <nav
              className="breadcrumb-nav flex items-center gap-1 text-sm text-slate-400 flex-nowrap overflow-hidden min-w-0"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="crumb hover:text-white transition-colors">Home</Link>
              <span className="separator" aria-hidden="true">/</span>
              <Link 
                to={`/category/${getVideoCategory(video).slug}`}
                className="crumb hover:text-white transition-colors"
              >
                {getVideoCategory(video).name}
              </Link>
              <span className="separator" aria-hidden="true">/</span>
              <span className="crumb-title text-white">{video.title}</span>
            </nav>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 watch-page-container">
          <div className="mobile-grid-container lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="bg-slate-900 rounded-lg overflow-hidden mb-6 mobile-video-container">
                <div className="aspect-video">
                  <iframe
                    src={video.embedUrls[0]}
                    className="w-full h-full"
                    title={video.title}
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-presentation allow-fullscreen"
                    allowFullScreen
                    frameBorder="0"
                    loading="eager"
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      maxWidth: '100%',
                      height: '100%',
                      display: 'block'
                    }}
                  />
                </div>
              </div>

              {/* Video Info */}
              <div className="bg-slate-900 rounded-lg p-6 mobile-compact">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mobile-text-container mobile-safe mb-3">{video.title}</h1>
                  
                  {/* Action buttons row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <FavoriteButton
                        videoId={String(video.id)}
                        video={video}
                        size="md"
                        position="inline"
                        showTooltip={true}
                      />
                      <AddToPlaylistButton
                        video={video}
                        size="md"
                        variant="button"
                        showTooltip={true}
                        className="flex-shrink-0"
                      />
                    </div>
                    
                    <ShareButton
                      video={video}
                      size="md"
                      variant="button"
                    />
                  </div>
                </div>
                
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

                <div className="text-slate-300 leading-relaxed mobile-text-container mobile-safe">
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

            {/* Related Videos or Search Results Sidebar */}
            <div className="lg:col-span-1 related-videos-mobile mobile-safe">
              <div className="bg-slate-900 rounded-lg p-6">
                {searchQuery ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">Search Results for "{searchQuery}"</h2>
                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchResults.map((searchVideo) => (
                          <Link
                            key={searchVideo.id}
                            to={`/watch/${searchVideo.id}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0">
                                <img
                                  src={searchVideo.thumbnailUrl}
                                  alt={searchVideo.title}
                                  className="w-24 h-16 object-cover rounded group-hover:opacity-80 transition-opacity"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                                  {searchVideo.title}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                  {searchVideo.views}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {searchVideo.duration}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">No results found for "{searchQuery}"</p>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Action Button for Mobile */}
        <FavoriteButton
          videoId={String(video.id)}
          video={video}
          size="lg"
          position="fab"
          showTooltip={false}
        />
      </Layout>
    </>
  );
}
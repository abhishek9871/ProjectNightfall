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
import { AddToPlaylistButton } from '../../components/playlist/AddToPlaylistButton';

export function WatchPage() {
  const { id } = useParams();
  const { searchQuery } = useSearch();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
  // JSON-LD moved to Helmet-managed <script> tags

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

  // Prepare JSON-LD data for Helmet
  const parseViews = (v: string): number => {
    const clean = v.toUpperCase().replace(/VIEWS?/g, '').trim();
    const match = clean.match(/([\d.,]+)\s*([KM]?)/);
    if (!match) {
      const digits = clean.replace(/[^\d]/g, '');
      return digits ? parseInt(digits, 10) : 0;
    }
    let num = parseFloat(match[1].replace(/,/g, ''));
    const unit = match[2];
    if (unit === 'M') num *= 1_000_000;
    else if (unit === 'K') num *= 1_000;
    return Math.round(num);
  };
  const viewsNumber = parseViews(video.views);
  const [durMin, durSec] = video.duration.split(':').map(Number);
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: `PT${durMin}M${durSec}S`,
    embedUrl: video.embedUrls[0],
    contentUrl: video.embedUrls[0],
    interactionCount: viewsNumber,
    genre: video.category,
    keywords: video.tags?.join(', ') || 'adult, video',
    isFamilyFriendly: false,
    contentRating: 'adult',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: video.rating,
      ratingCount: Math.floor(viewsNumber / 100),
      bestRating: 5,
      worstRating: 1
    },
    publisher: {
      '@type': 'Organization',
      name: 'Project Nightfall',
      url: 'https://project-nightfall.pages.dev'
    }
  };
  const videoCategory = getVideoCategory(video);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://project-nightfall.pages.dev'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: videoCategory.name,
        item: `https://project-nightfall.pages.dev/category/${videoCategory.slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: video.title
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{video.title} - Project Nightfall</title>
        <meta name="description" content={video.description.substring(0, 160) + '...'} />
        <meta name="keywords" content={`${video.title}, ${video.category}, adult video, premium content, ${video.tags?.join(', ') || ''}`} />
        
        {/* Canonical URL - MUST point to this specific watch page */}
        <link rel="canonical" href={`https://project-nightfall.pages.dev/watch/${video.id}`} />
        
        {/* Adult Content Rating */}
        <meta name="rating" content="adult" />
        <meta name="content-rating" content="mature" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph Video Tags */}
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description.substring(0, 160) + '...'} />
        <meta property="og:url" content={`https://project-nightfall.pages.dev/watch/${video.id}`} />
        <meta property="og:site_name" content="Project Nightfall" />
        <meta property="og:image" content={video.thumbnailUrl || 'https://project-nightfall.pages.dev/og-image.jpg'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:video" content={video.embedUrls[0]} />
        <meta property="og:video:secure_url" content={video.embedUrls[0].replace('http://', 'https://')} />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        
        {/* Twitter Player Card */}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content={video.description.substring(0, 160) + '...'} />
        <meta name="twitter:image" content={video.thumbnailUrl || 'https://project-nightfall.pages.dev/og-image.jpg'} />
        <meta name="twitter:player" content={`https://project-nightfall.pages.dev/watch/${video.id}`} />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(videoSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
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
                    sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-presentation"
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
              <div className="bg-slate-900 rounded-lg overflow-hidden mobile-compact">
                {/* Video Title */}
                <div className="p-6 pb-0">
                  <h1 className="text-2xl md:text-3xl font-bold mobile-text-container mobile-safe mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {video.title}
                  </h1>
                </div>

                {/* Engagement Actions - Prominent Cards */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {/* Favorite Action Card */}
                    <div className="bg-gradient-to-br from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-xl p-4 hover:from-pink-600/30 hover:to-red-600/30 transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-pink-400 text-sm font-medium mb-1">Add to Favorites</p>
                          <p className="text-slate-300 text-xs">Save for later</p>
                        </div>
                        <FavoriteButton
                          videoId={String(video.id)}
                          video={video}
                          size="md"
                          position="inline"
                          showTooltip={true}
                        />
                      </div>
                    </div>

                    {/* Playlist Action Card */}
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-400 text-sm font-medium mb-1">Add to Playlist</p>
                          <p className="text-slate-300 text-xs">Organize content</p>
                        </div>
                        <AddToPlaylistButton
                          video={video}
                          size="md"
                          variant="button"
                          showTooltip={true}
                          className="flex-shrink-0"
                        />
                      </div>
                    </div>

                    {/* Share Action Card */}
                    <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-xl p-4 hover:from-green-600/30 hover:to-teal-600/30 transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-400 text-sm font-medium mb-1">Share Video</p>
                          <p className="text-slate-300 text-xs">Tell others</p>
                        </div>
                        <ShareButton
                          video={video}
                          size="md"
                          variant="button"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Statistics - Enhanced Cards */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {/* Views Card */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-colors">
                      <div className="text-2xl mb-1">👁️</div>
                      <div className="text-white font-bold text-lg">{video.views}</div>
                      <div className="text-slate-400 text-xs">Views</div>
                    </div>

                    {/* Rating Card */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-colors">
                      <div className="text-2xl mb-1">⭐</div>
                      <div className="text-white font-bold text-lg">{video.rating}/5</div>
                      <div className="text-slate-400 text-xs">Rating</div>
                    </div>

                    {/* Duration Card */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-colors">
                      <div className="text-2xl mb-1">⏱️</div>
                      <div className="text-white font-bold text-lg">{video.duration}</div>
                      <div className="text-slate-400 text-xs">Duration</div>
                    </div>

                    {/* Upload Date Card */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-colors">
                      <div className="text-2xl mb-1">📅</div>
                      <div className="text-white font-bold text-sm">{new Date(video.uploadDate).toLocaleDateString()}</div>
                      <div className="text-slate-400 text-xs">Uploaded</div>
                    </div>
                  </div>
                </div>

                {/* Category & Browse Section - Mobile Optimized */}
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-4">
                    {/* Mobile Layout: Stack vertically */}
                    <div className="block sm:hidden space-y-4">
                      <div className="flex items-center justify-center">
                        <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg text-base font-medium shadow-lg">
                          {video.category}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-300 text-sm font-medium mb-1">Category</p>
                        <p className="text-slate-500 text-xs mb-3">Explore similar content</p>
                      </div>
                      <Link 
                        to="/categories"
                        className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg text-center"
                      >
                        Browse All Categories →
                      </Link>
                    </div>
                    
                    {/* Desktop Layout: Side by side */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                          {video.category}
                        </span>
                        <div>
                          <p className="text-slate-300 text-sm font-medium">Category</p>
                          <p className="text-slate-500 text-xs">Explore similar content</p>
                        </div>
                      </div>
                      
                      <Link 
                        to="/categories"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Browse All Categories →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                {video.tags && video.tags.length > 0 && (
                  <div className="px-6 pb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600/50 text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:border-slate-500/50 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description Section - Mobile Optimized */}
                <div className="px-6 pb-6">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full mr-3"></span>
                      Description
                    </h3>
                    {/* Mobile: Show truncated text with expand option */}
                    <div className="sm:hidden">
                      {video.description.length > 150 ? (
                        <>
                          <div className="text-slate-300 leading-relaxed mb-3">
                            {showFullDescription 
                              ? video.description 
                              : `${video.description.substring(0, 150)}...`
                            }
                          </div>
                          <button 
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg"
                          >
                            {showFullDescription ? 'Show Less' : 'Show More'}
                          </button>
                        </>
                      ) : (
                        <div className="text-slate-300 leading-relaxed">
                          {video.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Desktop: Show full text */}
                    <div className="hidden sm:block text-slate-300 leading-relaxed">
                      {video.description}
                    </div>
                  </div>
                </div>

                {/* Performers Section */}
                {video.actors && video.actors.length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-3"></span>
                        Performers
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {video.actors.map((actor, index) => (
                          <span 
                            key={index}
                            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:border-purple-400/50 cursor-pointer"
                          >
                            {actor}
                          </span>
                        ))}
                      </div>
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
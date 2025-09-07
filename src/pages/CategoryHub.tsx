import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';
import { VideoCard } from '../../components/VideoCard';
import { Pagination } from '../../components/Pagination';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { videos } from '../../data/videos';
import { computeCategoryCounts } from '../utils/clusterAssignment';
import { useSearch } from '../contexts/SearchContext';
import { filterVideosBySearchQuery } from '../utils/searchUtils';

const CategoryHub = () => {
  const { searchQuery } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Track previous search query to detect changes
  const prevSearchQueryRef = useRef(searchQuery);
  
  // Pagination constants
  const VIDEOS_PER_PAGE = 24;
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  
  // Handle page change by updating URL params
  const onPageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', page.toString());
    }
    setSearchParams(newParams);
  };

  // Handle pagination change with smart scrolling
  const handlePageChange = (page: number) => {
    onPageChange(page);

    // Scroll to video grid when pagination changes
    setTimeout(() => {
      const videoGrid = document.querySelector('.professional-video-grid');
      if (videoGrid) {
        videoGrid.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Reset pagination to page 1 when search query changes (both context and URL)
  useEffect(() => {
    onPageChange(1);
  }, [searchQuery, searchParams.get('search')]);

  // Dedicated useEffect for search query change auto-scroll (same as HomePage)
  useEffect(() => {
    if (searchQuery !== prevSearchQueryRef.current) {
      onPageChange(1);
      // Scroll to top when search query changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevSearchQueryRef.current = searchQuery;
    }
  }, [searchQuery]);
  
  // Compute dynamic video counts
  const categoryCounts = useMemo(() => computeCategoryCounts(videos), []);
  
  // Enhanced search-aware video filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    // Use standardized search algorithm (removes description field search)
    const filtered = filterVideosBySearchQuery(videos, searchQuery, categories, specialtyClusters);
    
    // Sort by relevance (rating + views)
    return filtered.sort((a, b) => {
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
    }); // Removed .slice(0, 24) limit
  }, [searchQuery]);
  
  // Calculate paginated search results
  const paginatedSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    return searchResults.slice(startIndex, endIndex);
  }, [searchResults, currentPage, searchQuery]);
  
  // Get popular videos from last 7 days (or best available metric)
  const popularVideos = useMemo(() => {
    return videos
      .sort((a, b) => {
        // Sort by views and rating for popularity
        const getViews = (viewStr: string) => {
          const match = viewStr.match(/(\d+\.?\d*)(K|M)/);
          if (!match) return 0;
          const num = parseFloat(match[1]);
          const unit = match[2];
          return unit === 'M' ? num * 1000000 : num * 1000;
        };
        
        const scoreA = getViews(a.views) + (a.rating * 100000);
        const scoreB = getViews(b.views) + (b.rating * 100000);
        return scoreB - scoreA;
      })
      .slice(0, 12);
  }, []);

  // Current date for freshness
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // FAQ data
  const faqs = [
    {
      question: "How are video categories organized?",
      answer: "Our categories are organized into 8 core pillars covering the most popular content types, plus specialty collections for niche interests. Every video is assigned to ensure easy discovery."
    },
    {
      question: "How often are new videos added to categories?",
      answer: "We add new content regularly across all categories. Popular categories like MILF and Amateur receive daily updates, while specialty collections are updated weekly."
    },
    {
      question: "Can I filter videos within categories?",
      answer: "Yes, each category page includes filtering options by rating, upload date, and duration. You can also use the search function to find specific content within categories."
    },
    {
      question: "What makes the featured categories different from specialty collections?",
      answer: "Featured categories represent our most popular content types with the largest video libraries. Specialty collections focus on specific niches and interests with curated content."
    },
    {
      question: "Are all videos available in HD quality?",
      answer: "Most of our content is available in HD quality. Video quality is indicated on each video card, and you can filter by quality preferences within category pages."
    }
  ];

  return (
    <>
      <Helmet>
        <title>All Video Categories | Project Nightfall</title>
        <meta name="description" content="Browse all video categories, including 8 premium pillars and specialty collections. Updated frequently with new content across all categories." />
        <link rel="canonical" href="https://project-nightfall.pages.dev/categories" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Adult Content Rating */}
        <meta name="rating" content="adult" />
        <meta name="content-rating" content="mature" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="All Video Categories | Project Nightfall" />
        <meta property="og:description" content="Browse all video categories, including 8 premium pillars and specialty collections. Updated frequently." />
        <meta property="og:url" content="https://project-nightfall.pages.dev/categories" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Project Nightfall" />
        <meta property="og:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Video Categories | Project Nightfall" />
        <meta name="twitter:description" content="Browse all video categories on Project Nightfall" />
        <meta name="twitter:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
        
        {/* Performance Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://www.xvideos4.com" />
        <link rel="dns-prefetch" href="https://xvv1deos.com" />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebPage", "CollectionPage"],
            "name": "All Video Categories",
            "description": "Browse all video categories, including 8 premium pillars and specialty collections. Updated frequently with new content across all categories.",
            "url": "https://project-nightfall.pages.dev/categories",
            "dateModified": new Date().toISOString(),
            "mainEntity": {
              "@type": "ItemList",
              "name": "Video Categories",
              "description": "Complete list of all video categories available on Project Nightfall",
              "numberOfItems": categories.length + specialtyClusters.length,
              "itemListElement": [
                ...categories.map((category, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": category.name,
                  "url": `https://project-nightfall.pages.dev/category/${category.slug}`
                })),
                ...specialtyClusters.map((cluster, index) => ({
                  "@type": "ListItem",
                  "position": categories.length + index + 1,
                  "name": cluster.name,
                  "url": `https://project-nightfall.pages.dev/category/${cluster.slug}`
                }))
              ]
            }
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>

      <Layout>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="text-sm font-medium text-slate-300" aria-current="page">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Categories'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Dynamic Header */}
          <div className="mb-8">
            {searchQuery ? (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 mobile-text-container mobile-safe">
                  Search "{searchQuery}" - All Categories
                </h1>
                <div className="bg-slate-900 rounded-lg p-6 mb-6">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    Found {searchResults.length} videos matching your search criteria across all categories.
                  </p>
                  {searchResults.length > VIDEOS_PER_PAGE && (
                    <p className="text-slate-500 text-sm mt-2">
                      Showing {Math.min((currentPage - 1) * VIDEOS_PER_PAGE + 1, searchResults.length)} - {Math.min(currentPage * VIDEOS_PER_PAGE, searchResults.length)} of {searchResults.length} results
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 mobile-text-container mobile-safe">
                  Browse All Video Categories
                </h1>
                <div className="bg-slate-900 rounded-lg p-6 mb-6">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    Explore our comprehensive collection of adult video categories, featuring 8 premium pillars and specialty collections. 
                    Navigate through curated content organized by popularity, themes, and viewer preferences for easy discovery.
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Last updated: {currentDate}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Show search results if searching */}
          {searchQuery && searchResults.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
              <div className="professional-video-grid">
                {paginatedSearchResults.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                  />
                ))}
              </div>
              
              {/* Pagination for search results */}
              {searchResults.length > VIDEOS_PER_PAGE && (
                <Pagination
                  totalItems={searchResults.length}
                  itemsPerPage={VIDEOS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </section>
          )}

          {/* Show "No results" if searching but no results */}
          {searchQuery && searchResults.length === 0 && (
            <section className="mb-12">
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No videos found matching "{searchQuery}".</p>
                <p className="text-slate-500 mt-2">Try adjusting your search terms or browse categories below.</p>
              </div>
            </section>
          )}

          {/* Show categories only when not searching or no results */}
          {(!searchQuery || searchResults.length === 0) && (
            <>
              {/* Featured Categories (8 Core Pillars) */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Featured Categories</h2>
                <div className="professional-video-grid">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition-all hover:scale-105 border border-slate-700 hover:border-purple-500 h-full flex flex-col"
                    >
                      <h3 className="font-semibold text-white mb-2 text-lg">{category.name}</h3>
                      <p className="text-sm text-slate-400 mb-4 flex-grow">{category.description}</p>
                      <span className="text-sm text-purple-400 font-medium">
                        {categoryCounts[category.id] || category.videoCount} videos
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Specialty Collections */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Specialty Collections</h2>
                <div className="professional-video-grid">
                  {specialtyClusters.map((cluster) => (
                    <Link
                      key={cluster.id}
                      to={`/category/${cluster.slug}`}
                      className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition-all hover:scale-105 border border-slate-700 hover:border-purple-500 h-full flex flex-col"
                    >
                      <h3 className="font-semibold text-white mb-2 text-lg">{cluster.name}</h3>
                      <p className="text-sm text-slate-400 mb-4 flex-grow">{cluster.description}</p>
                      <span className="text-sm text-purple-400 font-medium">
                        {categoryCounts[cluster.id] || 0} videos
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Popular This Week */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Popular This Week</h2>
                <div className="professional-video-grid">
                  {popularVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                    />
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="bg-slate-900 rounded-lg p-6">
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-slate-800 pb-4 last:border-b-0 last:pb-0">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

        </div>
      </Layout>
    </>
  );
};

export default CategoryHub;
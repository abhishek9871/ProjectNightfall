import { useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { videos } from '../../data/videos';
import { VideoCard } from '../../components/VideoCard';
import { CategoryPagination } from '../../components/CategoryPagination';
import { Layout } from '../../components/Layout';
import { categoryContent } from '../data/categoryContent';
import { getVideosForCluster } from '../utils/clusterAssignment';
import { useSearch } from '../contexts/SearchContext';
import { filterVideosBySearchQuery } from '../utils/searchUtils';
// Removed unused Video import

// Removed unused BreadcrumbItem interface

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery } = useSearch();
  
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

  // Enhanced scroll to video grid when page changes - handles all pagination scenarios
  useEffect(() => {
    // Always scroll to video grid on page change, regardless of page number
    // Increased delay to ensure content is rendered and DOM is updated after navigation
    const timer = setTimeout(() => {
      const videoGrid = document.querySelector('.professional-video-grid');
      const mainContent = document.querySelector('main');
      const targetElement = videoGrid || mainContent;
      
      if (targetElement) {
        const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offset = 100; // Offset from top for better visibility
        
        window.scrollTo({
          top: Math.max(0, elementTop - offset),
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 150); // Increased delay to ensure DOM is fully updated
    
    return () => clearTimeout(timer);
  }, [currentPage]); // Triggers on any page change
  
  // Scroll to top when initially navigating to this category page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]); // Trigger when category slug changes (initial navigation)
  
  // Check both main categories and specialty clusters
  const category = categories.find(c => c.slug === slug) || 
                   specialtyClusters.find(c => c.slug === slug);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Category Not Found</h1>
          <p className="text-slate-400 mb-6">The category you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const allCategoryVideos = useMemo(() => {
    // When search query is present, use standardized global search
    if (searchQuery.trim()) {
      return filterVideosBySearchQuery(videos, searchQuery, categories, specialtyClusters);
    }
    
    // When no search query, show category-specific videos (existing behavior)
    const isSpecialtyCluster = specialtyClusters.some(c => c.id === category.id);
    
    if (isSpecialtyCluster) {
      return getVideosForCluster(videos, category.id);
    } else {
      // For main categories, use the existing logic
      return videos.filter(v => 
        v.category.toLowerCase() === category.id.toLowerCase()
      );
    }
  }, [category.id, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(allCategoryVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const endIndex = startIndex + VIDEOS_PER_PAGE;
  const paginatedVideos = allCategoryVideos.slice(startIndex, endIndex);

  // Get enriched content for this category
  const content = categoryContent[category.id] || categoryContent[category.slug];
  
  // SEO-safe titles and descriptions with page numbers and search
  const baseTitle = content?.title || `Best ${category.name} Videos - Project Nightfall`;
  const baseDescription = content?.metaDescription || `Discover ${allCategoryVideos.length} of the best ${category.name} videos. ${category.description}`;
  
  let pageTitle = baseTitle;
  let metaDescription = baseDescription;

  if (searchQuery.trim()) {
    pageTitle = `Search "${searchQuery}" - All Categories | Project Nightfall`;
    metaDescription = `Search results for "${searchQuery}" across all categories. Discover ${allCategoryVideos.length} matching videos from our complete collection.`;
  } else if (currentPage > 1) {
    pageTitle = `${category.name} Videos - Page ${currentPage} | Project Nightfall`;
    metaDescription = `${category.name} videos page ${currentPage}. ${baseDescription}`;
  }
  
  // Generate canonical and pagination URLs
  const baseUrl = `https://project-nightfall.pages.dev/category/${slug}`;
  const canonicalUrl = currentPage > 1 ? `${baseUrl}?page=${currentPage}` : baseUrl;
  const prevUrl = currentPage > 2 ? `${baseUrl}?page=${currentPage - 1}` : (currentPage === 2 ? baseUrl : null);
  const nextUrl = currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : null;

  // Prepare JSON-LD schemas for Helmet
  const webPageSchema = content && category ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": metaDescription,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${category.name} Videos${currentPage > 1 ? ` - Page ${currentPage}` : ''}`,
      "description": content.intro,
      "numberOfItems": allCategoryVideos.length,
      "itemListElement": paginatedVideos.slice(0, 10).map((video, index) => ({
        "@type": "VideoObject",
        "position": startIndex + index + 1,
        "name": video.title,
        "description": video.description,
        "thumbnailUrl": video.thumbnailUrl,
        "uploadDate": video.uploadDate,
        "duration": `PT${video.duration.replace(':', 'M')}S`,
        "contentUrl": video.embedUrls[0],
        "embedUrl": video.embedUrls[0],
        "genre": video.category,
        "isFamilyFriendly": false,
        "contentRating": "adult"
      }))
    },
    "breadcrumb": {
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
          "name": category.name,
          "item": baseUrl
        }
      ]
    }
  } : null;

  const faqSchema = (currentPage === 1 && content?.faqs && content.faqs.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  const collectionSchema = content && category ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Porn Videos${currentPage > 1 ? ` - Page ${currentPage}` : ''}`,
    "description": content.intro,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "VideoGallery",
      "name": `${category.name} Video Collection`,
      "description": content.intro,
      "numberOfItems": allCategoryVideos.length
    },
    "publisher": {
      "@type": "Organization",
      "name": "Project Nightfall",
      "url": "https://project-nightfall.pages.dev"
    }
  } : null;

  // Video click handler removed - now handled by Link in VideoCard

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${category.name.toLowerCase()}, ${category.name.toLowerCase()} porn, ${category.name.toLowerCase()} videos, ${category.name.toLowerCase()} sex, adult videos, porn videos, HD porn`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Pagination Meta Tags */}
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}
        
        {/* Adult Content Rating */}
        <meta name="rating" content="adult" />
        <meta name="content-rating" content="mature" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Project Nightfall" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:site" content="@ProjectNightfall" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Project Nightfall" />
        <meta name="publisher" content="Project Nightfall" />

        {/* JSON-LD Structured Data */}
        {webPageSchema && (
          <script type="application/ld+json">
            {JSON.stringify(webPageSchema)}
          </script>
        )}
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
        {collectionSchema && (
          <script type="application/ld+json">
            {JSON.stringify(collectionSchema)}
          </script>
        )}
      </Helmet>

      <Layout>
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Simple breadcrumb for now */}
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
                      {category.name}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mobile-text-container mobile-safe">
                  {searchQuery.trim() ? `Search "${searchQuery}" - All Categories` : `${category.name} Videos`}
                </h1>
                <Link 
                  to="/categories"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors self-start sm:self-auto min-h-[44px] flex items-center whitespace-nowrap"
                >
                  Browse All Categories →
                </Link>
              </div>
              
              {searchQuery.trim() && (
                <p className="text-slate-400 mb-4">
                  Found {allCategoryVideos.length} results for "{searchQuery}" across all categories
                </p>
              )}
              
              {/* Introductory Content */}
              {content?.intro && (
                <div className="bg-slate-900 rounded-lg p-6 mb-6">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {content.intro}
                  </p>
                </div>
              )}
              
              <p className="text-slate-500 text-sm mb-6">
                {searchQuery.trim() ? (
                  <>Global search results • Showing {paginatedVideos.length} of {allCategoryVideos.length} matching videos across all categories</>
                ) : currentPage > 1 ? (
                  <>Page {currentPage} of {totalPages} • Showing {paginatedVideos.length} of {allCategoryVideos.length} {category.name} videos</>
                ) : (
                  <>Discover {allCategoryVideos.length} of the best {category.name} videos</>
                )}
              </p>
            </div>

            {/* FAQ Section - Only on page 1 */}
            {currentPage === 1 && content?.faqs && content.faqs.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {content.faqs.map((faq: any, index: number) => (
                    <div key={index} className="border-b border-slate-800 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Categories - Only on page 1 */}
            {currentPage === 1 && (
              <div className="bg-slate-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Related Categories</h2>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    to="/categories"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Browse All Categories
                  </Link>
                  {[...categories, ...specialtyClusters]
                    .filter(cat => cat.id !== category.id)
                    .slice(0, 3)
                    .map((relatedCat) => (
                      <Link
                        key={relatedCat.id}
                        to={`/category/${relatedCat.slug}`}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-purple-500"
                      >
                        {relatedCat.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {allCategoryVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No videos found in this category.</p>
                <p className="text-slate-500 mt-2">Check back later for new content.</p>
              </div>
            ) : (
              <>
                <div className="professional-video-grid">
                  {paginatedVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                <CategoryPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  categorySlug={slug!}
                />
              </>
            )}
        </div>
      </Layout>
    </>
  );
};

export default CategoryPage;
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';
import { VideoCard } from '../../components/VideoCard';
import { Pagination } from '../../components/Pagination';
import { videos } from '../../data/videos';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { useSearch } from '../contexts/SearchContext';
import { filterVideosBySearchQuery } from '../utils/searchUtils';

type TimeFilter = 'all' | 'week' | 'month';

export function TopRatedPage(): React.ReactNode {
    const [searchParams, setSearchParams] = useSearchParams();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
    const [isLoading, setIsLoading] = useState(false);
    const { searchQuery } = useSearch();
    
    // Track previous search query to detect changes
    const prevSearchQueryRef = useRef(searchQuery);
    
    // Get current page from URL params
    const currentPageNum = parseInt(searchParams.get('page') || '1', 10);

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
    // Pagination constants
    const VIDEOS_PER_PAGE = 24;

    // Refs for scroll management
    const mainVideoGridRef = useRef<HTMLDivElement>(null);

    // Calculate total ratings for trust signals
    const totalRatings = useMemo(() => {
        return videos.reduce((sum, video) => {
            // Estimate rating count based on views (rough approximation)
            const viewsNum = parseInt(video.views.replace(/[^\d]/g, '')) || 0;
            return sum + Math.floor(viewsNum / 100); // Assume 1% of viewers rate
        }, 0);
    }, []);

    // Filter and sort videos by rating and time
    const filteredVideos = useMemo(() => {
        let filtered = [...videos];

        // Apply standardized search filter if provided
        if (searchQuery.trim()) {
            filtered = filterVideosBySearchQuery(filtered, searchQuery, categories, specialtyClusters);
        }

        // Apply time filter
        if (timeFilter !== 'all') {
            const now = new Date();
            const cutoffDate = new Date();

            if (timeFilter === 'week') {
                cutoffDate.setDate(now.getDate() - 7);
            } else if (timeFilter === 'month') {
                cutoffDate.setMonth(now.getMonth() - 1);
            }

            filtered = filtered.filter(video =>
                new Date(video.uploadDate) >= cutoffDate
            );
        }

        // Sort by rating (descending), then by views as tiebreaker
        filtered.sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }

            // Tiebreaker: sort by views
            const getViews = (viewStr: string) => {
                const match = viewStr.match(/(\d+\.?\d*)(K|M)/);
                if (!match) return 0;
                const num = parseFloat(match[1]);
                const unit = match[2];
                return unit === 'M' ? num * 1000000 : num * 1000;
            };

            return getViews(b.views) - getViews(a.views);
        });

        return filtered;
    }, [searchQuery, timeFilter]);

    // Get recently top-rated videos (gained high ratings in last 7 days)
    const recentlyTopRated = useMemo(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return videos
            .filter(video =>
                new Date(video.uploadDate) >= sevenDaysAgo &&
                video.rating >= 4.5
            )
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
    }, []);

    // Calculate paginated videos
    const paginatedVideos = useMemo(() => {
        const startIndex = (currentPageNum - 1) * VIDEOS_PER_PAGE;
        const endIndex = startIndex + VIDEOS_PER_PAGE;
        return filteredVideos.slice(startIndex, endIndex);
    }, [filteredVideos, currentPageNum]);

    // Handle time filter change with loading state
    const handleTimeFilterChange = (filter: TimeFilter) => {
        setIsLoading(true);
        setTimeFilter(filter);
        onPageChange(1); // Reset to first page

        // Simulate brief loading for smooth UX
        setTimeout(() => {
            setIsLoading(false);
            // Scroll to main video grid when filter changes
            if (mainVideoGridRef.current) {
                mainVideoGridRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 150);
    };

    // Handle pagination change with smart scrolling
    const handlePageChange = (page: number) => {
        onPageChange(page);

        // Scroll to main video grid (below Recently Top Rated section)
        setTimeout(() => {
            if (mainVideoGridRef.current) {
                mainVideoGridRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    // Get last updated timestamp
    const lastUpdated = useMemo(() => {
        const latestVideo = videos.reduce((latest, video) =>
            new Date(video.uploadDate) > new Date(latest.uploadDate) ? video : latest
        );
        return new Date(latestVideo.uploadDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, []);

    // Schema markup for the page
    const schemaMarkup = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": ["CollectionPage", "WebPage"],
        "name": "Top Rated Videos",
        "description": "The highest-rated videos on Project Nightfall, ranked by our community of users",
        "url": `https://project-nightfall.pages.dev/top-rated${currentPageNum > 1 ? `?page=${currentPageNum}` : ''}`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": filteredVideos.length,
            "itemListElement": paginatedVideos.slice(0, 10).map((video, index) => ({
                "@type": "VideoObject",
                "name": video.title,
                "thumbnailUrl": video.thumbnailUrl,
                "description": video.description,
                "duration": video.duration,
                "uploadDate": video.uploadDate,
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": video.rating.toString(),
                    "bestRating": "5",
                    "ratingCount": Math.floor(parseInt(video.views.replace(/[^\d]/g, '')) / 100).toString()
                },
                "url": `https://project-nightfall.pages.dev/watch/${video.id}`,
                "position": ((currentPageNum - 1) * VIDEOS_PER_PAGE) + index + 1
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
                    "name": "Top Rated Videos"
                }
            ]
        }
    }), [filteredVideos.length, paginatedVideos, currentPageNum]);

    // Inject schema markup
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaMarkup);
        script.id = 'top-rated-schema';

        // Remove existing schema
        const existing = document.getElementById('top-rated-schema');
        if (existing) {
            existing.remove();
        }

        document.head.appendChild(script);

        return () => {
            const scriptToRemove = document.getElementById('top-rated-schema');
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, [schemaMarkup]);

    // Scroll to top when component first mounts (Issue 1 fix)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []); // Empty dependency array means this runs only on mount



    return (
        <Layout>
            <Helmet>
                <title>{searchQuery.trim() ? `Search "${searchQuery}" in Top Rated | Project Nightfall` : `Top Rated Videos${currentPageNum > 1 ? ` - Page ${currentPageNum}` : ''} | Project Nightfall`}</title>
                <meta
                    name="description"
                    content={searchQuery.trim() ? `Top rated search results for "${searchQuery}". Discover premium quality content from our curated collection.` : `Discover the highest-rated videos on Project Nightfall, ranked by our community. Explore premium quality content from our curated collection, updated regularly. Page ${currentPageNum} of ${Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE)}.`}
                />
                <link
                    rel="canonical"
                    href={`https://project-nightfall.pages.dev/top-rated${currentPageNum > 1 ? `?page=${currentPageNum}` : ''}`}
                />
                <meta property="og:title" content={`Top Rated Videos | Project Nightfall`} />
                <meta property="og:description" content="Discover the highest-rated videos on Project Nightfall, ranked by our community." />
                <meta property="og:url" content={`https://project-nightfall.pages.dev/top-rated`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
                />
            </Helmet>

            <main className="container mx-auto px-4 py-6">

                {/* Hero Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                {searchQuery.trim() ? `Search "${searchQuery}" in Top Rated` : 'Top Rated Videos'}
                            </h1>
                            {searchQuery.trim() && (
                                <p className="text-slate-400 mb-4">
                                    Found {filteredVideos.length} top-rated results for "{searchQuery}"
                                </p>
                            )}
                            <p className="text-lg text-slate-400 mb-4 max-w-3xl">
                                {searchQuery.trim() 
                                    ? `Top-rated videos matching "${searchQuery}" from our curated collection.`
                                    : 'Discover the highest-rated videos across our entire library, ranked by our community of users. These are the videos that consistently deliver exceptional quality and viewer satisfaction.'
                                }
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span>Updated: {lastUpdated}</span>
                                <span>•</span>
                                <span>Based on {totalRatings.toLocaleString()} user ratings</span>
                                <span>•</span>
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified Content
                                </span>
                            </div>
                        </div>

                        {/* Performance indicator */}
                        <div className="mt-4 lg:mt-0 flex items-center text-sm text-slate-400">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span>Fast Loading</span>
                            </div>
                        </div>
                    </div>

                    {/* Time Filter Buttons */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {[
                            { key: 'all', label: 'All Time', count: videos.length },
                            { key: 'month', label: 'This Month', count: videos.filter(v => new Date(v.uploadDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length },
                            { key: 'week', label: 'This Week', count: videos.filter(v => new Date(v.uploadDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length }
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => handleTimeFilterChange(key as TimeFilter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${timeFilter === key
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                {label} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recently Top Rated Section */}
                {timeFilter === 'all' && recentlyTopRated.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Recently Top Rated
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                            {recentlyTopRated.map((video) => (
                                <VideoCard
                                    key={`recent-${video.id}`}
                                    video={video}
                                    compact={true}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        <span className="ml-3 text-slate-400">Loading top rated videos...</span>
                    </div>
                )}

                {/* Main Video Grid */}
                <div ref={mainVideoGridRef}>
                    {!isLoading && (
                        <>
                            {filteredVideos.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m8 0V7a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1.306z" />
                                    </svg>
                                    <p className="text-slate-400 text-lg mb-2">No top rated videos found for this time period.</p>
                                    <p className="text-slate-500">Try selecting a different time range.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Results Summary */}
                                    <div className="mb-6 text-sm text-slate-400">
                                        Showing {Math.min((currentPageNum - 1) * VIDEOS_PER_PAGE + 1, filteredVideos.length)} - {Math.min(currentPageNum * VIDEOS_PER_PAGE, filteredVideos.length)} of {filteredVideos.length} top rated videos
                                        {searchQuery && ` matching "${searchQuery}"`}
                                    </div>

                                    {/* Video Grid - Optimized for Core Web Vitals */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                        {paginatedVideos.map((video, index) => (
                                            <VideoCard
                                                key={video.id}
                                                video={video}
                                                priority={index < 4} // First 4 videos get priority loading for LCP
                                                fetchPriority={index < 4 ? "high" : "low"}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <Pagination
                                        totalItems={filteredVideos.length}
                                        itemsPerPage={VIDEOS_PER_PAGE}
                                        currentPage={currentPageNum}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Trust Signals Footer */}
                <div className="mt-12 pt-8 border-t border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Community Rated</h3>
                            <p className="text-slate-400 text-sm">All ratings based on real user feedback and engagement</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Quality Verified</h3>
                            <p className="text-slate-400 text-sm">Every video manually reviewed for quality and authenticity</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Updated Daily</h3>
                            <p className="text-slate-400 text-sm">Rankings refreshed daily based on latest user activity</p>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
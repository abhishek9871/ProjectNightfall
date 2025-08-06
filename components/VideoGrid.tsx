import React, { useMemo, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import { Categories } from './Categories';
import { Pagination } from './Pagination';
import { videos } from '../data/videos';
import { PageType } from '../App';
import { Video } from '../types';
import { MasterAdSlot } from './ads/MasterAdSlot';
import { NativeAdCard } from './NativeAdCard';

interface VideoGridProps {
    currentPage: PageType;
    searchQuery: string;
    onVideoCardClick: (video: Video) => void;
    currentPageNum: number;
    onPageChange: (page: number) => void;
    totalVideos: number;
}

export function VideoGrid({ currentPage, searchQuery, onVideoCardClick, currentPageNum, onPageChange, totalVideos }: VideoGridProps): React.ReactNode {
    // If we're on categories page, use the Categories component
    if (currentPage === 'categories') {
        return <Categories searchQuery={searchQuery} onVideoCardClick={onVideoCardClick} />;
    }

    // Pagination constants
    const VIDEOS_PER_PAGE = 24;

    // Log total video count for verification
    console.log(`Total videos loaded: ${videos.length}`);

    // Layout error detection for Opera/Edge
    useEffect(() => {
        const checkLayoutOverflow = () => {
            if (document.documentElement.scrollWidth > window.innerWidth) {
                // GA4 event tracking for layout error
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'layout_error', {
                        browser: navigator.userAgent,
                        path: location.pathname,
                        viewport_width: window.innerWidth,
                        scroll_width: document.documentElement.scrollWidth
                    });
                }
                console.warn('Layout overflow detected - Opera/Edge compatibility issue');
            }
        };

        // Check after render
        const timeoutId = setTimeout(checkLayoutOverflow, 100);

        // Check on resize
        window.addEventListener('resize', checkLayoutOverflow);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkLayoutOverflow);
        };
    }, [currentPage, searchQuery]);

    const filteredVideos = useMemo(() => {
        let filtered = [...videos];

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(video =>
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                video.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by page type
        switch (currentPage) {
            case 'trending':
                // Sort by recent upload date AND views for trending
                filtered.sort((a, b) => {
                    const dateA = new Date(a.uploadDate).getTime();
                    const dateB = new Date(b.uploadDate).getTime();
                    const getViews = (viewStr: string) => {
                        const match = viewStr.match(/(\d+\.?\d*)(K|M)/);
                        if (!match) return 0;
                        const num = parseFloat(match[1]);
                        const unit = match[2];
                        return unit === 'M' ? num * 1000000 : num * 1000;
                    };

                    // Combine recency and popularity for trending score
                    const scoreA = (dateA / 1000000) + getViews(a.views);
                    const scoreB = (dateB / 1000000) + getViews(b.views);
                    return scoreB - scoreA;
                });
                break;
            case 'top-rated':
                // Sort by rating first, then by views
                filtered.sort((a, b) => {
                    if (b.rating !== a.rating) {
                        return b.rating - a.rating;
                    }
                    const getViews = (viewStr: string) => {
                        const match = viewStr.match(/(\d+\.?\d*)(K|M)/);
                        if (!match) return 0;
                        const num = parseFloat(match[1]);
                        const unit = match[2];
                        return unit === 'M' ? num * 1000000 : num * 1000;
                    };
                    return getViews(b.views) - getViews(a.views);
                });
                break;
            default:
                // Home - show a curated mix (highest rated + most viewed)
                filtered.sort((a, b) => {
                    const getViews = (viewStr: string) => {
                        const match = viewStr.match(/(\d+\.?\d*)(K|M)/);
                        if (!match) return 0;
                        const num = parseFloat(match[1]);
                        const unit = match[2];
                        return unit === 'M' ? num * 1000000 : num * 1000;
                    };

                    // Combine rating and views for featured score
                    const scoreA = (a.rating * 500000) + getViews(a.views);
                    const scoreB = (b.rating * 500000) + getViews(b.views);
                    return scoreB - scoreA;
                });
                break;
        }

        return filtered;
    }, [currentPage, searchQuery]);

    // Calculate paginated videos
    const paginatedVideos = useMemo(() => {
        const startIndex = (currentPageNum - 1) * VIDEOS_PER_PAGE;
        const endIndex = startIndex + VIDEOS_PER_PAGE;
        return filteredVideos.slice(startIndex, endIndex);
    }, [filteredVideos, currentPageNum]);

    const getPageTitle = () => {
        if (searchQuery.trim()) {
            return `Search Results for "${searchQuery}"`;
        }
        switch (currentPage) {
            case 'trending':
                return 'Trending Videos';
            case 'top-rated':
                return 'Top Rated Videos';
            default:
                return 'Featured Videos';
        }
    };

    const getPageDescription = () => {
        switch (currentPage) {
            case 'trending':
                return 'Most popular videos trending right now';
            case 'top-rated':
                return 'Highest rated videos by our community';
            default:
                return 'Hand-picked premium content just for you';
        }
    };

    return (
        <section className="container mx-auto px-4 overflow-x-hidden">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{getPageTitle()}</h2>
                {!searchQuery.trim() && (
                    <p className="text-slate-400">{getPageDescription()}</p>
                )}
            </div>

            {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">No videos found matching your criteria.</p>
                    {searchQuery && (
                        <p className="text-slate-500 mt-2">Try adjusting your search terms.</p>
                    )}
                </div>
            ) : (
                <>
                    {/* Banner ad above video list */}
                    <MasterAdSlot
                        adType="banner"
                        exoClickZoneId="YOUR_EXOCLICK_BANNER_ZONE_ID"
                        popAdsSiteId={1234567} // PopAds doesn't have banners, so this is a placeholder
                    />

                    <div className="continuous-video-grid">
                        {paginatedVideos.map((video, index) => (
                            <React.Fragment key={`item-${video.id}`}>
                                <VideoCard
                                    video={video}
                                    onVideoCardClick={onVideoCardClick}
                                />
                                {/* After every 8th video, insert a Native Ad Card */}
                                {(index + 1) % 8 === 0 && (
                                    <NativeAdCard
                                        widgetZoneId="YOUR_EXOCLICK_NATIVE_ZONE_ID" // CRITICAL: Replace
                                        widgetFormat="1x1" // Standard format for a single ad card
                                    />
                                )}
                                {/* Popunder trigger every 5th video */}
                                {(index + 1) % 5 === 0 && (
                                    <div className="col-span-full my-4">
                                        <MasterAdSlot
                                            adType="popunder"
                                            exoClickZoneId="YOUR_EXOCLICK_POPUNDER_ZONE_ID" // Placeholder
                                            popAdsSiteId={1234567} // Replace with your actual PopAds Site ID
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Ads placed strategically without breaking flow */}
                        {paginatedVideos.length > 8 && (
                            <div className="ad-slot-inline">
                                <MasterAdSlot
                                    adType="popunder"
                                    exoClickZoneId="YOUR_EXOCLICK_POPUNDER_ZONE_ID" // Placeholder
                                    popAdsSiteId={1234567} // Replace with your actual PopAds Site ID
                                />
                            </div>
                        )}
                    </div>

                    {/* Pagination Component */}
                    <Pagination
                        totalItems={filteredVideos.length}
                        itemsPerPage={VIDEOS_PER_PAGE}
                        currentPage={currentPageNum}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </section>
    );
}
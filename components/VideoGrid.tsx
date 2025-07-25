import React, { useMemo, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import { Categories } from './Categories';
import { videos } from '../data/videos';
import { PageType } from '../App';
import AdSlot from './AdSlot';

interface VideoGridProps {
    currentPage: PageType;
    searchQuery: string;
}

export function VideoGrid({ currentPage, searchQuery }: VideoGridProps): React.ReactNode {
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
    
    // If we're on categories page, use the Categories component
    if (currentPage === 'categories') {
        return <Categories searchQuery={searchQuery} />;
    }

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
                    <AdSlot type="banner" network="trafficjunky" />
                    
                    <div className="continuous-video-grid">
                        {filteredVideos.map((video, index) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                        
                        {/* Ads placed strategically without breaking flow */}
                        {filteredVideos.length > 8 && (
                            <div className="ad-slot-inline">
                                <AdSlot type="rectangle" network="hilltopads" />
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
}
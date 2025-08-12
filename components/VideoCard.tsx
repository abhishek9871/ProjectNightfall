import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { getUserCountry, getVideoUrl } from '../utils/geoDetector';

interface VideoCardProps {
    video: Video;
    onVideoCardClick: (video: Video) => void;
}

export const VideoCard = React.memo(({ video }: Omit<VideoCardProps, 'onVideoCardClick'>): React.ReactNode => {
    const [_country, setCountry] = useState<string>('US');
    const preloadIframeRef = useRef<HTMLIFrameElement | null>(null);

    // Extract full title from sourceDescription, fallback to title
    const getFullTitle = (video: Video): string => {
        if (video.sourceDescription) {
            // Remove duration patterns and clean up
            return video.sourceDescription
                .replace(/\s+\d+:\d+\s*$/, '') // Remove "XX:XX" at end
                .replace(/\s+\d+\s+min\s*$/, '') // Remove "XX min" at end
                .trim();
        }
        return video.title;
    };

    const fullTitle = getFullTitle(video);

    // Use provided thumbnail or generate placeholder
    const thumbnailUrl = video.thumbnailUrl || `https://picsum.photos/seed/video${video.id}/400/225`;

    // Initialize geo-detection
    useEffect(() => {
        getUserCountry().then(detectedCountry => {
            setCountry(detectedCountry);
        });
    }, []);

    // Simple preloading - just prefetch the URL without creating iframe
    const handleVideoHover = () => {
        const videoUrl = getVideoUrl(video.embedUrls[0] || '', 0);
        
        // Simple URL prefetch without iframe creation to avoid conflicts
        if (!preloadIframeRef.current) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = videoUrl;
            document.head.appendChild(link);
            preloadIframeRef.current = link as any; // Mark as preloaded
        }
    };

    // Cleanup preload link on unmount
    useEffect(() => {
        return () => {
            if (preloadIframeRef.current && preloadIframeRef.current.parentNode) {
                preloadIframeRef.current.parentNode.removeChild(preloadIframeRef.current);
                preloadIframeRef.current = null;
            }
        };
    }, []);



    const handleCardClick = () => {
        // GA4 event tracking for video play (preserved from original)
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'video_play', {
                video_id: video.id,
                video_title: video.title,
                video_category: video.category
            });
        }
        
        // AGGRESSIVE MONETIZATION: Trigger ad on video interaction
        const videoInteractionEvent = new CustomEvent('video_modal_open', {
            detail: { videoId: video.id, videoTitle: video.title }
        });
        window.dispatchEvent(videoInteractionEvent);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <svg key={i} className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={`half-${video.id}`}>
                                <stop offset="50%" stopColor="currentColor"/>
                                <stop offset="50%" stopColor="transparent"/>
                            </linearGradient>
                        </defs>
                        <path fill={`url(#half-${video.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-3 h-3 text-slate-600" viewBox="0 0 20 20">
                        <path fill="currentColor" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                );
            }
        }
        return stars;
    };

    // Generate enhanced VideoObject schema for SEO
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": fullTitle,
        "description": video.description.substring(0, 200) + "...",
        "thumbnailUrl": thumbnailUrl,
        "uploadDate": video.uploadDate || new Date().toISOString(),
        "duration": `PT${video.duration.replace(':', 'M')}S`,
        "contentUrl": `https://project-nightfall.pages.dev/video/${video.id}`,
        "embedUrl": `https://project-nightfall.pages.dev/video/${video.id}`,
        "genre": video.category,
        "keywords": video.tags.join(', '),
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": video.rating,
            "bestRating": 5,
            "worstRating": 1,
            "ratingCount": Math.floor(Math.random() * 1000) + 100
        },
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": parseInt(video.views.replace('M', '000000').replace('K', '000').replace(',', ''))
        },
        "publisher": {
            "@type": "Organization",
            "name": "Project Nightfall",
            "url": "https://project-nightfall.pages.dev"
        },
        "isFamilyFriendly": false,
        "contentRating": "adult"
    };

    return (
        <>
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
            />
            <Link 
                to={`/watch/${video.id}`}
                className="video-card-container group rounded-lg overflow-hidden bg-slate-900/95 border border-slate-800/50 shadow-md transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40 hover:bg-slate-900 cursor-pointer block h-full"
                onMouseEnter={handleVideoHover}
                onTouchStart={handleVideoHover}
                onClick={handleCardClick}
            >
            <div className="flex flex-col h-full">
                <div className="relative aspect-video bg-slate-900/70 overflow-hidden">
                    <img 
                        src={thumbnailUrl}
                        alt={fullTitle}
                        className="w-full h-full object-cover"
                    />
                    {/* Category badge */}
                    <div className="absolute top-2 left-2 bg-purple-600/95 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                        {video.category}
                    </div>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                        {video.duration}
                    </div>
                </div>
                <div className="p-3 flex flex-col flex-grow">
                    <div className="flex-grow mb-2">
                        <h3 className="font-semibold text-sm text-white group-hover:text-purple-400 transition-colors leading-tight video-title">
                            {fullTitle}
                        </h3>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                            {renderStars(video.rating)}
                        </div>
                        <span className="text-xs text-slate-400">({video.rating})</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-auto">
                        <span className="font-medium">{video.views}</span>
                        <span className="text-purple-400 font-medium">Watch Now</span>
                    </div>
                </div>
            </div>
        </Link>
        </>
    );
});
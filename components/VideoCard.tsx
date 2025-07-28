import React, { useState, useEffect, useRef } from 'react';
import { Video } from '../types';
import { getUserCountry, getVideoUrl } from '../utils/geoDetector';
import { ModalPlayer } from './ModalPlayer';

interface VideoCardProps {
    video: Video;
}

export const VideoCard = React.memo(({ video }: VideoCardProps): React.ReactNode => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [country, setCountry] = useState<string>('US');
    const preloadIframeRef = useRef<HTMLIFrameElement | null>(null);

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
        setIsModalOpen(true);
        
        // GA4 event tracking for video play (preserved from original)
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'video_play', {
                video_id: video.id,
                video_title: video.title,
                video_category: video.category
            });
        }
    };

    // Modal handlers
    const handleModalClose = () => {
        setIsModalOpen(false);
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

    // Generate VideoObject schema for SEO (enhanced for modal)
    const currentEmbedUrl = video.embedUrls[0]?.replace('xvideos.com', country === 'IN' ? 'xvideos4.com' : 'xvideos.com') || video.embedUrls[0];
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": video.title,
        "description": `High-quality adult video in ${video.category} category`,
        "thumbnailUrl": thumbnailUrl,
        "uploadDate": video.uploadDate || new Date().toISOString(),
        "duration": video.duration,
        "contentUrl": currentEmbedUrl,
        "embedUrl": window.location.href, // Page URL for modal context
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": parseInt(video.views.replace('M', '000000').replace('K', '000').replace(',', ''))
        }
    };

    return (
        <>
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
            />
            <ModalPlayer 
                video={video}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
            <div 
                className="video-card-container group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 transform hover:-translate-y-1 cursor-pointer w-full"
                onMouseEnter={handleVideoHover}
                onTouchStart={handleVideoHover}
            >
            <div className="relative aspect-video bg-slate-900/70 overflow-hidden" onClick={handleCardClick}>
                <img 
                    src={thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Category badge */}
                <div className="absolute top-2 left-2 bg-purple-600/90 text-white text-xs px-2 py-1 rounded">
                    {video.category}
                </div>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-base text-white truncate group-hover:text-purple-400 transition-colors mb-2">
                    {video.title}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        {renderStars(video.rating)}
                    </div>
                    <span className="text-xs text-slate-400">({video.rating})</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>{video.views}</span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (navigator.share) {
                                    navigator.share({
                                        title: video.title,
                                        url: window.location.href
                                    });
                                } else {
                                    // Fallback: copy to clipboard
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }
                            }}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                            title="Share video"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                            </svg>
                        </button>
                        <span className="text-purple-400">Click for modal</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
});
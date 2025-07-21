import React, { useState } from 'react';
import { Video } from '../types';

interface VideoCardProps {
    video: Video;
}

export function VideoCard({ video }: VideoCardProps): React.ReactNode {
    const [imageError, setImageError] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

    // Generate a placeholder thumbnail URL based on video ID
    const thumbnailUrl = `https://picsum.photos/seed/video${video.id}/400/225`;

    const handleCardClick = () => {
        setShowPlayer(true);
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

    return (
        <div className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 transform hover:-translate-y-1 cursor-pointer">
            <div className="relative aspect-video bg-black" onClick={handleCardClick}>
                {!showPlayer ? (
                    <>
                        <img 
                            src={thumbnailUrl}
                            alt={video.title}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            onError={() => setImageError(true)}
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
                    </>
                ) : (
                    <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={video.embedUrl}
                        title={video.title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox">
                    </iframe>
                )}
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
                    <span className="text-purple-400">Click to play</span>
                </div>
            </div>
        </div>
    );
}
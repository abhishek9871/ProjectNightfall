import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Video } from '../types';
import { getVideoUrl, detectCountry, hasMoreMirrorDomains } from '../utils/geoDetector';
import { getEmbedUrl, getFallbackUrl, isJio } from '../src/utils/networkDetection';
import { useLockBodyScroll } from '@custom-react-hooks/use-lock-body-scroll';

interface ModalPlayerProps {
    video: Video;
    isOpen: boolean;
    onClose: () => void;
}

export function ModalPlayer({ video, isOpen, onClose }: ModalPlayerProps): React.ReactNode {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showError, setShowError] = useState(false);
    const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionStartTime, setSessionStartTime] = useState<number>(0);
    const [domainAttempt, setDomainAttempt] = useState(0);
    const [currentSrc, setCurrentSrc] = useState<string>('');
    const [useNetworkDetection, setUseNetworkDetection] = useState(false);
    const [networkType, setNetworkType] = useState<'jio' | 'airtel' | 'global' | 'unknown'>('unknown');

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when modal is open (Opera/Edge fix)
    useLockBodyScroll(isOpen);

    // Get country synchronously to prevent race conditions
    const country = detectCountry();

    // Debug logging for Indian users with network detection status
    if (country === 'IN') {
        const originalUrl = video.embedUrls[currentIdx] || video.embedUrls[0];
        console.log('🇮🇳 Indian user detected');
        console.log('📍 Domain attempt:', domainAttempt);
        console.log('🔗 Original URL:', originalUrl);
        console.log('🌐 Network type:', networkType);
        console.log('🔍 Using network detection:', useNetworkDetection);
        console.log('📱 Current src:', currentSrc);
    }



    // Initialize modal when it opens
    useEffect(() => {
        if (isOpen) {
            // Track session start time
            setSessionStartTime(Date.now());

            // GA4 event tracking for modal open
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'video_modal_open', {
                    video_id: video.id,
                    video_title: video.title,
                    video_category: video.category,
                    country: country,
                    network_type: networkType
                });
            }
        }
    }, [isOpen, currentIdx]);

    // Cleanup on modal close or unmount
    useEffect(() => {
        return () => {
            if (loadTimeout) {
                clearTimeout(loadTimeout);
            }
        };
    }, []);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIdx(0);
            setDomainAttempt(0);
            setShowError(false);
            setIsLoading(true);
            video.validated = false;

            // Simple timeout for iframe loading - same for mobile and desktop
            const timeout = setTimeout(() => {
                if (!video.validated) {
                    handleEmbedError();
                }
            }, 10000); // 10 second timeout
            setLoadTimeout(timeout);
        } else {
            // Track session duration when modal closes
            if (sessionStartTime > 0) {
                const sessionDuration = (Date.now() - sessionStartTime) / 1000;
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'video_session_duration', {
                        video_id: video.id,
                        session_duration: sessionDuration,
                        country: country
                    });
                }
            }
            setSessionStartTime(0);
        }
    }, [isOpen]);

    const handleEmbedLoad = () => {
        video.validated = true;
        setIsLoading(false);
        if (loadTimeout) {
            clearTimeout(loadTimeout);
            setLoadTimeout(null);
        }

        // GA4 event tracking for successful embed
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'embed_success', {
                video_id: video.id,
                country: country,
                network_type: networkType,
                url_index: currentIdx,
                modal_context: true,
                used_network_detection: useNetworkDetection
            });
        }
    };

    const handleEmbedError = async () => {
        if (loadTimeout) {
            clearTimeout(loadTimeout);
            setLoadTimeout(null);
        }

        console.log('🚨 Modal embed fallback triggered for video:', video.id, 'URL index:', currentIdx, 'Domain attempt:', domainAttempt, 'Network type:', networkType);

        // If network detection was used and failed, fall back to geo-detection system
        if (useNetworkDetection && domainAttempt === 0) {
            console.log('🔄 Network detection failed - Falling back to geo-detection system');
            setUseNetworkDetection(false);
            setDomainAttempt(0);
            setIsLoading(true);
            return;
        }

        // For Indian users using geo-detection, try different mirror domains
        if (country === 'IN' && !useNetworkDetection && hasMoreMirrorDomains(domainAttempt + 1)) {
            console.log('🔄 Trying next mirror domain for Indian user...');
            setDomainAttempt(domainAttempt + 1);
            setIsLoading(true);
            return;
        }

        // Reset domain attempt and try next URL in array if available
        if (currentIdx + 1 < video.embedUrls.length) {
            console.log('🔄 Trying next video URL...');
            setCurrentIdx(currentIdx + 1);
            setDomainAttempt(0);
            setUseNetworkDetection(false); // Reset network detection for new URL
            setIsLoading(true);
        } else {
            // All URLs and domains failed, show error overlay
            console.log('❌ All fallback options exhausted');
            setShowError(true);
            setIsLoading(false);

            // GA4 event tracking for final failure
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'embed_failure', {
                    video_id: video.id,
                    country: country,
                    network_type: networkType,
                    total_attempts: video.embedUrls.length,
                    domain_attempts: domainAttempt + 1,
                    modal_context: true
                });
            }
        }
    };

    const handleRetry = () => {
        console.log('🔄 User initiated retry');
        setCurrentIdx(0);
        setDomainAttempt(0);
        setShowError(false);
        setIsLoading(true);
        setUseNetworkDetection(false); // Reset network detection on retry
        setNetworkType('unknown');
        video.validated = false;

        // Clear any existing timeout
        if (loadTimeout) {
            clearTimeout(loadTimeout);
            setLoadTimeout(null);
        }

        // Set timeout guard for retry
        const retryTimeout = setTimeout(() => {
            if (!video.validated) {
                console.log('⏰ Retry timeout reached, showing error again');
                handleEmbedError();
            }
        }, 12000); // 12 second timeout for retry
        setLoadTimeout(retryTimeout);
    };

    const handleClose = () => {
        // Track session duration before closing
        if (sessionStartTime > 0) {
            const sessionDuration = (Date.now() - sessionStartTime) / 1000;
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'video_modal_close', {
                    video_id: video.id,
                    session_duration: sessionDuration,
                    country: country
                });
            }
        }

        // Reset iframe to blank to stop video and free resources
        setCurrentSrc('about:blank');

        onClose();
    };

    // Smart URL generation: Network detection for Indian users, geo-detection fallback
    React.useEffect(() => {
        if (isOpen) {
            const setupVideoUrl = async () => {
                const originalUrl = video.embedUrls[currentIdx] || video.embedUrls[0];
                const videoId = originalUrl.split('/').pop();
                
                console.log('🎬 Setting up video for currentIdx:', currentIdx, 'domainAttempt:', domainAttempt);
                console.log('📹 Original URL:', originalUrl);
                
                // For Indian users, try network detection first
                if (country === 'IN' && domainAttempt === 0 && !useNetworkDetection) {
                    try {
                        console.log('🇮🇳 Indian user - Attempting network detection...');
                        const networkUrl = await getEmbedUrl(videoId || '');
                        
                        // Determine network type for analytics
                        if (networkUrl.includes('proxy')) {
                            setNetworkType('jio');
                            console.log('📡 Jio network detected - Using proxy routing');
                        } else if (networkUrl.includes('xvideos4.com')) {
                            setNetworkType('airtel');
                            console.log('📶 Airtel/other network - Using direct mirror');
                        }
                        
                        setUseNetworkDetection(true);
                        setCurrentSrc(networkUrl);
                        return;
                    } catch (error) {
                        console.log('⚠️ Network detection failed, falling back to geo-detection:', error);
                        setNetworkType('unknown');
                    }
                }
                
                // Fallback to existing geo-detection system (maintains current functionality)
                const processedUrl = getVideoUrl(originalUrl, domainAttempt);
                console.log('🌍 Using geo-detection URL:', processedUrl);
                
                if (country !== 'IN') {
                    setNetworkType('global');
                }
                
                setCurrentSrc(processedUrl);
            };
            
            setupVideoUrl();
        } else {
            setCurrentSrc('about:blank');
            setUseNetworkDetection(false);
            setNetworkType('unknown');
        }
    }, [isOpen, currentIdx, domainAttempt, country, useNetworkDetection]);



    // Use clean embed URL without potentially conflicting parameters
    const currentEmbedUrl = currentSrc;

    return (
        <Transition
            appear
            show={isOpen}
            as={Fragment}
            beforeLeave={() => {
                // Ensure body scroll is restored on modal close (Headless UI bug workaround)
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }}
        >
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl transition-all">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                                    <div className="flex-1">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold text-white text-left truncate pr-4"
                                        >
                                            {video.title}
                                        </Dialog.Title>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                                            <span>{video.views}</span>
                                            <span>•</span>
                                            <span>{video.category}</span>
                                            <span>•</span>
                                            <span>{video.duration}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        onClick={handleClose}
                                        aria-label="Close modal"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Video Player Container */}
                                <div className="relative bg-black" ref={containerRef}>
                                    <div className="aspect-video relative"
                                        style={{
                                            /* Prevent iframe navigation while allowing video controls */
                                            isolation: 'isolate',
                                            /* Mobile-specific touch handling */
                                            touchAction: 'manipulation',
                                            WebkitTouchCallout: 'none',
                                            WebkitUserSelect: 'none',
                                            userSelect: 'none'
                                        }}>
                                        {showError ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm text-white z-20">
                                                <div className="text-center p-6 max-w-sm mx-4 bg-slate-800/90 rounded-xl border border-slate-700 shadow-2xl">
                                                    <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    <h3 className="text-xl font-semibold mb-2 text-white">
                                                        {country === 'IN' ? 'Content Restricted in Your Region' : 'Video temporarily unavailable'}
                                                    </h3>
                                                    <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                                                        {country === 'IN'
                                                            ? 'This content may be restricted by your network provider. Try using a VPN or different network connection.'
                                                            : 'Try refreshing or using a different VPN location'
                                                        }
                                                    </p>
                                                    <button
                                                        onClick={handleRetry}
                                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 font-medium"
                                                    >
                                                        Try Again
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {isLoading && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                                        <div className="flex flex-col items-center">
                                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                                                            <p className="text-white text-sm">Loading video...</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <iframe
                                                    ref={iframeRef}
                                                    key={`${currentIdx}-${domainAttempt}`} // Force re-render on URL or domain change
                                                    className="absolute top-0 left-0 w-full h-full"
                                                    src={currentEmbedUrl}
                                                    title={video.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                                    allowFullScreen
                                                    loading="eager"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals allow-forms allow-presentation allow-top-navigation-by-user-activation"
                                                    onLoad={() => {
                                                        console.log('Iframe loaded for video:', video.id, 'URL:', currentEmbedUrl);
                                                        // Simple loading detection - just mark as loaded when iframe loads
                                                        setTimeout(() => {
                                                            handleEmbedLoad();
                                                        }, 2000); // Give Xvideos player 2 seconds to initialize
                                                    }}
                                                    onError={() => {
                                                        console.log('Iframe error detected, trying fallback...');
                                                        // Use smart fallback based on current URL
                                                        const videoId = video.embedUrls[currentIdx]?.split('/').pop() || video.embedUrls[0]?.split('/').pop();
                                                        if (videoId) {
                                                            const fallbackUrl = getFallbackUrl(videoId, currentSrc);
                                                            setCurrentSrc(fallbackUrl);
                                                        } else {
                                                            handleEmbedError();
                                                        }
                                                    }}
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Footer with Video Info */}
                                <div className="p-4 border-t border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Rating */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }, (_, i) => {
                                                        const rating = video.rating;
                                                        const fullStars = Math.floor(rating);
                                                        const hasHalfStar = rating % 1 >= 0.5;

                                                        if (i < fullStars) {
                                                            return (
                                                                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                                </svg>
                                                            );
                                                        } else if (i === fullStars && hasHalfStar) {
                                                            return (
                                                                <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
                                                                    <defs>
                                                                        <linearGradient id={`modal-half-${video.id}`}>
                                                                            <stop offset="50%" stopColor="currentColor" />
                                                                            <stop offset="50%" stopColor="transparent" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                    <path fill={`url(#modal-half-${video.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                                </svg>
                                                            );
                                                        } else {
                                                            return (
                                                                <svg key={i} className="w-4 h-4 text-slate-600" viewBox="0 0 20 20">
                                                                    <path fill="currentColor" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                                </svg>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                                <span className="text-sm text-slate-400">({video.rating})</span>
                                            </div>
                                        </div>

                                        {/* Share Button */}
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
                                                    // Could add toast notification here
                                                }
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                            title="Share video"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                            </svg>
                                            <span className="text-sm">Share</span>
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Plyr from 'plyr';
import { Video } from '../types';
import { getUserCountry } from '../utils/geoDetector';
import { useLockBodyScroll } from '@custom-react-hooks/use-lock-body-scroll';

interface ModalPlayerProps {
    video: Video;
    isOpen: boolean;
    onClose: () => void;
}

export function ModalPlayer({ video, isOpen, onClose }: ModalPlayerProps): React.ReactNode {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showError, setShowError] = useState(false);
    const [country, setCountry] = useState<string>('US');
    const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionStartTime, setSessionStartTime] = useState<number>(0);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const plyrRef = useRef<Plyr | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

    // Lock body scroll when modal is open (Opera/Edge fix)
    useLockBodyScroll(isOpen);

    // Initialize geo-detection
    useEffect(() => {
        getUserCountry().then(detectedCountry => {
            setCountry(detectedCountry);
        });
    }, []);

    // Initialize Plyr when modal opens
    useEffect(() => {
        if (isOpen && iframeRef.current && !plyrRef.current) {
            // Add message listener to prevent navigation attempts from iframe (desktop & mobile)
            const handleMessage = (event: MessageEvent) => {
                // Block navigation messages from Xvideos
                if (event.origin.includes('xvideos') || event.origin.includes('xvideos4')) {
                    if (event.data && typeof event.data === 'string') {
                        // Block common navigation messages
                        if (event.data.includes('navigate') ||
                            event.data.includes('redirect') ||
                            event.data.includes('location') ||
                            event.data.includes('href') ||
                            event.data.includes('window.open') ||
                            event.data.includes('_blank')) {
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        }
                    }
                }
            };

            messageHandlerRef.current = handleMessage;
            window.addEventListener('message', handleMessage);

            // Add mobile-specific touch event prevention for iframe container
            const iframe = iframeRef.current;
            if (iframe) {
                // Prevent mobile context menu and long-press navigation
                iframe.addEventListener('contextmenu', (e) => e.preventDefault());
                iframe.addEventListener('touchstart', (e) => {
                    // Allow normal video controls but prevent navigation gestures
                    if (e.touches.length > 1) {
                        e.preventDefault(); // Prevent pinch/zoom that might trigger navigation
                    }
                }, { passive: false });

                // Prevent mobile drag-to-navigate
                iframe.addEventListener('dragstart', (e) => e.preventDefault());
                iframe.addEventListener('selectstart', (e) => e.preventDefault());
            }

            // Lazy load Plyr only when modal opens
            const initPlyr = async () => {
                try {
                    // Initialize Plyr with iframe
                    plyrRef.current = new Plyr(iframeRef.current!, {
                        controls: [
                            'play-large',
                            'play',
                            'progress',
                            'current-time',
                            'duration',
                            'mute',
                            'volume',
                            'fullscreen'
                        ],
                        settings: ['quality', 'speed'],
                        keyboard: { focused: true, global: false },
                        tooltips: { controls: true, seek: true },
                        captions: { active: false },
                        hideControls: false,
                        clickToPlay: true,
                        disableContextMenu: true
                    });

                    // Track session start time
                    setSessionStartTime(Date.now());

                    // GA4 event tracking for modal open
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'video_modal_open', {
                            video_id: video.id,
                            video_title: video.title,
                            video_category: video.category,
                            country: country
                        });
                    }

                    // Set up Plyr event listeners
                    plyrRef.current.on('ready', () => {
                        setIsLoading(false);
                        handleEmbedLoad();
                    });

                    plyrRef.current.on('error', () => {
                        handleEmbedError();
                    });

                    plyrRef.current.on('timeupdate', () => {
                        // Track watch time periodically
                        const currentTime = plyrRef.current?.currentTime || 0;
                        if (currentTime > 0 && currentTime % 30 === 0) { // Every 30 seconds
                            if (typeof window !== 'undefined' && (window as any).gtag) {
                                (window as any).gtag('event', 'video_watch_time', {
                                    video_id: video.id,
                                    watch_duration: currentTime,
                                    country: country
                                });
                            }
                        }
                    });

                } catch (error) {
                    console.error('Plyr initialization failed:', error);
                    setIsLoading(false);
                }
            };

            initPlyr();
        }
    }, [isOpen, currentIdx]);

    // Cleanup on modal close or unmount
    useEffect(() => {
        return () => {
            if (plyrRef.current) {
                // Track total session duration before cleanup
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

                plyrRef.current.destroy();
                plyrRef.current = null;
            }
            if (loadTimeout) {
                clearTimeout(loadTimeout);
            }

            // Clean up message listener and mobile event handlers
            if (messageHandlerRef.current) {
                window.removeEventListener('message', messageHandlerRef.current);
                messageHandlerRef.current = null;
            }

            // Clean up mobile-specific event listeners
            const iframe = iframeRef.current;
            if (iframe) {
                iframe.removeEventListener('contextmenu', (e) => e.preventDefault());
                iframe.removeEventListener('dragstart', (e) => e.preventDefault());
                iframe.removeEventListener('selectstart', (e) => e.preventDefault());
            }
        };
    }, []);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIdx(0);
            setShowError(false);
            setIsLoading(true);
            video.validated = false;

            // Set timeout guard for stalled loads - increased timeout for mobile
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const timeoutDuration = isMobileDevice ? 20000 : 15000; // 20s for mobile, 15s for desktop

            const timeout = setTimeout(() => {
                // Only trigger error if iframe hasn't loaded AND no video events detected
                if (!video.validated && iframeRef.current) {
                    // Check if iframe has actually loaded content
                    try {
                        const iframe = iframeRef.current;
                        // If iframe has loaded but video.validated is still false, give it more time
                        if (iframe.contentWindow) {
                            console.log('Iframe loaded but video not validated, extending timeout...');
                            // Give additional time for video to initialize
                            const extendedTimeout = setTimeout(() => {
                                if (!video.validated) {
                                    handleEmbedError();
                                }
                            }, 10000); // Additional 10 seconds
                            setLoadTimeout(extendedTimeout);
                            return;
                        }
                    } catch (e) {
                        // Cross-origin access error is expected, continue with error handling
                    }
                    handleEmbedError();
                }
            }, timeoutDuration);
            setLoadTimeout(timeout);
        } else {
            // Cleanup when modal closes
            if (plyrRef.current) {
                // Track session duration
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

                plyrRef.current.destroy();
                plyrRef.current = null;
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
                url_index: currentIdx,
                modal_context: true
            });
        }
    };

    const handleEmbedError = () => {
        if (loadTimeout) {
            clearTimeout(loadTimeout);
            setLoadTimeout(null);
        }

        console.log('Modal embed fallback triggered for video:', video.id, 'URL index:', currentIdx);

        // Try next URL in array if available
        if (currentIdx + 1 < video.embedUrls.length) {
            setCurrentIdx(currentIdx + 1);
            setIsLoading(true);

            // Destroy and recreate Plyr for new URL
            if (plyrRef.current) {
                plyrRef.current.destroy();
                plyrRef.current = null;
            }
        } else {
            // All URLs failed, show error overlay
            setShowError(true);
            setIsLoading(false);

            // GA4 event tracking for final failure
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'embed_failure', {
                    video_id: video.id,
                    country: country,
                    total_attempts: video.embedUrls.length,
                    modal_context: true
                });
            }
        }
    };

    const handleRetry = () => {
        setCurrentIdx(0);
        setShowError(false);
        setIsLoading(true);
        video.validated = false;

        // Destroy existing Plyr instance
        if (plyrRef.current) {
            plyrRef.current.destroy();
            plyrRef.current = null;
        }

        // Clear any existing timeout
        if (loadTimeout) {
            clearTimeout(loadTimeout);
            setLoadTimeout(null);
        }

        // Set timeout guard for retry with longer duration
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const retryTimeout = setTimeout(() => {
            if (!video.validated) {
                console.log('Retry timeout reached, showing error again');
                handleEmbedError();
            }
        }, isMobileDevice ? 25000 : 18000); // Even longer timeout for retry
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
        onClose();
    };

    // Generate current embed URL with geo-detection and navigation prevention
    const baseUrl = video.embedUrls[currentIdx]?.replace(
        'xvideos.com',
        country === 'IN' ? 'xvideos4.com' : 'xvideos.com'
    ) || video.embedUrls[0];

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Add parameters to prevent navigation and keep user on our site (enhanced for mobile)
    const mobileParams = isMobile ? '&playsinline=1&controls=1&disablekb=1' : '';
    const currentEmbedUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}autoplay=0&rel=0&modestbranding=1${mobileParams}`;

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
                                                    <h3 className="text-xl font-semibold mb-2 text-white">Video temporarily unavailable</h3>
                                                    <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                                                        Try refreshing or using a different VPN location
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
                                                    key={currentIdx} // Force re-render on URL change
                                                    className="absolute top-0 left-0 w-full h-full"
                                                    src={currentEmbedUrl}
                                                    title={video.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                    loading="eager"
                                                    onLoad={(e) => {
                                                        // Enhanced load detection for mobile
                                                        const iframe = e.currentTarget;

                                                        // Set a small delay to ensure content is actually loaded
                                                        setTimeout(() => {
                                                            try {
                                                                // Try to access iframe properties to confirm it's loaded
                                                                if (iframe.contentWindow || iframe.contentDocument) {
                                                                    handleEmbedLoad();
                                                                } else {
                                                                    // If we can't access content, wait a bit more
                                                                    setTimeout(() => {
                                                                        handleEmbedLoad();
                                                                    }, 2000);
                                                                }
                                                            } catch (error) {
                                                                // Cross-origin error is expected, assume loaded
                                                                handleEmbedLoad();
                                                            }
                                                        }, 1000); // 1 second delay for mobile
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null; // Prevent looping
                                                        console.log('Iframe error detected, trying fallback...');
                                                        handleEmbedError();
                                                    }}
                                                    sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                                                    referrerPolicy="no-referrer"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        touchAction: 'manipulation', // Mobile: prevent double-tap zoom
                                                        userSelect: 'none', // Prevent text selection on mobile
                                                        WebkitUserSelect: 'none',
                                                        msUserSelect: 'none'
                                                    }}
                                                    onContextMenu={(e) => e.preventDefault()} // Prevent right-click/long-press menu
                                                    onDragStart={(e) => e.preventDefault()} // Prevent drag on mobile
                                                />
                                                {/* Mobile-specific touch overlay to prevent unwanted navigation */}
                                                <div
                                                    className="absolute inset-0 pointer-events-none"
                                                    style={{ zIndex: 10 }}
                                                    onTouchStart={(e) => {
                                                        // Allow single touches for video controls
                                                        if (e.touches.length === 1) {
                                                            return; // Allow normal touch
                                                        }
                                                        // Prevent multi-touch gestures that might trigger navigation
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    onTouchMove={(e) => {
                                                        // Prevent swipe gestures that might navigate away
                                                        const touch = e.touches[0];
                                                        if (touch) {
                                                            const deltaX = Math.abs(touch.clientX - (touch.target as any).startX || 0);
                                                            const deltaY = Math.abs(touch.clientY - (touch.target as any).startY || 0);

                                                            // If it's a large swipe gesture, prevent it
                                                            if (deltaX > 50 || deltaY > 50) {
                                                                e.preventDefault();
                                                            }
                                                        }
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
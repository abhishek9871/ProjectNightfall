import { useState, useEffect } from 'react';
import './VideoOverlayAd.css'; // Import our dedicated stylesheet

interface VideoOverlayAdProps {
    adHtml: string;
    delaySeconds?: number;
}

export function VideoOverlayAd({ adHtml, delaySeconds = 15 }: VideoOverlayAdProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delaySeconds * 1000);

        return () => clearTimeout(timer);
    }, [delaySeconds]);

    const handleClose = () => {
        setIsDismissed(true);

        // Optional: Send GA4 event for ad dismissal
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ad_dismiss', {
                ad_platform: 'Adsterra',
                ad_format: 'overlay',
            });
        }
    };

    if (isDismissed) {
        return null; // Don't render anything if the user has closed it
    }

    return (
        <div className={`video-overlay-ad-container ${isVisible ? 'visible' : ''}`}>
            <button
                onClick={handleClose}
                className="overlay-close-button"
                aria-label="Close Ad"
            >
                &times;
            </button>
            <div
                className="overlay-ad-content"
                dangerouslySetInnerHTML={{ __html: adHtml }}
            />
        </div>
    );
}
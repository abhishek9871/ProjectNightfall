import { useState, useEffect } from 'react';

interface InterstitialAdProps {
    adZoneId: string;
    onAdClosed: () => void;
}

export function InterstitialAd({ adZoneId, onAdClosed }: InterstitialAdProps) {
    const [countdown, setCountdown] = useState(5);
    const [isSkippable, setIsSkippable] = useState(false);

    useEffect(() => {
        // Countdown timer logic
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsSkippable(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Fire impression event as soon as the component mounts
        if (window.gtag) {
            window.gtag('event', 'ad_impression', {
                ad_platform: 'Adsterra',
                ad_format: 'interstitial',
            });
        }

        return () => clearInterval(timer);
    }, []);

    const handleSkip = () => {
        if (window.gtag) {
            window.gtag('event', 'ad_skipped', {
                ad_platform: 'Adsterra',
                ad_format: 'interstitial',
            });
        }
        onAdClosed();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* Adsterra ad code goes here */}
            <div
                dangerouslySetInnerHTML={{
                    __html: `<!-- Adsterra ad code for zone ${adZoneId} -->`
                }}
            />

            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                color: 'white'
            }}>
                {isSkippable ? (
                    <button
                        onClick={handleSkip}
                        style={{
                            background: '#333',
                            color: 'white',
                            border: '1px solid white',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            borderRadius: '5px'
                        }}
                    >
                        Skip Ad
                    </button>
                ) : (
                    <span style={{
                        background: '#333',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px'
                    }}>
                        You can skip in {countdown}s
                    </span>
                )}
            </div>
        </div>
    );
}
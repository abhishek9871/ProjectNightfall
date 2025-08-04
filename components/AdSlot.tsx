import { useEffect, useRef } from 'react';

// Define the props for our master AdSlot component
interface AdSlotProps {
    adType: 'rectangle' | 'banner' | 'native';
    // We will use specific Zone IDs passed as props for maximum flexibility
    exoClickZoneId: string;
    trafficJunkyZoneId: string;
}

// A map to hold the ad content for different networks and types
const adContentMap = {
    exoclick: {
        rectangle: (zoneId: string) => `<div id="exo-rectangle-${zoneId}"></div>`,
        banner: (zoneId: string) => `<div id="exo-banner-${zoneId}"></div>`,
        native: (zoneId: string) => `<div id="exo-native-${zoneId}"></div>`,
    },
    trafficjunky: {
        rectangle: (zoneId: string) => `<script type="text/javascript" src="//ads.trafficjunky.net/ads?zone_id=${zoneId}&site_id=789012"></script>`,
        banner: (zoneId: string) => `<script type="text/javascript" src="//ads.trafficjunky.net/ads?zone_id=${zoneId}&site_id=789012"></script>`,
        native: (zoneId: string) => `<script type="text/javascript" src="//ads.trafficjunky.net/ads?zone_id=${zoneId}&site_id=789012"></script>`,
    },
};

export function AdSlot({ adType, exoClickZoneId, trafficJunkyZoneId }: AdSlotProps) {
    const adContainerRef = useRef<HTMLDivElement | null>(null);
    const scriptRef = useRef<HTMLScriptElement | null>(null);

    useEffect(() => {
        const container = adContainerRef.current;
        if (!container) return;

        let primaryAdLoaded = false;

        // --- Primary Ad Attempt: ExoClick ---
        const loadExoClickAd = () => {
            // Clean up any previous script
            if (scriptRef.current) {
                scriptRef.current.remove();
            }

            container.innerHTML = adContentMap.exoclick[adType](exoClickZoneId);

            const newScript = document.createElement('script');
            newScript.src = 'https://a.exoclick.com/tag.js';
            newScript.async = true;

            (window as any).AdsByExoClick = (window as any).AdsByExoClick || [];

            newScript.onload = () => {
                (window as any).AdsByExoClick.push({});
                primaryAdLoaded = true;
                
                // Track successful ad load
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'ad_impression', {
                        ad_type: adType,
                        ad_network: 'exoclick',
                        zone_id: exoClickZoneId
                    });
                }
            };

            scriptRef.current = newScript;
            document.head.appendChild(newScript);
        };

        // --- Fallback Ad Attempt: TrafficJunky ---
        const loadTrafficJunkyAd = () => {
            console.log('ExoClick failed or timed out. Falling back to TrafficJunky.');
            
            if (scriptRef.current) {
                scriptRef.current.remove();
            }

            container.innerHTML = adContentMap.trafficjunky[adType](trafficJunkyZoneId);
            
            // Track fallback ad load
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'ad_impression', {
                    ad_type: adType,
                    ad_network: 'trafficjunky',
                    zone_id: trafficJunkyZoneId,
                    fallback: true
                });
            }
        };

        loadExoClickAd();

        // Set a timeout for the fallback
        const fallbackTimeout = setTimeout(() => {
            if (!primaryAdLoaded) {
                loadTrafficJunkyAd();
            }
        }, 5000); // 5-second timeout

        // --- Cleanup Function ---
        return () => {
            clearTimeout(fallbackTimeout);
            if (scriptRef.current) {
                scriptRef.current.remove();
            }
            if (container) {
                container.innerHTML = ''; // Clear contents on unmount
            }
        };

        // Dependencies ensure the ad reloads if the Zone IDs change
    }, [adType, exoClickZoneId, trafficJunkyZoneId]);

    // Add a min-height to prevent layout shift while the ad is loading
    const style = adType === 'rectangle' ? { minHeight: '250px' } : { minHeight: '90px' };

    return (
        <div 
            ref={adContainerRef} 
            style={style} 
            className="w-full flex justify-center items-center bg-slate-800 rounded-lg"
        />
    );
}
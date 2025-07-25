import React, { useEffect } from 'react';

interface AdSlotProps {
    type: 'banner' | 'popunder' | 'rectangle';
    network: 'trafficjunky' | 'hilltopads' | 'backup';
}

const AdSlot: React.FC<AdSlotProps> = ({ type, network }) => {
    // Track ad impression on load
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ad_impression', {
                ad_type: type,
                ad_network: network
            });
        }
    }, [type, network]);
    const getAdScript = () => {
        switch (network) {
            case 'trafficjunky':
                return type === 'banner'
                    ? '<script type="text/javascript" src="//ads.trafficjunky.net/ads?zone_id=123456&site_id=789012"></script>'
                    : '<script type="text/javascript" src="//ads.trafficjunky.net/ads?zone_id=654321&site_id=789012"></script>';
            case 'hilltopads':
                return '<script type="text/javascript" src="//a.hilltopads.com/popunder.js?zone_id=987654"></script>'; // Anti-adblock version
            case 'backup':
                return '<div>Backup Ad Placeholder</div>'; // For Adsterra/JuicyAds
            default:
                return '<div>Ad Loading...</div>';
        }
    };

    return (
        <div className={`ad-${type}`} style={{ margin: '10px 0', textAlign: 'center' }}>
            <div dangerouslySetInnerHTML={{ __html: getAdScript() }} />
        </div>
    );
};

export default AdSlot;
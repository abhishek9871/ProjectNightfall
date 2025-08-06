// components/ads/ExoClickZone.tsx
import React, { useEffect, useState } from 'react';

interface ExoClickZoneProps {
  zoneId: string;
}

export const ExoClickZone: React.FC<ExoClickZoneProps> = ({ zoneId }) => {
  // For ExoClick Banners/Rectangles, we use the API Gateway we already built.
  // This reuses the logic from the now-deleted AdZone.tsx.
  const [adHtml, setAdHtml] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch('/api/get-ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zoneIds: [zoneId] }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result && result[zoneId] && result[zoneId].data.html) {
          setAdHtml(result[zoneId].data.html);
        } else if (result && result[zoneId] && result[zoneId].data.imgurl) {
          const ad = result[zoneId];
          const bannerHtml = `<a href="${ad.data.url}" target="_blank" rel="noopener noreferrer"><img src="${ad.data.imgurl}" alt="Advertisement" style="border:0"/></a>`;
          setAdHtml(bannerHtml);
        }
      } catch (error) {
        console.error("Failed to fetch ExoClick ad:", error);
      }
    };

    fetchAd();
  }, [zoneId]);

  if (!adHtml) return <div style={{ minHeight: '90px' }}></div>; // Placeholder

  return <div dangerouslySetInnerHTML={{ __html: adHtml }} />;
};
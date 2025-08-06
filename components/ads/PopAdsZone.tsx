// components/ads/PopAdsZone.tsx
import React, { useEffect } from 'react';

interface PopAdsZoneProps {
  siteId: number;
  minBid?: number;
  popundersPerIP?: number;
}

declare global {
  interface Window {
    _pop?: any[];
  }
}

export const PopAdsZone: React.FC<PopAdsZoneProps> = ({
  siteId,
  minBid = 0,
  popundersPerIP = 0,
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window._pop = window._pop || [];
    window._pop.push(['siteId', siteId]);
    window._pop.push(['minBid', minBid]);
    window._pop.push(['popundersPerIP', popundersPerIP]);
    window._pop.push(['default', false]);
    window._pop.push(['defaultPerDay', 0]);
    window._pop.push(['topmostLayer', false]);

    const scriptId = `popads-script-${siteId}`;
    if (document.getElementById(scriptId)) return;

    const pa = document.createElement('script');
    pa.id = scriptId;
    pa.type = 'text/javascript';
    pa.async = true;
    pa.src = '//c1.popads.net/pop.js';
    pa.onerror = () => {
      const sa = document.createElement('script');
      sa.type = 'text/javascript';
      sa.async = true;
      sa.src = '//c2.popads.net/pop.js';
      document.head.appendChild(sa);
    };
    document.head.appendChild(pa);
  }, [siteId, minBid, popundersPerIP]);

  // This component is for popunders and does not render any visible UI itself.
  return null;
};
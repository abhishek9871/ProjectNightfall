// components/ads/MasterAdSlot.tsx
import React from 'react';
import { ExoClickZone } from './ExoClickZone';
import { PopAdsZone } from './PopAdsZone';

interface MasterAdSlotProps {
  exoClickZoneId: string;
  popAdsSiteId: number;
  adType: 'banner' | 'popunder'; // To handle different ad types
}

export const MasterAdSlot: React.FC<MasterAdSlotProps> = ({
  exoClickZoneId,
  popAdsSiteId,
  adType,
}) => {
  // Ad Stacking Engine: Display ads from both networks to maximize revenue
  if (adType === 'banner') {
    // For banners, only render ExoClick (PopAds doesn't do banners)
    return <ExoClickZone zoneId={exoClickZoneId} />;
  }

  if (adType === 'popunder') {
    // For popunders, render both ExoClick and PopAds simultaneously
    return (
      <>
        <ExoClickZone zoneId={exoClickZoneId} />
        <PopAdsZone siteId={popAdsSiteId} />
      </>
    );
  }

  return null;
};
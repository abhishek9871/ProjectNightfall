// components/ads/MasterAdSlot.tsx
import React from 'react';
import { useAdExperiment } from '../../src/hooks/useAdExperiment';
import { ExoClickZone } from './ExoClickZone';
import { PopAdsZone } from './PopAdsZone';
import { trackAdImpression } from '../../src/services/AnalyticsService';

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
  const experimentName = `ExoClick-vs-PopAds-${adType}-Test`;
  const variant = useAdExperiment(experimentName);

  React.useEffect(() => {
    if (variant) {
      trackAdImpression(experimentName, variant);
    }
  }, [variant, experimentName]);

  switch (variant) {
    case 'ExoClick':
      // ExoClick can serve both banners and popunders (depending on zone setup)
      // For this test, we assume a banner/rectangle from ExoClick.
      if (adType === 'banner') {
        return <ExoClickZone zoneId={exoClickZoneId} />;
      }
      return null; // Or a specific ExoClick popunder component if needed

    case 'PopAds':
      // PopAds is primarily for popunders.
      if (adType === 'popunder') {
        return <PopAdsZone siteId={popAdsSiteId} />;
      }
      return null;

    default:
      return null;
  }
};
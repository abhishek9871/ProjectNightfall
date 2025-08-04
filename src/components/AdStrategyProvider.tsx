import { useRef } from 'react';
import { useExitIntent } from '../hooks/useExitIntent';
import { shouldShowAd, recordAdImpression } from '../utils/adUtils';
import { initHilltopAds, initPopAds } from '../services/adNetworks';

export function AdStrategyProvider(): React.ReactNode {
  const adAttemptCount = useRef(0);
  const lastAdTime = useRef(0);

  const triggerAdWaterfall = async () => {
    const now = Date.now();
    const timeSinceLastAd = now - lastAdTime.current;

    // AGGRESSIVE MONETIZATION: Allow ads every 3 minutes instead of 12 hours
    const MIN_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds

    // Allow up to 10 ads per session for maximum revenue
    if (adAttemptCount.current >= 10 || timeSinceLastAd < MIN_INTERVAL || !shouldShowAd('hilltop_exit_intent', 0.05)) {
      return;
    }

    adAttemptCount.current++;
    lastAdTime.current = now;

    console.log(`Exit-Intent Detected: Triggering Popunder Waterfall (Attempt ${adAttemptCount.current}/10)...`);

    try {
      console.log('Attempting Primary: HilltopAds...');
      const hilltopResult = await initHilltopAds();
      console.log(hilltopResult);
      recordAdImpression('hilltop_aggressive_ts');
    } catch (hilltopError: any) {
      console.error('HilltopAds Failed:', hilltopError.message);
      console.log('Attempting Fallback: PopAds...');

      try {
        const popAdsResult = await initPopAds();
        console.log(popAdsResult);
        recordAdImpression('popads_aggressive_ts');
      } catch (popAdsError: any) {
        console.error('PopAds Fallback Failed:', popAdsError.message);
      }
    }
  };

  useExitIntent(triggerAdWaterfall);

  return null;
}
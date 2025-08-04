import { useRef, useEffect } from 'react';
import { useExitIntent } from '../hooks/useExitIntent';
import { initHilltopAds, initPopAds } from '../services/adNetworks';
import { recordAdImpression } from '../utils/adUtils';

export function AggressiveAdStrategy(): React.ReactNode {
  const adAttemptCount = useRef(0);
  const lastAdTime = useRef(0);
  const sessionStartTime = useRef(Date.now());

  const triggerAd = async (trigger: string) => {
    const now = Date.now();
    const timeSinceLastAd = now - lastAdTime.current;
    const sessionDuration = now - sessionStartTime.current;
    
    // AGGRESSIVE SETTINGS FOR MAXIMUM REVENUE
    const MIN_INTERVAL = 2 * 60 * 1000; // 2 minutes between ads
    const MAX_ADS_PER_SESSION = 15; // Up to 15 ads per session
    const MIN_SESSION_TIME = 30 * 1000; // Wait 30 seconds after page load
    
    // Check if we can show an ad
    if (
      adAttemptCount.current >= MAX_ADS_PER_SESSION || 
      timeSinceLastAd < MIN_INTERVAL ||
      sessionDuration < MIN_SESSION_TIME
    ) {
      console.log(`Ad blocked: attempts=${adAttemptCount.current}, interval=${timeSinceLastAd}ms, session=${sessionDuration}ms`);
      return;
    }

    adAttemptCount.current++;
    lastAdTime.current = now;
    
    console.log(`🎯 AGGRESSIVE AD TRIGGER: ${trigger} (Attempt ${adAttemptCount.current}/${MAX_ADS_PER_SESSION})`);

    try {
      console.log('🚀 Attempting HilltopAds...');
      const hilltopResult = await initHilltopAds();
      console.log('✅ HilltopAds Success:', hilltopResult);
      recordAdImpression('hilltop_aggressive_ts');
      
      // Track successful ad by trigger type
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'hilltop_ad_success', {
          trigger_type: trigger,
          attempt_number: adAttemptCount.current,
          session_duration: Math.round(sessionDuration / 1000)
        });
      }
    } catch (hilltopError: any) {
      console.error('❌ HilltopAds Failed:', hilltopError.message);
      console.log('🔄 Attempting PopAds Fallback...');
      
      try {
        const popAdsResult = await initPopAds();
        console.log('✅ PopAds Success:', popAdsResult);
        recordAdImpression('popads_aggressive_ts');
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'popads_fallback_success', {
            trigger_type: trigger,
            attempt_number: adAttemptCount.current
          });
        }
      } catch (popAdsError: any) {
        console.error('❌ PopAds Fallback Failed:', popAdsError.message);
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'ad_waterfall_failed', {
            trigger_type: trigger,
            hilltop_error: hilltopError.message,
            popads_error: popAdsError.message
          });
        }
      }
    }
  };

  // MULTIPLE TRIGGER POINTS FOR MAXIMUM REVENUE
  
  // 1. Exit Intent (original)
  useExitIntent(() => triggerAd('exit_intent'));

  // 2. Time-based triggers
  useEffect(() => {
    const timeBasedTriggers = [
      { delay: 45000, name: '45_second_engagement' },    // 45 seconds
      { delay: 120000, name: '2_minute_engagement' },    // 2 minutes
      { delay: 300000, name: '5_minute_engagement' },    // 5 minutes
      { delay: 600000, name: '10_minute_engagement' },   // 10 minutes
    ];

    const timers = timeBasedTriggers.map(({ delay, name }) =>
      setTimeout(() => triggerAd(name), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // 3. Scroll-based trigger
  useEffect(() => {
    let scrollTriggered = false;
    const handleScroll = () => {
      if (scrollTriggered) return;
      
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) { // Trigger when user scrolls 50% down
        scrollTriggered = true;
        triggerAd('scroll_50_percent');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Video interaction trigger
  useEffect(() => {
    const handleVideoInteraction = () => {
      triggerAd('video_interaction');
    };

    // Listen for video modal opens (custom event)
    window.addEventListener('video_modal_open', handleVideoInteraction);
    return () => window.removeEventListener('video_modal_open', handleVideoInteraction);
  }, []);

  // 5. Page visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerAd('tab_return');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return null;
}
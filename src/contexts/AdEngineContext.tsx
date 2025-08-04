import { createContext, useContext, ReactNode, useCallback, useRef } from 'react';
import { shouldShowAd, recordAdImpression } from '../utils/adUtils';

// Define the state for our ad session
interface AdSessionState {
  hasSeenPreRollThisSession: boolean;
  hasSeenInterstitialThisSession: boolean;
}

// Define the context shape
interface AdEngineContextType {
  triggerPreRoll: () => boolean; // Returns true if ad is allowed to show
  triggerPopunder: () => boolean;
  triggerInterstitial: (onSuccess: () => void) => void;
  // We will manage in-page ads (banners/native) locally in VideoGrid for simplicity for now.
}

const AdEngineContext = createContext<AdEngineContextType | undefined>(undefined);

export const AdEngineProvider = ({ children }: { children: ReactNode }) => {
  // Use useRef for session state to prevent re-renders
  const sessionState = useRef<AdSessionState>({
    hasSeenPreRollThisSession: false,
    hasSeenInterstitialThisSession: false,
  });

  const triggerPreRoll = useCallback(() => {
    // Pre-roll can always be triggered, but we flag it in the session state.
    console.log('AdEngine: Pre-roll triggered.');
    sessionState.current.hasSeenPreRollThisSession = true;
    return true;
  }, []);

  const triggerPopunder = useCallback(() => {
    // Master Rule: Popunder is blocked if a Pre-Roll or Interstitial has been seen this session.
    if (sessionState.current.hasSeenPreRollThisSession || sessionState.current.hasSeenInterstitialThisSession) {
      console.log('AdEngine: Popunder blocked (Pre-Roll/Interstitial seen this session).');
      return false;
    }

    // Also check the 12-hour frequency cap from localStorage
    if (!shouldShowAd('ad_waterfall_ts', 12)) {
      console.log('AdEngine: Popunder blocked (12-hour frequency cap).');
      return false;
    }

    console.log('AdEngine: Popunder allowed.');
    recordAdImpression('ad_waterfall_ts');
    return true;
  }, []);

  const triggerInterstitial = useCallback((onSuccess: () => void) => {
    if (sessionState.current.hasSeenInterstitialThisSession) {
      console.log('AdEngine: Interstitial blocked (already seen this session).');
      return;
    }

    console.log('AdEngine: Interstitial triggered.');
    sessionState.current.hasSeenInterstitialThisSession = true;
    onSuccess(); // In a real scenario, this would be called after the ad is shown
  }, []);

  const value = { triggerPreRoll, triggerPopunder, triggerInterstitial };

  return <AdEngineContext.Provider value={value}>{children}</AdEngineContext.Provider>;
};

export const useAdEngine = () => {
  const context = useContext(AdEngineContext);
  if (context === undefined) {
    throw new Error('useAdEngine must be used within an AdEngineProvider');
  }
  return context;
};
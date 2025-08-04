import { useExitIntent } from '../hooks/useExitIntent';
import { useAdEngine } from '../src/contexts/AdEngineContext';
import { initHilltopAds, initPopAds } from '../src/services/adNetworks';

export function AdStrategyProvider(): React.ReactNode {
  const { triggerPopunder } = useAdEngine();

  const executeWaterfall = async () => {
    // First, ask the AdEngine if we are allowed to proceed.
    if (triggerPopunder()) {
      try {
        const hilltopResult = await initHilltopAds();
        console.log(hilltopResult);
      } catch (hilltopError: any) {
        console.error('HilltopAds Failed:', hilltopError.message);
        try {
          const popAdsResult = await initPopAds();
          console.log(popAdsResult);
        } catch (popAdsError: any) {
          console.error('PopAds Fallback Failed:', popAdsError.message);
        }
      }
    }
  };

  useExitIntent(executeWaterfall);

  return null;
}
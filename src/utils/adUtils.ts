/**
 * Checks if an ad should be shown based on a frequency cap stored in localStorage.
 * @param {string} storageKey - The localStorage key for the timestamp.
 * @param {number} hoursLimit - The cooldown period in hours.
 * @returns {boolean} - True if the ad should be shown, false otherwise.
 */
export const shouldShowAd = (storageKey: string = 'ad_waterfall_ts', hoursLimit: number = 12): boolean => {
  // Safety check for server-side rendering environments
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  const now = Date.now();
  const lastTimestampStr = localStorage.getItem(storageKey);

  if (lastTimestampStr) {
    const lastTimestamp = parseInt(lastTimestampStr, 10);
    const elapsedHours = (now - lastTimestamp) / (1000 * 60 * 60);
    return elapsedHours >= hoursLimit;
  }

  return true;
};

/**
 * Updates the timestamp in localStorage after an ad is shown.
 * @param {string} storageKey - The localStorage key for the timestamp.
 */
export const recordAdImpression = (storageKey: string = 'ad_waterfall_ts'): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  
  localStorage.setItem(storageKey, Date.now().toString());
};
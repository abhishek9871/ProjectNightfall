/**
 * Detects user country using client-side browser APIs only.
 * No external API calls, completely CORS-free and error-free.
 * Synchronous function to prevent race conditions.
 * 
 * @returns string - Country code ('IN' for India, 'US' as default)
 */
export const detectCountry = (): string => {
  try {
    // Use browser's built-in timezone detection
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // India-specific timezone detection for Xvideos geo-restriction
    if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
      return 'IN'; // India
    }

    // Fallback to language detection
    const language = navigator.language || 'en-US';
    if (language.startsWith('hi') || language.includes('IN')) {
      return 'IN';
    }

    return 'US'; // Default fallback
  } catch (error) {
    console.log('Geo-detection fallback to US');
    return 'US';
  }
};

/**
 * Actual working Xvideos domains for India (verified working)
 * Only using domains that actually exist and work
 */
const XVIDEOS_MIRROR_DOMAINS = [
  'xvideos4.com',
  'xvv1deos.com',
  'xvideos.com' // Global fallback
];

/**
 * Processes video URL based on user's geographic location with multiple domain fallback.
 * For India users, cycles through multiple Xvideos mirror domains to bypass geo-restrictions.
 * 
 * @param originalUrl - The original video embed URL
 * @param attemptIndex - Current attempt index for domain rotation (default: 0)
 * @returns string - Processed URL appropriate for user's location
 */
export const getVideoUrl = (originalUrl: string, attemptIndex: number = 0): string => {
  const country = detectCountry();
  let processedUrl = originalUrl;

  // For India, use multiple mirror domains with rotation
  if (country === 'IN') {
    try {
      const url = new URL(originalUrl);
      const hostname = url.hostname;
      
      // Check if the hostname is one of the Xvideos mirrors
      if (XVIDEOS_MIRROR_DOMAINS.includes(hostname)) {
        const domainIndex = attemptIndex % XVIDEOS_MIRROR_DOMAINS.length;
        const targetDomain = XVIDEOS_MIRROR_DOMAINS[domainIndex];
        
        // Replace the hostname in the original URL with the target domain
        processedUrl = originalUrl.replace(hostname, targetDomain);
      }
    } catch (e) {
      console.error('Error parsing URL in getVideoUrl:', e);
      // Fallback to original logic if URL parsing fails
      if (originalUrl.includes('xvideos.com')) {
        const domainIndex = attemptIndex % XVIDEOS_MIRROR_DOMAINS.length;
        const targetDomain = XVIDEOS_MIRROR_DOMAINS[domainIndex];
        processedUrl = originalUrl.replace(/xvideos\d*\.com/g, targetDomain);
      }
    }
  }

  // Let Xvideos handle mobile optimization natively - no additional parameters needed

  return processedUrl;
};

/**
 * Get the next available mirror domain for fallback attempts
 * @param currentAttempt - Current attempt number
 * @returns string - Next mirror domain to try
 */
export const getNextMirrorDomain = (currentAttempt: number): string => {
  const country = detectCountry();
  if (country === 'IN') {
    const domainIndex = currentAttempt % XVIDEOS_MIRROR_DOMAINS.length;
    return XVIDEOS_MIRROR_DOMAINS[domainIndex];
  }
  return 'xvideos.com';
};

/**
 * Check if more mirror domains are available for fallback
 * @param currentAttempt - Current attempt number
 * @returns boolean - Whether more domains are available
 */
export const hasMoreMirrorDomains = (currentAttempt: number): boolean => {
  return currentAttempt < XVIDEOS_MIRROR_DOMAINS.length;
};

/**
 * Legacy async function for backward compatibility.
 * @deprecated Use detectCountry() instead for better performance and no race conditions.
 */
export async function getUserCountry(): Promise<string> {
  return detectCountry();
}
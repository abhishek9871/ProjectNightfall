/**
 * Detects if user is on Jio network by testing access to blocked domains
 * Returns true if Jio (blocked), false if other networks (accessible)
 */
export async function isJio(): Promise<boolean> {
  try {
    // Test access to xvideos.com which is blocked on Jio
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    await fetch('https://www.xvideos.com/embedframe/blocked-test', {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // Avoid CORS issues
    });

    clearTimeout(timeoutId);

    // If we get any response, it means the domain is accessible (not Jio)
    return false;
  } catch (error) {
    // Network error or timeout indicates blocking (likely Jio)
    return true;
  }
}

import { detectCountry } from '../../utils/geoDetector';

/**
 * Get the current deployment URL dynamically
 * This ensures proxy URLs work regardless of deployment URL changes
 */
function getCurrentDeploymentUrl(): string {
  if (typeof window !== 'undefined') {
    // Primary: Use the current window location origin (works for any deployment URL)
    return window.location.origin;
  }
  
  // Secondary: Check for environment variable (if available)
  if (typeof process !== 'undefined' && process.env?.VITE_PAGES_URL) {
    return process.env.VITE_PAGES_URL;
  }
  
  // Fallback: Use the base domain (should work for most cases)
  return 'https://project-nightfall.pages.dev';
}

/**
 * Get appropriate embed URL based on network detection
 * Integrates with existing geo-detection system for optimal routing
 */
export async function getEmbedUrl(videoId: string): Promise<string> {
  console.log('🔍 Network detection for videoId:', videoId);

  // First check if user is in India (using existing geo-detection)
  const country = detectCountry();

  if (country !== 'IN') {
    // Non-Indian users: Use global domain directly
    const globalUrl = `https://www.xvideos.com/embedframe/${videoId}`;
    console.log('🌍 Global user - Direct URL:', globalUrl);
    return globalUrl;
  }

  // Indian users: Check if Jio network
  console.log('🇮🇳 Indian user detected - Testing network...');
  const isJioNetwork = await isJio();

  if (isJioNetwork) {
    // Jio users: Route through Cloudflare proxy for optimal performance
    // Use dynamic URL to work with any deployment
    const currentUrl = getCurrentDeploymentUrl();
    const proxyUrl = `${currentUrl}/proxy/${videoId}`;
    console.log('📡 Jio network detected - Current deployment URL:', currentUrl);
    console.log('📡 Using dynamic proxy:', proxyUrl);
    return proxyUrl;
  } else {
    // Airtel/other Indian networks: Use direct mirror domains (current working system)
    const directUrl = `https://www.xvideos4.com/embedframe/${videoId}`;
    console.log('📶 Airtel/other network - Direct mirror:', directUrl);
    return directUrl;
  }
}

/**
 * Get fallback URL when primary fails
 * Smart fallback logic that maintains network-specific routing
 */
export function getFallbackUrl(videoId: string, currentUrl: string): string {
  console.log('🔄 Getting fallback for:', currentUrl);

  if (currentUrl.includes('/proxy/')) {
    // Proxy failed: Try direct mirror domains
    console.log('🔄 Proxy failed - Trying direct mirror');
    return `https://www.xvideos4.com/embedframe/${videoId}`;
  } else if (currentUrl.includes('xvideos4.com')) {
    // First mirror failed: Try second mirror
    console.log('🔄 First mirror failed - Trying second mirror');
    return `https://www.xvv1deos.com/embedframe/${videoId}`;
  } else if (currentUrl.includes('xvv1deos.com')) {
    // Second mirror failed: Try proxy as last resort (dynamic URL)
    console.log('🔄 Second mirror failed - Trying dynamic proxy');
    const currentDeploymentUrl = getCurrentDeploymentUrl();
    const proxyUrl = `${currentDeploymentUrl}/proxy/${videoId}`;
    console.log('🔄 Dynamic proxy URL:', proxyUrl);
    return proxyUrl;
  } else if (currentUrl.includes('xvideos.com')) {
    // Global domain failed: Try Indian mirrors
    console.log('🔄 Global domain failed - Trying Indian mirror');
    return `https://www.xvideos4.com/embedframe/${videoId}`;
  } else {
    // Unknown URL: Default to working mirror
    console.log('🔄 Unknown URL - Using default mirror');
    return `https://www.xvideos4.com/embedframe/${videoId}`;
  }
}
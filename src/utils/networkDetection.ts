/**
 * Detects if user is on Jio network by identifying ISP via ASN
 * More reliable than speed testing - directly identifies the ISP
 * Returns true if Jio, false if other networks (Airtel/Global)
 */
export async function isJio(): Promise<boolean> {
  try {
    console.log('🔍 Detecting ISP via IP lookup...');

    // Step 1: Get user's public IP
    const ipController = new AbortController();
    const ipTimeoutId = setTimeout(() => ipController.abort(), 3000);

    const ipResponse = await fetch('https://api.ipify.org/?format=json', {
      signal: ipController.signal
    });
    clearTimeout(ipTimeoutId);
    const ipData = await ipResponse.json();
    const userIP = ipData.ip;

    console.log('📍 User IP:', userIP);

    // Step 2: Get ISP info via IP lookup
    const ispController = new AbortController();
    const ispTimeoutId = setTimeout(() => ispController.abort(), 3000);

    const ispResponse = await fetch(`https://ipapi.co/${userIP}/json/`, {
      signal: ispController.signal
    });
    clearTimeout(ispTimeoutId);
    const ispData = await ispResponse.json();

    console.log('🏢 ISP Data:', ispData);

    // Step 3: Check if it's Jio based on org/isp name or ASN
    const orgName = (ispData.org || '').toLowerCase();
    const ispName = (ispData.isp || '').toLowerCase();
    const asn = ispData.asn;

    // Jio identifiers
    const isJioByName = orgName.includes('jio') ||
      orgName.includes('reliance') ||
      ispName.includes('jio') ||
      ispName.includes('reliance');

    // Jio ASN numbers (multiple ASNs for different network segments)
    const jioASNs = ['AS55836', 'AS45609', 'AS132335', 55836, 45609, 132335];
    const isJioByASN = jioASNs.includes(asn);

    const isJioNetwork = isJioByName || isJioByASN;

    // Check if it's Airtel for better logging
    const isAirtelByName = orgName.includes('airtel') ||
      orgName.includes('bharti') ||
      ispName.includes('airtel') ||
      ispName.includes('bharti');

    const airtelASNs = ['AS9498', 'AS24560', 9498, 24560];
    const isAirtelByASN = airtelASNs.includes(asn);
    const isAirtelNetwork = isAirtelByName || isAirtelByASN;

    if (isJioNetwork) {
      console.log('📡 Jio network detected - Will use proxy');
      return true;
    } else if (isAirtelNetwork) {
      console.log('📶 Airtel network detected - Will use direct mirrors');
      return false;
    } else {
      console.log('🌐 Other network detected - Will use direct mirrors');
      return false;
    }

  } catch (error: any) {
    console.log('⚠️ ISP detection failed, falling back to speed test method:', error?.message);

    // Fallback: Speed test method for Indian mirror domains
    return await fallbackSpeedTest();
  }
}

/**
 * Fallback method: Test loading speed of Indian mirror domains
 * If slow/timeout = likely Jio throttling, if fast = likely Airtel
 */
async function fallbackSpeedTest(): Promise<boolean> {
  try {
    console.log('🚀 Fallback: Testing Indian mirror domain speed...');

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    await fetch('https://www.xvideos4.com/', {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    });

    clearTimeout(timeoutId);
    const loadTime = Date.now() - startTime;

    console.log(`⏱️ Mirror domain load time: ${loadTime}ms`);

    // If takes >2 seconds, likely Jio throttling
    if (loadTime > 2000) {
      console.log('🐌 Slow loading detected - Likely Jio throttling');
      return true;
    } else {
      console.log('⚡ Fast loading detected - Likely Airtel/Other');
      return false;
    }

  } catch (error: any) {
    console.log('⚠️ Speed test failed, defaulting to Jio (safer for proxy):', error?.message);
    return true; // Default to Jio (proxy) if uncertain
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
    const currentUrl = window.location.origin;
    console.log('🌍 Current deployment URL detected:', currentUrl);
    return currentUrl;
  }

  // Secondary: Check for environment variable (if available)
  if (typeof process !== 'undefined' && process.env?.VITE_PAGES_URL) {
    console.log('🔧 Using environment URL:', process.env.VITE_PAGES_URL);
    return process.env.VITE_PAGES_URL;
  }

  // Fallback: Use the known production domain (migrated to Cloudflare Pages as per FRS.md)
  const fallbackUrl = 'https://project-nightfall.pages.dev';
  console.log('⚠️ Using fallback URL:', fallbackUrl);
  return fallbackUrl;
}

/**
 * Get appropriate embed URL based on network detection
 * Based on the working Version 2.1 implementation from FRS.md
 * Jio users get proxy, Airtel users get direct mirrors, Global users get direct
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

  // Indian users: Check if Jio network (as per original working implementation)
  console.log('🇮🇳 Indian user detected - Testing network...');
  const isJioNetwork = await isJio();

  if (isJioNetwork) {
    // Jio users: Route through Cloudflare proxy for optimal performance
    // Use dynamic URL to work with any deployment
    const currentUrl = getCurrentDeploymentUrl();
    const proxyUrl = `${currentUrl}/proxy/${videoId}`;
    console.log('📡 Jio network detected - Using proxy:', proxyUrl);
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
 * Based on the working Version 2.1 implementation from FRS.md
 * Smart fallback logic that maintains network-specific routing
 */
export function getFallbackUrl(videoId: string, currentUrl: string): string {
  console.log('🔄 Getting fallback for:', currentUrl);

  if (currentUrl.includes('/proxy/')) {
    // Proxy failed: Try direct mirror domains
    console.log('🔄 Proxy failed - Trying direct mirror');
    return `https://www.xvv1deos.com/embedframe/${videoId}`;
  } else if (currentUrl.includes('xvideos4.com')) {
    // First mirror failed: Try second mirror
    console.log('🔄 First mirror failed - Trying second mirror');
    return `https://www.xvv1deos.com/embedframe/${videoId}`;
  } else if (currentUrl.includes('xvv1deos.com')) {
    // Second mirror failed: Try proxy as last resort
    console.log('🔄 Second mirror failed - Trying proxy');
    const currentDeploymentUrl = getCurrentDeploymentUrl();
    return `${currentDeploymentUrl}/proxy/${videoId}`;
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
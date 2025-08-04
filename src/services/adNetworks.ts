// This service provides promise-wrapped functions for loading ad network scripts.

// Extend the Window interface to include ad network globals
declare global {
  interface Window {
    hillpop?: any;
    _pop?: any[];
  }
}

/**
 * Loads the HilltopAds script and returns a Promise.
 * Uses the actual HilltopAds code for zone 6558538.
 * Resolves on successful ad impression, rejects on error or timeout.
 */
export const initHilltopAds = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('HilltopAds timed out after 5 seconds.'));
    }, 5000);

    try {
      // Execute the actual HilltopAds code for zone 6558538
      const hilltopOptions = {
        "scriptSrc": "//loud-student.com/c/DM9o6.be2V5IlbSQWEQ-9BN/jeU/1yOlDQUAzpOjCX0b2ZNaT/Ua4VNsTMMq5U",
        "window": {
          "url": "//loud-student.com/b/3/V.0/PT3ypGvnb/mkVRJ/ZbD-0P2sNnTfUc4HNVTEMx4/LnT/Yq1iNnTUgN1qMzzwk/mKcdnDNPyuYMzD0Uxoc/3jROwi"
        },
        "freq": {
          "qty": 3,
          "period": 3600,
          "scheme": "time",
          "distance": 60,
          "distances": "",
          "pagelim": 0,
          "max": 0,
          "context": "domain",
          "session": false,
          "sessionKeepAliveTime": 0,
          "sessionExpiration": 3600
        },
        "misc": {
          "newTab": true,
          "under": false,
          "coverTags": "iframe"
        },
        "onlyClickable": false
      };

      // Create and inject the HilltopAds script
      const script = document.createElement('script');
      script.innerHTML = `
        (function(options){
          // HilltopAds Zone 6558538 Implementation
          var request = function(n) {
            var scriptElement = document.createElement('script');
            scriptElement.src = n.scriptSrc;
            scriptElement.settings = {};
            scriptElement.settings = n;
            scriptElement.onload = function() {
              if (typeof window.load1spAndCustomPops === 'function') {
                window.load1spAndCustomPops(n);
              }
            };
            var lastScript = document.scripts[document.scripts.length - 1];
            lastScript.parentNode.insertBefore(scriptElement, lastScript);
          };
          request(options);
        })(${JSON.stringify(hilltopOptions)});
      `;

      document.head.appendChild(script);

      // Monitor for successful ad execution
      let checkCount = 0;
      const checkInterval = setInterval(() => {
        checkCount++;

        // Check if HilltopAds has executed successfully
        if (window._pop || document.querySelector('script[src*="loud-student.com"]')) {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          resolve('HilltopAds zone 6558538 loaded successfully.');
          return;
        }

        // Stop checking after 10 attempts (5 seconds)
        if (checkCount >= 10) {
          clearInterval(checkInterval);
        }
      }, 500);

    } catch (error: any) {
      clearTimeout(timeout);
      reject(new Error(`HilltopAds execution failed: ${error.message}`));
    }
  });
};

/**
 * Loads the PopAds script and returns a Promise.
 * Resolves on script load (since it has no success callback), rejects on error.
 */
export const initPopAds = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // PopAds configuration - using a working fallback configuration
    window._pop = window._pop || [];
    window._pop.push(['siteId', 8441928]); // Generic PopAds site ID for fallback
    window._pop.push(['minBid', 0]);
    window._pop.push(['popundersPerIP', 3]); // Allow up to 3 per IP per 24h for aggressive monetization

    const pa = document.createElement('script');
    pa.type = 'text/javascript';
    pa.async = true;
    pa.src = 'https://c1.popads.net/pop.js';

    const timeout = setTimeout(() => {
      reject(new Error('PopAds timed out after 3 seconds.'));
    }, 3000);

    // PopAds doesn't have a success event, so we resolve on successful script load.
    pa.onload = () => {
      clearTimeout(timeout);
      resolve('PopAds script loaded successfully.');
    };

    pa.onerror = () => {
      // Try the fallback CDN on error
      const sa = document.createElement('script');
      sa.type = 'text/javascript';
      sa.async = true;
      sa.src = 'https://c2.popads.net/pop.js';

      sa.onload = () => {
        clearTimeout(timeout);
        resolve('PopAds script loaded successfully from fallback CDN.');
      };
      sa.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Both PopAds CDNs failed to load.'));
      };

      document.head.appendChild(sa);
    };

    document.head.appendChild(pa);
  });
};
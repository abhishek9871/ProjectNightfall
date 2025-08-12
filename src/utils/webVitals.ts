// Core Web Vitals monitoring
export function reportWebVitals() {
  if (typeof window === 'undefined') return;

  // Track LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          metric_name: 'LCP',
          metric_value: Math.round(lastEntry.startTime),
          metric_rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs_improvement' : 'poor'
        });
      }
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Fallback for browsers that don't support LCP
    }

    // Track CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      if (clsValue > 0 && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          metric_name: 'CLS',
          metric_value: Math.round(clsValue * 1000) / 1000,
          metric_rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
        });
      }
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Fallback for browsers that don't support CLS
    }

    // Track FID/INP (First Input Delay / Interaction to Next Paint)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            metric_name: 'FID',
            metric_value: Math.round((entry as any).processingStart - entry.startTime),
            metric_rating: (entry as any).processingStart - entry.startTime < 100 ? 'good' : (entry as any).processingStart - entry.startTime < 300 ? 'needs_improvement' : 'poor'
          });
        }
      }
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Fallback for browsers that don't support FID
    }
  }
}

// Initialize web vitals tracking
if (typeof window !== 'undefined') {
  // Wait for page load to start monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reportWebVitals);
  } else {
    reportWebVitals();
  }
}
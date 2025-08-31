import { Video } from '../../types';

interface ShareEvent {
  id: string;
  videoId: number;
  platform: string;
  timestamp: Date;
  userAgent: string;
  referrer?: string;
  sessionId: string;
}

interface ShareMetrics {
  videoId: number;
  totalShares: number;
  platformBreakdown: Record<string, number>;
  clickThroughRate: number;
  conversionRate: number;
  lastShared: Date;
}

class ShareService {
  private shareEvents: ShareEvent[] = [];
  
  // Generate share URL for a video
  generateShareUrl(videoId: number, platform?: string): string {
    const baseUrl = 'https://project-nightfall.pages.dev/watch';
    const url = `${baseUrl}/${videoId}`;
    
    if (platform) {
      // Add UTM parameters for tracking
      const utmParams = new URLSearchParams({
        utm_source: platform,
        utm_medium: 'share',
        utm_campaign: 'video_sharing'
      });
      return `${url}?${utmParams.toString()}`;
    }
    
    return url;
  }
  
  // Generate optimized thumbnail URL for sharing
  generateOptimizedThumbnailUrl(thumbnailUrl: string): string {
    // For sharing purposes, we want to ensure the image meets platform requirements
    // WhatsApp and Telegram prefer images that are:
    // - At least 300x200 pixels
    // - Less than 5MB
    // - JPEG format when possible
    
    // If we have a thumbnail URL, return it as is
    // In a production environment, you might want to process this to ensure optimal size
    return thumbnailUrl || '';
  }
  
  // Generate Open Graph meta tags for a video
  generateMetaTags(video: Video): Record<string, string> {
    const canonicalUrl = `https://project-nightfall.pages.dev/watch/${video.id}`;
    const metaDescription = video.description.length > 160 
      ? video.description.substring(0, 157) + '...' 
      : video.description;
    
    // Optimize thumbnail for sharing
    const optimizedThumbnail = this.generateOptimizedThumbnailUrl(video.thumbnailUrl || '');
    
    return {
      'og:title': video.title,
      'og:description': metaDescription,
      'og:image': optimizedThumbnail,
      'og:image:width': '1280',
      'og:image:height': '720',
      'og:image:type': 'image/jpeg',
      'og:url': canonicalUrl,
      'og:type': 'video.other',
      'og:video': video.embedUrls[0] || '',
      'og:video:width': '1280',
      'og:video:height': '720',
      'og:video:type': 'text/html',
      'og:site_name': 'Project Nightfall',
      'twitter:card': 'player',
      'twitter:title': video.title,
      'twitter:description': metaDescription,
      'twitter:image': optimizedThumbnail,
      'twitter:player': video.embedUrls[0] || '',
      'twitter:player:width': '1280',
      'twitter:player:height': '720'
    };
  }
  
  // Track share event
  trackShareEvent(videoId: number, platform: string): void {
    const event: ShareEvent = {
      id: Math.random().toString(36).substr(2, 9),
      videoId,
      platform,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: this.getSessionId()
    };
    
    this.shareEvents.push(event);
    
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        video_id: videoId,
        platform: platform,
        event_category: 'engagement',
        event_label: `Shared video ${videoId} on ${platform}`
      });
    }
    
    // Store in localStorage for persistence
    try {
      const events = JSON.parse(localStorage.getItem('shareEvents') || '[]');
      events.push(event);
      localStorage.setItem('shareEvents', JSON.stringify(events.slice(-100))); // Keep last 100 events
    } catch (e) {
      console.error('Failed to store share event in localStorage', e);
    }
  }
  
  // Copy text to clipboard
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
  
  // Check if native share is available
  canUseNativeShare(): boolean {
    return !!(typeof navigator !== 'undefined' && 'share' in navigator && window.isSecureContext);
  }
  
  // Share natively using Web Share API
  async shareNatively(shareData: ShareData): Promise<void> {
    if (!this.canUseNativeShare()) {
      throw new Error('Native share not available');
    }
    
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error('Native share failed:', error);
      throw error;
    }
  }
  
  // Get session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  
  // Get share metrics for a video
  getShareMetrics(videoId: number): ShareMetrics {
    const videoEvents = this.shareEvents.filter(event => event.videoId === videoId);
    
    const platformBreakdown: Record<string, number> = {};
    videoEvents.forEach(event => {
      platformBreakdown[event.platform] = (platformBreakdown[event.platform] || 0) + 1;
    });
    
    return {
      videoId,
      totalShares: videoEvents.length,
      platformBreakdown,
      clickThroughRate: 0, // Would need additional tracking to calculate
      conversionRate: 0, // Would need additional tracking to calculate
      lastShared: videoEvents.length > 0 ? videoEvents[videoEvents.length - 1].timestamp : new Date(0)
    };
  }
  
  // Get all share events
  getShareEvents(): ShareEvent[] {
    return [...this.shareEvents];
  }
}

// Export singleton instance
export const shareService = new ShareService();
import { shareService } from './shareService';
import { Video } from '../../types';

// Mock video data for testing
const mockVideo: Video = {
  id: 1,
  title: 'Test Video',
  embedUrls: ['https://example.com/video1'],
  thumbnailUrl: 'https://example.com/thumbnail1.jpg',
  views: '1.2M',
  duration: '10:30',
  category: 'Test Category',
  rating: 4.5,
  uploadDate: '2023-01-01',
  tags: ['test', 'video'],
  description: 'This is a test video for sharing functionality',
  sourceDescription: 'Test Video 10:30'
};

describe('ShareService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset share events
    // @ts-ignore - accessing private property for testing
    shareService.shareEvents = [];
  });

  describe('generateShareUrl', () => {
    it('should generate a basic share URL', () => {
      const url = shareService.generateShareUrl(1);
      expect(url).toBe('https://project-nightfall.pages.dev/watch/1');
    });

    it('should generate a share URL with UTM parameters', () => {
      const url = shareService.generateShareUrl(1, 'facebook');
      expect(url).toContain('https://project-nightfall.pages.dev/watch/1');
      expect(url).toContain('utm_source=facebook');
      expect(url).toContain('utm_medium=share');
      expect(url).toContain('utm_campaign=video_sharing');
    });
  });

  describe('generateMetaTags', () => {
    it('should generate correct Open Graph meta tags', () => {
      const metaTags = shareService.generateMetaTags(mockVideo);
      
      expect(metaTags['og:title']).toBe(mockVideo.title);
      expect(metaTags['og:description']).toContain('This is a test video');
      expect(metaTags['og:image']).toBe(mockVideo.thumbnailUrl);
      expect(metaTags['og:url']).toBe('https://project-nightfall.pages.dev/watch/1');
      expect(metaTags['og:type']).toBe('video.other');
      expect(metaTags['og:video']).toBe(mockVideo.embedUrls[0]);
    });

    it('should generate correct Twitter Card meta tags', () => {
      const metaTags = shareService.generateMetaTags(mockVideo);
      
      expect(metaTags['twitter:card']).toBe('player');
      expect(metaTags['twitter:title']).toBe(mockVideo.title);
      expect(metaTags['twitter:image']).toBe(mockVideo.thumbnailUrl);
      expect(metaTags['twitter:player']).toBe(mockVideo.embedUrls[0]);
    });
  });

  describe('trackShareEvent', () => {
    it('should track share events', () => {
      // Mock gtag
      window.gtag = jest.fn();
      
      shareService.trackShareEvent(1, 'facebook');
      
      // Check that event was added
      const events = shareService.getShareEvents();
      expect(events).toHaveLength(1);
      expect(events[0].videoId).toBe(1);
      expect(events[0].platform).toBe('facebook');
      
      // Check that gtag was called
      expect(window.gtag).toHaveBeenCalledWith('event', 'share', {
        video_id: 1,
        platform: 'facebook',
        event_category: 'engagement',
        event_label: 'Shared video 1 on facebook'
      });
    });

    it('should store events in localStorage', () => {
      shareService.trackShareEvent(1, 'facebook');
      
      const storedEvents = JSON.parse(localStorage.getItem('shareEvents') || '[]');
      expect(storedEvents).toHaveLength(1);
      expect(storedEvents[0].videoId).toBe(1);
      expect(storedEvents[0].platform).toBe('facebook');
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined)
        }
      });
      
      const result = await shareService.copyToClipboard('test text');
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    });

    it('should handle clipboard errors', async () => {
      // Mock clipboard API to throw error
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockRejectedValue(new Error('Clipboard error'))
        }
      });
      
      const result = await shareService.copyToClipboard('test text');
      expect(result).toBe(false);
    });
  });

  describe('canUseNativeShare', () => {
    it('should return true when native share is available', () => {
      // Mock navigator.share
      Object.assign(navigator, {
        share: jest.fn(),
      });
      Object.defineProperty(window, 'isSecureContext', { value: true });
      
      expect(shareService.canUseNativeShare()).toBe(true);
    });

    it('should return false when native share is not available', () => {
      // Remove navigator.share
      Object.defineProperty(navigator, 'share', { value: undefined });
      Object.defineProperty(window, 'isSecureContext', { value: true });
      
      expect(shareService.canUseNativeShare()).toBe(false);
    });
  });

  describe('getShareMetrics', () => {
    it('should calculate share metrics correctly', () => {
      // Track some events
      shareService.trackShareEvent(1, 'facebook');
      shareService.trackShareEvent(1, 'twitter');
      shareService.trackShareEvent(1, 'facebook');
      
      const metrics = shareService.getShareMetrics(1);
      
      expect(metrics.videoId).toBe(1);
      expect(metrics.totalShares).toBe(3);
      expect(metrics.platformBreakdown).toEqual({
        facebook: 2,
        twitter: 1
      });
    });
  });
});
import { test, expect } from '@playwright/test';

test.describe('Opera/Edge Layout Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Wait for age verification and dismiss it
    await page.waitForSelector('[data-testid="age-gate"]', { timeout: 5000 });
    await page.click('button:has-text("Yes, I am 18+")');
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="video-grid"]', { timeout: 10000 });
  });

  test('should not have horizontal scrollbars', async ({ page }) => {
    // Check that page width doesn't exceed viewport
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
  });

  test('should maintain 16:9 aspect ratio for video thumbnails', async ({ page }) => {
    // Get first video card thumbnail
    const thumbnail = page.locator('.aspect-video').first();
    await expect(thumbnail).toBeVisible();
    
    const boundingBox = await thumbnail.boundingBox();
    expect(boundingBox).not.toBeNull();
    
    if (boundingBox) {
      const aspectRatio = boundingBox.width / boundingBox.height;
      // 16:9 = 1.777... Allow small tolerance for rounding
      expect(aspectRatio).toBeGreaterThan(1.7);
      expect(aspectRatio).toBeLessThan(1.8);
    }
  });

  test('should not leave body scroll locked after modal close', async ({ page }) => {
    // Click on first video to open modal
    await page.click('.video-card-container');
    
    // Wait for modal to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    
    // Close modal
    await page.click('button[aria-label="Close modal"]');
    
    // Wait for modal to close
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });
    
    // Check that body overflow is not hidden
    const bodyOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflow;
    });
    
    const htmlOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).overflow;
    });
    
    expect(bodyOverflow).not.toBe('hidden');
    expect(htmlOverflow).not.toBe('hidden');
  });

  test('should have proper flex-shrink on video cards', async ({ page }) => {
    // Check that video cards have flex-shrink: 0
    const videoCard = page.locator('.video-card-container').first();
    await expect(videoCard).toBeVisible();
    
    const flexShrink = await videoCard.evaluate((el) => {
      return window.getComputedStyle(el).flexShrink;
    });
    
    expect(flexShrink).toBe('0');
  });

  test('should handle grid layout properly on different screen sizes', async ({ page }) => {
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow layout to settle
    
    let scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    let clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('should fire layout_error GA event if overflow detected', async ({ page }) => {
    // Mock gtag function to capture events
    await page.addInitScript(() => {
      (window as any).gtagEvents = [];
      (window as any).gtag = (...args: any[]) => {
        (window as any).gtagEvents.push(args);
      };
    });
    
    // Force a layout overflow scenario by injecting CSS
    await page.addStyleTag({
      content: `
        .video-grid-container {
          width: 200vw !important;
        }
      `
    });
    
    // Trigger a re-render
    await page.reload();
    await page.waitForSelector('[data-testid="age-gate"]', { timeout: 5000 });
    await page.click('button:has-text("Yes, I am 18+")');
    await page.waitForSelector('[data-testid="video-grid"]', { timeout: 10000 });
    
    // Wait for layout check
    await page.waitForTimeout(200);
    
    // Check if layout_error event was fired
    const gtagEvents = await page.evaluate(() => (window as any).gtagEvents);
    const layoutErrorEvent = gtagEvents.find((event: any[]) => 
      event[0] === 'event' && event[1] === 'layout_error'
    );
    
    expect(layoutErrorEvent).toBeTruthy();
  });

  test('should maintain proper spacing in grid layout', async ({ page }) => {
    // Check grid gap consistency
    const videoCards = page.locator('.video-card-container');
    await expect(videoCards.first()).toBeVisible();
    
    const cardCount = await videoCards.count();
    expect(cardCount).toBeGreaterThan(0);
    
    // Verify cards are properly spaced and not overlapping
    for (let i = 0; i < Math.min(4, cardCount); i++) {
      const card = videoCards.nth(i);
      const boundingBox = await card.boundingBox();
      expect(boundingBox).not.toBeNull();
      
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThan(200); // Minimum card width
        expect(boundingBox.height).toBeGreaterThan(200); // Minimum card height
      }
    }
  });
});

test.describe('Cross-Browser Modal Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="age-gate"]', { timeout: 5000 });
    await page.click('button:has-text("Yes, I am 18+")');
    await page.waitForSelector('[data-testid="video-grid"]', { timeout: 10000 });
  });

  test('should open and close modal without layout shifts', async ({ page }) => {
    // Measure initial layout
    const initialScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    
    // Open modal
    await page.click('.video-card-container');
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    
    // Check layout hasn't shifted
    const modalScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(Math.abs(modalScrollWidth - initialScrollWidth)).toBeLessThan(20); // Allow small tolerance
    
    // Close modal
    await page.click('button[aria-label="Close modal"]');
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });
    
    // Check layout is restored
    const finalScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(Math.abs(finalScrollWidth - initialScrollWidth)).toBeLessThan(5);
  });
});
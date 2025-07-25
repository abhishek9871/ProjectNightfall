# QA Test Plan - Issue 3: Enhanced Video Modal with Plyr.js Controls

## Test Environment
- **Dev Server**: http://localhost:5173
- **Testing Tool**: Playwright MCP Server
- **Devices**: Desktop (1920x1080) + Mobile (375x667)
- **Browsers**: Chrome, Firefox, Safari, Edge

## Test Categories

### 1. Modal Functionality Tests
#### TC001: Basic Modal Opening
- **Scenario**: Click video thumbnail to open modal--PASS
- **Expected**: Modal opens with video player, overlay visible---PASS
- **Edge Cases**: Multiple rapid clicks, double-click behavior

#### TC002: Modal Closing
- **Scenario**: Close modal via X button, ESC key, overlay click
- **Expected**: Modal closes, returns to grid view
- **Edge Cases**: Close during video loading, close during playback

#### TC003: Modal Content Display
- **Scenario**: Verify modal shows correct video title, category, duration, rating
- **Expected**: All metadata displays correctly
- **Edge Cases**: Long titles, special characters, missing data

### 2. Plyr.js Video Player Tests
#### TC004: Video Player Initialization
- **Scenario**: Modal opens and Plyr.js player loads
- **Expected**: Player controls visible, video ready to play
- **Edge Cases**: Slow network, player initialization failure

#### TC005: Play/Pause Controls
- **Scenario**: Click play button, then pause button
- **Expected**: Video starts/stops playback smoothly
- **Edge Cases**: Rapid play/pause clicks, keyboard shortcuts

#### TC006: Seek/Progress Controls
- **Scenario**: Drag progress bar, click different positions
- **Expected**: Video seeks to correct position
- **Edge Cases**: Seek to start/end, seek during loading

#### TC007: Volume Controls
- **Scenario**: Adjust volume slider, mute/unmute button
- **Expected**: Audio level changes correctly
- **Edge Cases**: Mute during playback, volume at extremes

#### TC008: Fullscreen Controls
- **Scenario**: Click fullscreen button
- **Expected**: Video enters fullscreen mode
- **Edge Cases**: Exit fullscreen, fullscreen on mobile

### 3. Error Handling & Fallback Tests
#### TC009: Embed URL Cycling
- **Scenario**: Simulate embed failure to test fallback URLs
- **Expected**: Player tries next URL in embedUrls array
- **Edge Cases**: All URLs fail, network timeout

#### TC010: Geo-Detection Integration
- **Scenario**: Test with different geo-locations (IN vs US)
- **Expected**: Correct domain used (xvideos4.com for India)
- **Edge Cases**: Geo-detection failure, VPN scenarios

#### TC011: Error State Display
- **Scenario**: Force all embed URLs to fail
- **Expected**: Error overlay with retry button appears
- **Edge Cases**: Retry functionality, error during retry

### 4. Mobile Responsiveness Tests
#### TC012: Mobile Modal Layout
- **Scenario**: Open modal on mobile device
- **Expected**: Modal fits screen, controls are touch-friendly
- **Edge Cases**: Portrait/landscape orientation, small screens

#### TC013: Touch Controls
- **Scenario**: Use touch gestures on mobile player
- **Expected**: Touch controls work smoothly
- **Edge Cases**: Pinch zoom, swipe gestures, tap accuracy

#### TC014: Mobile Navigation
- **Scenario**: Navigate while modal is open on mobile
- **Expected**: Modal behavior consistent with desktop
- **Edge Cases**: Device rotation, keyboard appearance

### 5. Accessibility Tests
#### TC015: Keyboard Navigation
- **Scenario**: Navigate modal using only keyboard
- **Expected**: All controls accessible via keyboard
- **Edge Cases**: Tab order, focus trap, screen reader compatibility

#### TC016: ARIA Labels & Semantics
- **Scenario**: Check ARIA labels and semantic markup
- **Expected**: Proper accessibility attributes present
- **Edge Cases**: Screen reader announcements, focus indicators

### 6. Performance Tests
#### TC017: Loading Performance
- **Scenario**: Measure modal open time and Plyr.js initialization
- **Expected**: Modal opens <0.05s, Plyr loads quickly
- **Edge Cases**: Slow network, multiple modals, memory usage

#### TC018: Memory Management
- **Scenario**: Open/close multiple modals repeatedly
- **Expected**: No memory leaks, proper cleanup
- **Edge Cases**: Rapid open/close, browser tab switching

### 7. Integration Tests
#### TC019: GA4 Event Tracking
- **Scenario**: Open modal, play video, close modal
- **Expected**: GA4 events fire correctly
- **Edge Cases**: Event timing, multiple events, network failures

#### TC020: Existing Features Preservation
- **Scenario**: Test all existing features still work
- **Expected**: Search, navigation, ads, PWA all functional
- **Edge Cases**: Feature interactions, state management

### 8. Cross-Browser Compatibility
#### TC021: Chrome/Chromium
- **Scenario**: Test all functionality in Chrome
- **Expected**: Perfect functionality
- **Edge Cases**: Chrome-specific behaviors

#### TC022: Firefox
- **Scenario**: Test all functionality in Firefox
- **Expected**: Consistent behavior with Chrome
- **Edge Cases**: Firefox-specific rendering

#### TC023: Safari (if available)
- **Scenario**: Test all functionality in Safari
- **Expected**: Webkit compatibility maintained
- **Edge Cases**: Safari-specific limitations

### 9. Edge Cases & Stress Tests
#### TC024: Network Conditions
- **Scenario**: Test with slow/intermittent network
- **Expected**: Graceful degradation, proper loading states
- **Edge Cases**: Network drops during playback

#### TC025: Multiple Videos
- **Scenario**: Open multiple video modals in sequence
- **Expected**: Each modal works independently
- **Edge Cases**: Memory usage, state conflicts

#### TC026: Long Session Testing
- **Scenario**: Keep modal open for extended period
- **Expected**: No performance degradation
- **Edge Cases**: Memory leaks, event listener cleanup

## Success Criteria
- ✅ All test cases pass without critical issues
- ✅ Modal opens/closes smoothly on all devices
- ✅ Plyr.js controls work perfectly
- ✅ Error handling functions as expected
- ✅ Mobile experience is optimal
- ✅ Accessibility standards met
- ✅ Performance targets achieved
- ✅ Zero regressions in existing features
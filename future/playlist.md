# Product Requirements Document: Custom Playlists & Collections Feature
## Project Nightfall - Revenue Enhancement Implementation

### Executive Summary
Implement a frontend-only custom playlists and collections system that enables users to create, manage, and share video playlists without requiring user accounts. This feature will increase user engagement, session duration, and ad revenue while maintaining complete user anonymity.

---

## 1. Core Feature Requirements

### 1.1 Playlist Management System
Create a complete playlist management system with the following capabilities:

**Essential Functions:**
- Create unlimited playlists stored in localStorage
- Add/remove videos from playlists with one-click actions
- Reorder videos within playlists via drag-and-drop (desktop) or touch gestures (mobile)
- Delete playlists with confirmation dialog
- Export playlists as JSON files
- Import playlists from JSON files
- Share playlists via unique URLs (base64 encoded playlist data in URL)

**Technical Requirements:**
- Use localStorage as primary storage (5MB limit)
- Implement IndexedDB fallback for large data (>5MB)
- Generate unique IDs for each playlist using crypto.randomUUID()
- Maintain playlist metadata: name, description, thumbnail, video count, creation date, last modified

---

## 2. Implementation Architecture

### 2.1 Context Structure
Create a new `PlaylistContext` in `/src/contexts/PlaylistContext.tsx`:

```typescript
interface Playlist {
  id: string;
  name: string;
  description: string;
  videos: VideoItem[];
  thumbnail: string; // First video's thumbnail or custom
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  category?: string;
  videoCount: number;
}

interface PlaylistContextType {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  createPlaylist: (name: string, description?: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, video: VideoItem) => void;
  removeFromPlaylist: (playlistId: string, videoId: string) => void;
  reorderPlaylistVideos: (playlistId: string, fromIndex: number, toIndex: number) => void;
  exportPlaylist: (playlistId: string) => void;
  importPlaylist: (jsonData: string) => void;
  getShareableUrl: (playlistId: string) => string;
}
```

### 2.2 New Pages to Create

1. **`/src/pages/PlaylistsPage.tsx`** - Main playlists overview page
   - Route: `/playlists`
   - Display all user playlists in a grid
   - Include "Create New Playlist" button
   - Show playlist thumbnails, names, and video counts

2. **`/src/pages/PlaylistViewPage.tsx`** - Individual playlist viewing page
   - Route: `/playlist/:id`
   - Display playlist videos with pagination (24 videos per page)
   - Include playlist metadata and description
   - Auto-play functionality with countdown timer
   - Related playlists sidebar

3. **`/src/pages/SharedPlaylistPage.tsx`** - Shared playlist viewing page
   - Route: `/shared-playlist`
   - Decode playlist data from URL parameters
   - Allow users to save shared playlists to their collection

### 2.3 Components to Create

1. **`/components/PlaylistCard.tsx`**
   - Display playlist thumbnail, name, video count
   - Edit/Delete buttons on hover
   - Click to navigate to playlist view

2. **`/components/PlaylistModal.tsx`**
   - Quick playlist creation/edit modal
   - Name, description input fields
   - Category selection dropdown

3. **`/components/AddToPlaylistButton.tsx`**
   - Appears on every VideoCard component
   - Shows dropdown of existing playlists
   - Option to create new playlist inline

4. **`/components/PlaylistVideoItem.tsx`**
   - Video item within playlist view
   - Drag handle for reordering
   - Remove button
   - Video duration and title

5. **`/components/AutoPlayCountdown.tsx`**
   - Countdown timer overlay
   - Next video preview
   - Cancel button

---

## 3. User Interface Requirements

### 3.1 Navigation Integration
Add "Playlists" to the main navigation:
- Update `/components/Header.tsx` to include Playlists link
- Update `/components/Sidebar.tsx` for mobile navigation
- Position between "Top Rated" and "Categories"

### 3.2 Video Card Enhancement
Modify `/components/VideoCard.tsx`:
- Add playlist icon button (bookmark icon) in top-right corner
- Show tooltip "Add to Playlist" on hover
- Open dropdown menu showing existing playlists + "Create New"

### 3.3 Mobile Optimizations
- Touch gestures: Swipe left to show delete button
- Long press to enter reorder mode
- Responsive grid: 2 columns on mobile, 4 on tablet, 6 on desktop
- Sticky header with search/filter options

---

## 4. SEO & Discovery Implementation

### 4.1 JSON-LD Schema
Add to each playlist page:
```javascript
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Playlist Name",
  "description": "Playlist Description",
  "numberOfItems": videoCount,
  "itemListElement": [/* VideoObject array */]
}
```

### 4.2 Dynamic Sitemap
Create `/scripts/generatePlaylistSitemap.js`:
- Generate sitemap for public/shared playlists
- Update during build process
- Include in main sitemap index

### 4.3 Meta Tags
For each playlist page, include:
- Dynamic title: `{Playlist Name} - {Video Count} Videos | Project Nightfall`
- Description with video count and categories
- Open Graph tags for social sharing
- Canonical URL for shared playlists

---

## 5. Features & Functionality

### 5.1 Quick Actions
- **Quick Add**: One-click add to last used playlist
- **Watch Later**: Default playlist auto-created for all users
- **Favorites**: Integration with existing FavoritesContext
- **Continue Watching**: Auto-playlist of partially watched videos

### 5.2 Smart Features
- **Auto-categorization**: Detect playlist category from video categories
- **Duplicate detection**: Warn when adding duplicate videos
- **Playlist suggestions**: Recommend videos based on playlist content
- **Bulk operations**: Select multiple videos to add/remove

### 5.3 Sharing & Export
- **Share via URL**: Generate shareable links with base64 encoded data
- **Export JSON**: Download playlist as JSON file
- **Import JSON**: Upload and merge playlists
- **Copy playlist**: Duplicate existing playlists

---

## 6. Integration Requirements

### 6.1 Existing Context Integration
- Integrate with `SearchContext` for playlist search functionality
- Connect with `FavoritesContext` to sync favorites as a playlist
- Use existing `AdEngineContext` for ad placement between playlist items

### 6.2 Routing Updates
Update `/AppRouter.tsx`:
```javascript
<Route path="/playlists" element={<PlaylistsPage />} />
<Route path="/playlist/:id" element={<PlaylistViewPage />} />
<Route path="/shared-playlist" element={<SharedPlaylistPage />} />
```

### 6.3 Data Integration
- Access video data from `/data/videos.ts`
- Use existing category definitions from `/data/categories.ts`
- Maintain compatibility with current pagination components

---

## 7. Performance Optimizations

### 7.1 Lazy Loading
- Implement React.lazy() for playlist components
- Load playlist data on-demand
- Virtualize long playlist lists (100+ videos)

### 7.2 Storage Management
- Implement storage quota checking
- Auto-cleanup of old/unused playlists (with user permission)
- Compress playlist data using LZ-string library

### 7.3 Caching Strategy
- Cache playlist thumbnails in service worker
- Store frequently accessed playlists in sessionStorage
- Implement optimistic UI updates

---

## 8. Revenue Optimization

### 8.1 Ad Placement
- Insert ads every 3rd video in playlist view
- Interstitial ad after 5 videos watched in playlist
- Banner ad at bottom of playlist page

### 8.2 Engagement Metrics
Track and optimize for:
- Average playlist size (target: 10+ videos)
- Playlist completion rate (target: 40%)
- Share rate (target: 5% of created playlists)
- Session duration increase (target: +50%)

---

## 9. Testing Requirements

### 9.1 Edge Cases to Handle
- localStorage full (quota exceeded)
- Invalid JSON import
- Empty playlists
- Deleted videos in playlists
- URL length limits for sharing
- Offline functionality

### 9.2 Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 10. Implementation Priority

### Phase 1 (Core Functionality)
1. Create PlaylistContext with localStorage
2. Add basic playlist CRUD operations
3. Implement AddToPlaylistButton on VideoCards
4. Create PlaylistsPage and PlaylistViewPage

### Phase 2 (Enhanced Features)
1. Add drag-and-drop reordering
2. Implement export/import functionality
3. Add sharing via URL
4. Create AutoPlay functionality

### Phase 3 (Optimization)
1. Add IndexedDB fallback
2. Implement smart playlists
3. Add playlist search/filter
4. Optimize for mobile touch gestures

---

## 11. Success Metrics

**Primary KPIs:**
- User engagement: 60%+ users create at least one playlist
- Session duration: Increase by 50% for playlist users
- Page views: +3 pages per session average
- Ad revenue: 30% increase from playlist page ads

**Secondary Metrics:**
- Playlist sharing rate: 5%
- Average playlist size: 10+ videos
- Return visitor rate: +25%
- Mobile usage: 70% of playlist interactions

---

## 12. Implementation Notes for AI Agent

### Do's:
- ✅ Reuse existing components where possible (Pagination, VideoGrid patterns)
- ✅ Follow existing code patterns and naming conventions
- ✅ Implement proper error handling with user-friendly messages
- ✅ Add loading states for all async operations
- ✅ Include TypeScript types for all new interfaces
- ✅ Test localStorage limits and implement fallbacks
- ✅ Make all features work without user accounts

### Don'ts:
- ❌ Don't modify existing video data structure
- ❌ Don't require backend changes
- ❌ Don't break existing functionality
- ❌ Don't implement user authentication
- ❌ Don't use external databases
- ❌ Don't exceed localStorage limits without fallback

### File Structure to Follow:
```
/src/contexts/PlaylistContext.tsx
/src/pages/PlaylistsPage.tsx
/src/pages/PlaylistViewPage.tsx
/src/pages/SharedPlaylistPage.tsx
/components/playlist/PlaylistCard.tsx
/components/playlist/PlaylistModal.tsx
/components/playlist/AddToPlaylistButton.tsx
/components/playlist/PlaylistVideoItem.tsx
/components/playlist/AutoPlayCountdown.tsx
/hooks/usePlaylistStorage.ts
/utils/playlistUtils.ts
```

---

## 13. Completion Checklist

- [ ] PlaylistContext implemented with all CRUD operations
- [ ] localStorage with IndexedDB fallback working
- [ ] All three playlist pages created and routed
- [ ] AddToPlaylistButton integrated on all VideoCards
- [ ] Drag-and-drop reordering functional
- [ ] Mobile touch gestures implemented
- [ ] Export/Import JSON functionality complete
- [ ] Share via URL working
- [ ] AutoPlay with countdown functional
- [ ] SEO schemas and meta tags added
- [ ] Ads integrated in playlist views
- [ ] Search functionality within playlists
- [ ] Related playlists recommendations
- [ ] All edge cases handled
- [ ] Mobile responsive design complete

---

**End of PRD**

This document provides complete requirements for implementing the Custom Playlists & Collections feature. The AI agent should implement each section systematically, testing functionality at each phase before proceeding to the next.

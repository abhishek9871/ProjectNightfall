import { Video } from '../types';
import { Playlist } from '../src/contexts/PlaylistContext';

// Storage management utilities
export const STORAGE_KEYS = {
  PLAYLIST_DATA: 'playlist_data',
  PLAYLIST_CACHE: 'playlist_cache',
  LAST_USED_PLAYLIST: 'last_used_playlist'
} as const;

// Check localStorage quota and usage
export function checkStorageQuota(): { used: number; available: number; percentage: number } {
  let used = 0;
  let available = 5 * 1024 * 1024; // 5MB default

  try {
    // Calculate used storage
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Try to estimate available storage
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        if (estimate.quota) {
          available = estimate.quota;
        }
      });
    }
  } catch (error) {
    console.warn('Could not check storage quota:', error);
  }

  return {
    used,
    available,
    percentage: (used / available) * 100
  };
}

// Compress playlist data using simple compression
export function compressPlaylistData(data: string): string {
  try {
    // Simple compression by removing unnecessary whitespace and shortening keys
    const compressed = data
      .replace(/\s+/g, ' ')
      .replace(/": "/g, '":"')
      .replace(/", "/g, '","')
      .replace(/\{ "/g, '{"')
      .replace(/" \}/g, '"}');
    
    return compressed;
  } catch (error) {
    console.error('Error compressing playlist data:', error);
    return data;
  }
}

// Decompress playlist data
export function decompressPlaylistData(compressedData: string): string {
  try {
    // For now, just return as-is since we're using simple compression
    return compressedData;
  } catch (error) {
    console.error('Error decompressing playlist data:', error);
    return compressedData;
  }
}

// Validate playlist data structure
export function validatePlaylistData(data: any): boolean {
  try {
    if (!data || typeof data !== 'object') return false;
    if (!data.version || typeof data.version !== 'string') return false;
    if (!Array.isArray(data.playlists)) return false;
    if (!data.metadata || typeof data.metadata !== 'object') return false;
    if (!data.settings || typeof data.settings !== 'object') return false;

    // Validate each playlist
    for (const playlist of data.playlists) {
      if (!validatePlaylist(playlist)) return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating playlist data:', error);
    return false;
  }
}

// Validate individual playlist
export function validatePlaylist(playlist: any): boolean {
  try {
    if (!playlist || typeof playlist !== 'object') return false;
    if (!playlist.id || typeof playlist.id !== 'string') return false;
    if (!playlist.name || typeof playlist.name !== 'string') return false;
    if (!Array.isArray(playlist.videos)) return false;
    if (!playlist.createdAt || !playlist.updatedAt) return false;
    if (typeof playlist.videoCount !== 'number') return false;

    return true;
  } catch (error) {
    console.error('Error validating playlist:', error);
    return false;
  }
}

// Generate playlist thumbnail from videos
export function generatePlaylistThumbnail(videos: Video[]): string {
  if (videos.length === 0) {
    return `https://picsum.photos/seed/empty-playlist/400/225`;
  }

  // Use first video's thumbnail
  const firstVideo = videos[0];
  return firstVideo.thumbnailUrl || `https://picsum.photos/seed/video${firstVideo.id}/400/225`;
}

// Calculate playlist duration
export function calculatePlaylistDuration(videos: Video[]): string {
  if (videos.length === 0) return '0:00';

  let totalSeconds = 0;
  
  videos.forEach(video => {
    const duration = video.duration;
    const parts = duration.split(':');
    
    if (parts.length === 2) {
      // MM:SS format
      totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      // HH:MM:SS format
      totalSeconds += parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Sort playlists by different criteria
export function sortPlaylists(playlists: Playlist[], sortBy: 'recent' | 'name' | 'videoCount' | 'category'): Playlist[] {
  const sorted = [...playlists];

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'videoCount':
      return sorted.sort((a, b) => b.videoCount - a.videoCount);
    
    case 'category':
      return sorted.sort((a, b) => {
        const categoryA = a.category || 'Unknown';
        const categoryB = b.category || 'Unknown';
        return categoryA.localeCompare(categoryB);
      });
    
    default:
      return sorted;
  }
}

// Filter playlists by category
export function filterPlaylistsByCategory(playlists: Playlist[], category: string): Playlist[] {
  if (!category || category === 'All') return playlists;
  return playlists.filter(playlist => playlist.category === category);
}

// Get unique categories from playlists
export function getPlaylistCategories(playlists: Playlist[]): string[] {
  const categories = new Set<string>();
  playlists.forEach(playlist => {
    if (playlist.category) {
      categories.add(playlist.category);
    }
  });
  return Array.from(categories).sort();
}

// Generate playlist statistics
export function generatePlaylistStats(playlists: Playlist[]) {
  const totalPlaylists = playlists.length;
  const totalVideos = playlists.reduce((sum, playlist) => sum + playlist.videoCount, 0);
  const averageVideosPerPlaylist = totalPlaylists > 0 ? Math.round(totalVideos / totalPlaylists) : 0;
  
  const categories = getPlaylistCategories(playlists);
  const categoryStats = categories.map(category => ({
    name: category,
    count: playlists.filter(p => p.category === category).length
  }));

  const largestPlaylist = playlists.reduce((largest, current) => 
    current.videoCount > largest.videoCount ? current : largest, 
    playlists[0] || { name: 'None', videoCount: 0 }
  );

  return {
    totalPlaylists,
    totalVideos,
    averageVideosPerPlaylist,
    categories: categoryStats,
    largestPlaylist: {
      name: largestPlaylist.name,
      videoCount: largestPlaylist.videoCount
    }
  };
}

// Export playlist to different formats
export function exportPlaylistToFormat(playlist: Playlist, format: 'json' | 'csv' | 'txt'): string {
  switch (format) {
    case 'json':
      return JSON.stringify({
        version: '1.0.0',
        playlist,
        exportedAt: new Date().toISOString(),
        source: 'Project Nightfall'
      }, null, 2);

    case 'csv':
      const csvHeader = 'Title,Duration,Category,Views,Rating,Upload Date,Description\n';
      const csvRows = playlist.videos.map(video => 
        `"${video.title}","${video.duration}","${video.category}","${video.views}","${video.rating}","${video.uploadDate}","${video.description.replace(/"/g, '""')}"`
      ).join('\n');
      return csvHeader + csvRows;

    case 'txt':
      const txtContent = [
        `Playlist: ${playlist.name}`,
        `Description: ${playlist.description}`,
        `Videos: ${playlist.videoCount}`,
        `Created: ${new Date(playlist.createdAt).toLocaleDateString()}`,
        `Category: ${playlist.category}`,
        '',
        'Videos:',
        ...playlist.videos.map((video, index) => 
          `${index + 1}. ${video.title} (${video.duration})`
        )
      ].join('\n');
      return txtContent;

    default:
      return '';
  }
}

// Detect duplicate videos across playlists
export function findDuplicateVideos(playlists: Playlist[]): { videoId: string; playlists: string[] }[] {
  const videoMap = new Map<string, string[]>();

  playlists.forEach(playlist => {
    playlist.videos.forEach(video => {
      const videoId = video.id.toString();
      if (!videoMap.has(videoId)) {
        videoMap.set(videoId, []);
      }
      videoMap.get(videoId)!.push(playlist.name);
    });
  });

  return Array.from(videoMap.entries())
    .filter(([_, playlistNames]) => playlistNames.length > 1)
    .map(([videoId, playlistNames]) => ({ videoId, playlists: playlistNames }));
}

// Clean up orphaned or invalid videos in playlists
export function cleanupPlaylistVideos(playlist: Playlist, allVideos: Video[]): Playlist {
  const validVideoIds = new Set(allVideos.map(v => v.id.toString()));
  
  const cleanedVideos = playlist.videos.filter(video => 
    validVideoIds.has(video.id.toString())
  );

  return {
    ...playlist,
    videos: cleanedVideos,
    videoCount: cleanedVideos.length,
    updatedAt: new Date().toISOString()
  };
}

// Generate shareable playlist URL with compression
export function generateShareableUrl(playlist: Playlist, baseUrl: string = window.location.origin): string {
  try {
    const shareData = {
      v: '1.0.0', // shortened version
      p: {
        id: playlist.id,
        name: playlist.name,
        desc: playlist.description,
        videos: playlist.videos.map(v => ({
          id: v.id,
          title: v.title,
          duration: v.duration,
          category: v.category
        })), // Only include essential video data
        thumb: playlist.thumbnail,
        cat: playlist.category,
        count: playlist.videoCount
      },
      ts: Date.now()
    };

    const jsonString = JSON.stringify(shareData);
    const compressed = compressPlaylistData(jsonString);
    const encoded = btoa(encodeURIComponent(compressed));
    
    return `${baseUrl}/shared-playlist?data=${encoded}`;
  } catch (error) {
    console.error('Error generating shareable URL:', error);
    return '';
  }
}

// Parse shareable playlist URL
export function parseShareableUrl(encodedData: string): Playlist | null {
  try {
    const compressed = decodeURIComponent(atob(encodedData));
    const decompressed = decompressPlaylistData(compressed);
    const shareData = JSON.parse(decompressed);
    
    if (!shareData.p || !shareData.v) {
      throw new Error('Invalid share data format');
    }

    // Reconstruct full playlist object
    const playlist: Playlist = {
      id: shareData.p.id,
      name: shareData.p.name,
      description: shareData.p.desc || '',
      videos: shareData.p.videos || [],
      thumbnail: shareData.p.thumb || '',
      createdAt: new Date(shareData.ts || Date.now()).toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true,
      category: shareData.p.cat || 'Mixed',
      videoCount: shareData.p.count || 0
    };

    return playlist;
  } catch (error) {
    console.error('Error parsing shareable URL:', error);
    return null;
  }
}
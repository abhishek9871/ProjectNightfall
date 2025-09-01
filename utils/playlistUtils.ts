import { Video } from '../types';
import type { Playlist } from '../src/contexts/PlaylistContext';
import LZString from 'lz-string';
import pako from 'pako';
import { videos as ALL_VIDEOS } from '../data/videos';

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
      const csvRows = playlist.videos.map((video: Video) => 
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
        ...playlist.videos.map((video: Video, index: number) => 
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

  playlists.forEach((playlist: Playlist) => {
    playlist.videos.forEach((video: Video) => {
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
  
  const cleanedVideos = playlist.videos.filter((video: Video) => 
    validVideoIds.has(video.id.toString())
  );

  return {
    ...playlist,
    videos: cleanedVideos,
    videoCount: cleanedVideos.length,
    updatedAt: new Date().toISOString(),
  };
}

// Generate shareable playlist URL (canonical schema used by PlaylistContext)
export function generateShareableUrl(playlist: Playlist, baseUrl: string = window.location.origin): string {
  try {
    // v2 compact schema with only necessary fields and video IDs
    const compact = {
      v: 2,
      p: {
        id: playlist.id,
        name: playlist.name,
        desc: playlist.description,
        vids: playlist.videos.map(v => Number(v.id)),
        count: playlist.videoCount,
        cat: playlist.category ?? 'Mixed',
        thumb: playlist.thumbnail,
      },
      ts: Date.now(),
    };

    // Deflate + base64url
    const jsonBytes = new TextEncoder().encode(JSON.stringify(compact));
    const deflated = pako.deflate(jsonBytes, { level: 9 });
    const b64 = btoa(String.fromCharCode(...deflated))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');

    const isLocal = typeof window !== 'undefined' && /^(localhost|127\.|0\.0\.0\.0)/.test(window.location.hostname);
    if (isLocal) {
      const slug = playlist.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80) || 'playlist';
      return `${baseUrl}/p/${slug}?s=${b64}`;
    }
    // In production, use server-side preview endpoint for rich unfurls
    return `${baseUrl}/s/${b64}`;
  } catch (error) {
    console.error('Error generating short URL:', error);
    // Fallback to lz-string compact legacy path
    try {
      const fallback = {
        v: 2,
        p: {
          id: playlist.id,
          name: playlist.name,
          desc: playlist.description,
          vids: playlist.videos.map(v => Number(v.id)),
          count: playlist.videoCount,
          cat: playlist.category ?? 'Mixed',
          thumb: playlist.thumbnail,
        },
        ts: Date.now(),
      };
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(fallback));
      return `${baseUrl}/shared-playlist?c=${compressed}`;
    } catch (e) {
      try {
        const shareData = {
          version: '1.0.0',
          playlist: { ...playlist, isPublic: true },
          sharedAt: new Date().toISOString(),
        };
        const jsonString = JSON.stringify(shareData);
        const encoded = btoa(encodeURIComponent(jsonString));
        return `${baseUrl}/shared-playlist?data=${encoded}`;
      } catch {
        return '';
      }
    }
  }
}

// Parse shareable playlist data (canonical schema)
export function parseShareableUrl(encodedData: string): Playlist | null {
  // Try new pako+base64url first
  try {
    const padded = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const withPad = padded + '='.repeat(padLen);
    const binary = atob(withPad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const inflated = pako.inflate(bytes);
    const text = new TextDecoder().decode(inflated);
    const data = JSON.parse(text);
    if (data && data.v === 2 && data.p) {
      const vids: number[] = Array.isArray(data.p.vids) ? data.p.vids : [];
      const videos: Video[] = vids
        .map((id: number) => ALL_VIDEOS.find(v => Number(v.id) === Number(id)))
        .filter((v): v is Video => Boolean(v));
      const nowIso = new Date().toISOString();
      return {
        id: data.p.id || crypto.randomUUID(),
        name: data.p.name || 'Shared Playlist',
        description: data.p.desc || '',
        videos,
        thumbnail: data.p.thumb || generatePlaylistThumbnail(videos),
        createdAt: nowIso,
        updatedAt: nowIso,
        isPublic: true,
        category: data.p.cat || (videos[0]?.category ?? 'Mixed'),
        videoCount: typeof data.p.count === 'number' ? data.p.count : videos.length,
      } as unknown as Playlist;
    }
  } catch {}

  // Try compact lz-string
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    if (decompressed) {
      const data = JSON.parse(decompressed);
      if (data && data.v === 2 && data.p) {
        const vids: number[] = Array.isArray(data.p.vids) ? data.p.vids : [];
        const videos: Video[] = vids
          .map((id: number) => ALL_VIDEOS.find(v => Number(v.id) === Number(id)))
          .filter((v): v is Video => Boolean(v));
        const nowIso = new Date().toISOString();
        return {
          id: data.p.id || crypto.randomUUID(),
          name: data.p.name || 'Shared Playlist',
          description: data.p.desc || '',
          videos,
          thumbnail: data.p.thumb || generatePlaylistThumbnail(videos),
          createdAt: nowIso,
          updatedAt: nowIso,
          isPublic: true,
          category: data.p.cat || (videos[0]?.category ?? 'Mixed'),
          videoCount: typeof data.p.count === 'number' ? data.p.count : videos.length,
        } as unknown as Playlist;
      }
    }
  } catch {}

  // Legacy base64 canonical
  try {
    const jsonString = decodeURIComponent(atob(encodedData));
    const shareData = JSON.parse(jsonString);
    if (!shareData.playlist || !shareData.version) throw new Error('Invalid share data format');
    const p = shareData.playlist as Playlist;
    return {
      ...p,
      isPublic: true,
      createdAt: p.createdAt || new Date(shareData.sharedAt || Date.now()).toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
      videoCount: typeof p.videoCount === 'number' ? p.videoCount : Array.isArray(p.videos) ? p.videos.length : 0,
    } as Playlist;
  } catch (error) {
    console.error('Error parsing shareable URL:', error);
    return null;
  }
}
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Video } from '../../types';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { assignVideoToCluster } from '../utils/clusterAssignment';

// Playlist data schema as per PRD specification
interface Playlist {
    id: string;
    name: string;
    description: string;
    videos: Video[];
    thumbnail: string; // First video's thumbnail or custom
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    category?: string;
    videoCount: number;
}

interface PlaylistMetadata {
    totalPlaylists: number;
    totalVideos: number;
    lastUpdated: string;
    categories: Record<string, number>;
}

interface PlaylistSettings {
    sortPreference: 'recent' | 'name' | 'videoCount' | 'category';
    displayMode: 'grid' | 'list';
    autoPlay: boolean;
    autoPlayDelay: number; // seconds
}

interface PlaylistData {
    version: string;
    playlists: Playlist[];
    metadata: PlaylistMetadata;
    settings: PlaylistSettings;
}

interface PlaylistContextType {
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    createPlaylist: (name: string, description?: string) => string;
    deletePlaylist: (id: string) => void;
    updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
    addToPlaylist: (playlistId: string, video: Video) => void;
    removeFromPlaylist: (playlistId: string, videoId: string) => void;
    reorderPlaylistVideos: (playlistId: string, fromIndex: number, toIndex: number) => void;
    exportPlaylist: (playlistId: string) => string;
    importPlaylist: (jsonData: string) => boolean;
    getShareableUrl: (playlistId: string) => string;
    loadSharedPlaylist: (encodedData: string) => Playlist | null;
    getPlaylistById: (id: string) => Playlist | undefined;
    duplicatePlaylist: (id: string) => string | null;
    clearAllPlaylists: () => void;
    getMetadata: () => PlaylistMetadata;
    getSettings: () => PlaylistSettings;
    updateSettings: (settings: Partial<PlaylistSettings>) => void;
    isVideoInPlaylist: (playlistId: string, videoId: string) => boolean;
    getPlaylistsContainingVideo: (videoId: string) => Playlist[];
    searchPlaylists: (query: string) => Playlist[];
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

const DEFAULT_PLAYLIST_DATA: PlaylistData = {
    version: '1.0.0',
    playlists: [],
    metadata: {
        totalPlaylists: 0,
        totalVideos: 0,
        lastUpdated: new Date().toISOString(),
        categories: {}
    },
    settings: {
        sortPreference: 'recent',
        displayMode: 'grid',
        autoPlay: false,
        autoPlayDelay: 10
    }
};

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
    const [playlistData, setPlaylistData] = useLocalStorage<PlaylistData>('playlist_data', DEFAULT_PLAYLIST_DATA);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

    // Derived state
    const playlists = playlistData.playlists;

    // Update metadata helper
    const updateMetadata = useCallback((playlists: Playlist[]) => {
        const categories: Record<string, number> = {};
        let totalVideos = 0;

        playlists.forEach(playlist => {
            totalVideos += playlist.videoCount;
            if (playlist.category) {
                categories[playlist.category] = (categories[playlist.category] || 0) + 1;
            }
        });

        return {
            totalPlaylists: playlists.length,
            totalVideos,
            lastUpdated: new Date().toISOString(),
            categories
        };
    }, []);

    // Auto-detect playlist category based on videos
    const detectPlaylistCategory = useCallback((videos: Video[]): string => {
        if (videos.length === 0) return 'Mixed';

        const categoryCount: Record<string, number> = {};
        videos.forEach(video => {
            const clusterId = assignVideoToCluster(video);
            const allCategories = [...categories, ...specialtyClusters];
            const category = allCategories.find(cat => cat.id === clusterId);
            const categoryName = category?.name || video.category || 'Unknown';
            categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
        });

        // Return the most common category, or 'Mixed' if no clear majority
        const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
        const topCategory = sortedCategories[0];
        const secondCategory = sortedCategories[1];

        if (!secondCategory || topCategory[1] > secondCategory[1] * 2) {
            return topCategory[0];
        }
        return 'Mixed';
    }, []);

    // Generate playlist thumbnail
    const generateThumbnail = useCallback((videos: Video[]): string => {
        if (videos.length === 0) {
            return `https://picsum.photos/seed/playlist-empty/400/225`;
        }
        return videos[0].thumbnailUrl || `https://picsum.photos/seed/video${videos[0].id}/400/225`;
    }, []);

    // Create new playlist
    const createPlaylist = useCallback((name: string, description: string = ''): string => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const newPlaylist: Playlist = {
            id,
            name: name.trim(),
            description: description.trim(),
            videos: [],
            thumbnail: `https://picsum.photos/seed/playlist-${id}/400/225`,
            createdAt: now,
            updatedAt: now,
            isPublic: false,
            category: 'Mixed',
            videoCount: 0
        };

        const updatedPlaylists = [...playlists, newPlaylist];
        const updatedMetadata = updateMetadata(updatedPlaylists);

        setPlaylistData({
            ...playlistData,
            playlists: updatedPlaylists,
            metadata: updatedMetadata
        });

        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'create_playlist', {
                playlist_id: id,
                playlist_name: name
            });
        }

        return id;
    }, [playlists, playlistData, setPlaylistData, updateMetadata]);

    // Delete playlist
    const deletePlaylist = useCallback((id: string) => {
        const updatedPlaylists = playlists.filter(p => p.id !== id);
        const updatedMetadata = updateMetadata(updatedPlaylists);

        setPlaylistData({
            ...playlistData,
            playlists: updatedPlaylists,
            metadata: updatedMetadata
        });

        // Clear current playlist if it was deleted
        if (currentPlaylist?.id === id) {
            setCurrentPlaylist(null);
        }

        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'delete_playlist', {
                playlist_id: id
            });
        }
    }, [playlists, playlistData, setPlaylistData, updateMetadata, currentPlaylist]);

    // Update playlist
    const updatePlaylist = useCallback((id: string, updates: Partial<Playlist>) => {
        const updatedPlaylists = playlists.map(playlist => {
            if (playlist.id === id) {
                const updated = {
                    ...playlist,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                // Auto-update category and thumbnail if videos changed
                if (updates.videos) {
                    updated.category = detectPlaylistCategory(updates.videos);
                    updated.thumbnail = generateThumbnail(updates.videos);
                    updated.videoCount = updates.videos.length;
                }

                return updated;
            }
            return playlist;
        });

        const updatedMetadata = updateMetadata(updatedPlaylists);

        setPlaylistData({
            ...playlistData,
            playlists: updatedPlaylists,
            metadata: updatedMetadata
        });

        // Update current playlist if it's the one being updated
        if (currentPlaylist?.id === id) {
            const updatedCurrent = updatedPlaylists.find(p => p.id === id);
            if (updatedCurrent) {
                setCurrentPlaylist(updatedCurrent);
            }
        }
    }, [playlists, playlistData, setPlaylistData, updateMetadata, currentPlaylist, detectPlaylistCategory, generateThumbnail]);

    // Add video to playlist
    const addToPlaylist = useCallback((playlistId: string, video: Video) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        // Check for duplicates
        const isDuplicate = playlist.videos.some(v => v.id === video.id);
        if (isDuplicate) {
            console.warn('Video already exists in playlist');
            return;
        }

        const updatedVideos = [...playlist.videos, video];
        updatePlaylist(playlistId, { videos: updatedVideos });

        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'add_to_playlist', {
                playlist_id: playlistId,
                video_id: video.id,
                video_title: video.title,
                playlist_size: updatedVideos.length
            });
        }
    }, [playlists, updatePlaylist]);

    // Remove video from playlist
    const removeFromPlaylist = useCallback((playlistId: string, videoId: string) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        const updatedVideos = playlist.videos.filter(v => v.id.toString() !== videoId);
        updatePlaylist(playlistId, { videos: updatedVideos });

        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'remove_from_playlist', {
                playlist_id: playlistId,
                video_id: videoId,
                playlist_size: updatedVideos.length
            });
        }
    }, [playlists, updatePlaylist]);

    // Reorder videos in playlist
    const reorderPlaylistVideos = useCallback((playlistId: string, fromIndex: number, toIndex: number) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        const updatedVideos = [...playlist.videos];
        const [movedVideo] = updatedVideos.splice(fromIndex, 1);
        updatedVideos.splice(toIndex, 0, movedVideo);

        updatePlaylist(playlistId, { videos: updatedVideos });

        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'reorder_playlist', {
                playlist_id: playlistId,
                from_index: fromIndex,
                to_index: toIndex
            });
        }
    }, [playlists, updatePlaylist]);

    // Export playlist as JSON
    const exportPlaylist = useCallback((playlistId: string): string => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return '';

        try {
            const exportData = {
                version: '1.0.0',
                playlist,
                exportedAt: new Date().toISOString(),
                source: 'Project Nightfall'
            };

            const jsonString = JSON.stringify(exportData, null, 2);

            // Create and trigger download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `playlist-${playlist.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Analytics event
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'export_playlist', {
                    playlist_id: playlistId,
                    video_count: playlist.videoCount
                });
            }

            return jsonString;
        } catch (error) {
            console.error('Error exporting playlist:', error);
            return '';
        }
    }, [playlists]);

    // Import playlist from JSON
    const importPlaylist = useCallback((jsonData: string): boolean => {
        try {
            const importData = JSON.parse(jsonData);

            // Validate import data structure
            if (!importData.playlist || !importData.version) {
                console.error('Invalid playlist data format');
                return false;
            }

            const importedPlaylist = importData.playlist;

            // Generate new ID to avoid conflicts
            const newId = crypto.randomUUID();
            const now = new Date().toISOString();

            const newPlaylist: Playlist = {
                ...importedPlaylist,
                id: newId,
                createdAt: now,
                updatedAt: now,
                name: `${importedPlaylist.name} (Imported)`
            };

            const updatedPlaylists = [...playlists, newPlaylist];
            const updatedMetadata = updateMetadata(updatedPlaylists);

            setPlaylistData({
                ...playlistData,
                playlists: updatedPlaylists,
                metadata: updatedMetadata
            });

            // Analytics event
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'import_playlist', {
                    playlist_id: newId,
                    video_count: newPlaylist.videoCount
                });
            }

            return true;
        } catch (error) {
            console.error('Error importing playlist:', error);
            return false;
        }
    }, [playlists, playlistData, setPlaylistData, updateMetadata]);

    // Generate shareable URL with base64 encoded playlist data
    const getShareableUrl = useCallback((playlistId: string): string => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return '';

        try {
            const shareData = {
                version: '1.0.0',
                playlist: {
                    ...playlist,
                    isPublic: true
                },
                sharedAt: new Date().toISOString()
            };

            const jsonString = JSON.stringify(shareData);
            const encodedData = btoa(encodeURIComponent(jsonString));
            const baseUrl = window.location.origin;

            return `${baseUrl}/shared-playlist?data=${encodedData}`;
        } catch (error) {
            console.error('Error generating shareable URL:', error);
            return '';
        }
    }, [playlists]);

    // Load shared playlist from encoded data
    const loadSharedPlaylist = useCallback((encodedData: string): Playlist | null => {
        try {
            const jsonString = decodeURIComponent(atob(encodedData));
            const shareData = JSON.parse(jsonString);

            if (!shareData.playlist || !shareData.version) {
                console.error('Invalid shared playlist data');
                return null;
            }

            return shareData.playlist;
        } catch (error) {
            console.error('Error loading shared playlist:', error);
            return null;
        }
    }, []);

    // Get playlist by ID
    const getPlaylistById = useCallback((id: string): Playlist | undefined => {
        return playlists.find(p => p.id === id);
    }, [playlists]);

    // Duplicate playlist
    const duplicatePlaylist = useCallback((id: string): string | null => {
        const playlist = playlists.find(p => p.id === id);
        if (!playlist) return null;

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();

        const duplicatedPlaylist: Playlist = {
            ...playlist,
            id: newId,
            name: `${playlist.name} (Copy)`,
            createdAt: now,
            updatedAt: now
        };

        const updatedPlaylists = [...playlists, duplicatedPlaylist];
        const updatedMetadata = updateMetadata(updatedPlaylists);

        setPlaylistData({
            ...playlistData,
            playlists: updatedPlaylists,
            metadata: updatedMetadata
        });

        return newId;
    }, [playlists, playlistData, setPlaylistData, updateMetadata]);

    // Clear all playlists
    const clearAllPlaylists = useCallback(() => {
        setPlaylistData({
            ...playlistData,
            playlists: [],
            metadata: updateMetadata([])
        });
        setCurrentPlaylist(null);

        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'clear_all_playlists', {
                playlist_count: playlists.length
            });
        }
    }, [playlistData, setPlaylistData, updateMetadata, playlists.length]);

    // Get metadata
    const getMetadata = useCallback((): PlaylistMetadata => {
        return playlistData.metadata;
    }, [playlistData.metadata]);

    // Get settings
    const getSettings = useCallback((): PlaylistSettings => {
        return playlistData.settings;
    }, [playlistData.settings]);

    // Update settings
    const updateSettings = useCallback((newSettings: Partial<PlaylistSettings>) => {
        setPlaylistData({
            ...playlistData,
            settings: {
                ...playlistData.settings,
                ...newSettings
            }
        });
    }, [playlistData, setPlaylistData]);

    // Check if video is in playlist
    const isVideoInPlaylist = useCallback((playlistId: string, videoId: string): boolean => {
        const playlist = playlists.find(p => p.id === playlistId);
        return playlist ? playlist.videos.some(v => v.id.toString() === videoId) : false;
    }, [playlists]);

    // Get playlists containing a specific video
    const getPlaylistsContainingVideo = useCallback((videoId: string): Playlist[] => {
        return playlists.filter(playlist =>
            playlist.videos.some(v => v.id.toString() === videoId)
        );
    }, [playlists]);

    // Search playlists
    const searchPlaylists = useCallback((query: string): Playlist[] => {
        if (!query.trim()) return playlists;

        const searchTerm = query.toLowerCase().trim();
        return playlists.filter(playlist =>
            playlist.name.toLowerCase().includes(searchTerm) ||
            playlist.description.toLowerCase().includes(searchTerm) ||
            playlist.category?.toLowerCase().includes(searchTerm) ||
            playlist.videos.some(video =>
                video.title.toLowerCase().includes(searchTerm) ||
                video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            )
        );
    }, [playlists]);

    // Initialize default playlists on first load
    useEffect(() => {
        if (playlists.length === 0 && playlistData.version === '1.0.0') {
            // Create default "Watch Later" playlist
            createPlaylist('Watch Later', 'Videos you want to watch later');

            // Analytics event for first-time setup
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'playlist_system_initialized', {
                    default_playlists_created: 1
                });
            }
        }
    }, [playlists.length, playlistData.version, createPlaylist]);

    const contextValue: PlaylistContextType = {
        playlists,
        currentPlaylist,
        createPlaylist,
        deletePlaylist,
        updatePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        reorderPlaylistVideos,
        exportPlaylist,
        importPlaylist,
        getShareableUrl,
        loadSharedPlaylist,
        getPlaylistById,
        duplicatePlaylist,
        clearAllPlaylists,
        getMetadata,
        getSettings,
        updateSettings,
        isVideoInPlaylist,
        getPlaylistsContainingVideo,
        searchPlaylists
    };

    return (
        <PlaylistContext.Provider value={contextValue}>
            {children}
        </PlaylistContext.Provider>
    );
}

export function usePlaylist() {
    const context = useContext(PlaylistContext);
    if (context === undefined) {
        throw new Error('usePlaylist must be used within a PlaylistProvider');
    }
    return context;
}

export type { PlaylistContextType, Playlist, PlaylistMetadata, PlaylistSettings };
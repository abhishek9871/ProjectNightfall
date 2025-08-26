import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Video } from '../../types';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { assignVideoToCluster } from '../utils/clusterAssignment';

// Favorites data schema as per design specification
interface FavoriteData {
  videoId: string;
  dateAdded: string;
  category: string;
  title: string;
}

interface FavoritesMetadata {
  totalCount: number;
  lastUpdated: string;
  categories: Record<string, number>;
}

interface FavoritesSettings {
  sortPreference: 'recent' | 'title' | 'rating' | 'category';
  displayMode: 'grid' | 'list';
  autoBackup: boolean;
}

interface FavoritesData {
  version: string;
  favorites: FavoriteData[];
  metadata: FavoritesMetadata;
  settings: FavoritesSettings;
}

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (videoId: string, video?: Video) => void;
  removeFavorite: (videoId: string) => void;
  isFavorite: (videoId: string) => boolean;
  clearAllFavorites: () => void;
  favoritesCount: number;
  recentlyAdded: string[];
  exportFavorites: () => string;
  importFavorites: (data: string) => boolean;
  getFavoriteData: (videoId: string) => FavoriteData | undefined;
  getFavoritesByCategory: (category: string) => FavoriteData[];
  getMetadata: () => FavoritesMetadata;
  getSettings: () => FavoritesSettings;
  updateSettings: (settings: Partial<FavoritesSettings>) => void;
  bulkRemove: (videoIds: string[]) => void;
  removeByCategory: (category: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const DEFAULT_FAVORITES_DATA: FavoritesData = {
  version: '1.0.0',
  favorites: [],
  metadata: {
    totalCount: 0,
    lastUpdated: new Date().toISOString(),
    categories: {}
  },
  settings: {
    sortPreference: 'recent',
    displayMode: 'grid',
    autoBackup: false
  }
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoritesData, setFavoritesData] = useLocalStorage<FavoritesData>('favorites_data', DEFAULT_FAVORITES_DATA);
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);

  // Derived state for easy access
  const favorites = favoritesData.favorites.map(f => f.videoId);
  const favoritesCount = favoritesData.metadata.totalCount;

  // Update metadata helper
  const updateMetadata = useCallback((favorites: FavoriteData[]) => {
    const categories: Record<string, number> = {};
    favorites.forEach(fav => {
      categories[fav.category] = (categories[fav.category] || 0) + 1;
    });

    return {
      totalCount: favorites.length,
      lastUpdated: new Date().toISOString(),
      categories
    };
  }, []);

  // Add favorite with full metadata and proper category mapping
  const addFavorite = useCallback((videoId: string, video?: Video) => {
    if (favorites.includes(videoId)) return;

    // Get the correct structured category for this video
    const getStructuredCategory = (video?: Video): string => {
      if (!video) return 'unknown';
      
      // Use cluster assignment to get the proper category
      const clusterId = assignVideoToCluster(video);
      const allCurrentCategories = [...categories, ...specialtyClusters];
      const structuredCategory = allCurrentCategories.find(cat => cat.id === clusterId);
      
      return structuredCategory?.name || video.category || 'unknown';
    };

    const newFavorite: FavoriteData = {
      videoId,
      dateAdded: new Date().toISOString(),
      category: getStructuredCategory(video),
      title: video?.title || `Video ${videoId}`
    };

    const updatedFavorites = [...favoritesData.favorites, newFavorite];
    const updatedMetadata = updateMetadata(updatedFavorites);

    setFavoritesData({
      ...favoritesData,
      favorites: updatedFavorites,
      metadata: updatedMetadata
    });

    // Track recently added (last 5)
    setRecentlyAdded(prev => {
      const updated = [videoId, ...prev.filter(id => id !== videoId)];
      return updated.slice(0, 5);
    });

    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_favorites', {
        video_id: videoId,
        video_title: video?.title || '',
        video_category: getStructuredCategory(video),
        source_page: window.location.pathname
      });
    }
  }, [favorites, favoritesData, setFavoritesData, updateMetadata]);

  // Remove favorite
  const removeFavorite = useCallback((videoId: string) => {
    const updatedFavorites = favoritesData.favorites.filter(f => f.videoId !== videoId);
    const updatedMetadata = updateMetadata(updatedFavorites);

    setFavoritesData({
      ...favoritesData,
      favorites: updatedFavorites,
      metadata: updatedMetadata
    });

    // Remove from recently added
    setRecentlyAdded(prev => prev.filter(id => id !== videoId));

    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'remove_from_favorites', {
        video_id: videoId,
        reason: 'user_action'
      });
    }
  }, [favoritesData, setFavoritesData, updateMetadata]);

  // Check if video is favorited
  const isFavorite = useCallback((videoId: string): boolean => {
    return favorites.includes(videoId);
  }, [favorites]);

  // Clear all favorites
  const clearAllFavorites = useCallback(() => {
    setFavoritesData({
      ...favoritesData,
      favorites: [],
      metadata: updateMetadata([])
    });
    setRecentlyAdded([]);

    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'clear_all_favorites', {
        favorites_count: favoritesCount
      });
    }
  }, [favoritesData, setFavoritesData, updateMetadata, favoritesCount]);

  // Export favorites as JSON string
  const exportFavorites = useCallback((): string => {
    try {
      return JSON.stringify(favoritesData, null, 2);
    } catch (error) {
      console.error('Error exporting favorites:', error);
      return '';
    }
  }, [favoritesData]);

  // Import favorites from JSON string
  const importFavorites = useCallback((data: string): boolean => {
    try {
      const importedData: FavoritesData = JSON.parse(data);
      
      // Validate imported data structure
      if (!importedData.version || !Array.isArray(importedData.favorites)) {
        console.error('Invalid favorites data format');
        return false;
      }

      // Merge with existing favorites (avoid duplicates)
      const existingVideoIds = new Set(favorites);
      const newFavorites = importedData.favorites.filter(f => !existingVideoIds.has(f.videoId));
      
      const mergedFavorites = [...favoritesData.favorites, ...newFavorites];
      const updatedMetadata = updateMetadata(mergedFavorites);

      setFavoritesData({
        ...favoritesData,
        favorites: mergedFavorites,
        metadata: updatedMetadata
      });

      // Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'import_favorites', {
          imported_count: newFavorites.length,
          total_count: mergedFavorites.length
        });
      }

      return true;
    } catch (error) {
      console.error('Error importing favorites:', error);
      return false;
    }
  }, [favorites, favoritesData, setFavoritesData, updateMetadata]);

  // Get favorite data
  const getFavoriteData = useCallback((videoId: string): FavoriteData | undefined => {
    return favoritesData.favorites.find(f => f.videoId === videoId);
  }, [favoritesData.favorites]);

  // Get favorites by category
  const getFavoritesByCategory = useCallback((category: string): FavoriteData[] => {
    return favoritesData.favorites.filter(f => f.category === category);
  }, [favoritesData.favorites]);

  // Get metadata
  const getMetadata = useCallback((): FavoritesMetadata => {
    return favoritesData.metadata;
  }, [favoritesData.metadata]);

  // Get settings
  const getSettings = useCallback((): FavoritesSettings => {
    return favoritesData.settings;
  }, [favoritesData.settings]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<FavoritesSettings>) => {
    setFavoritesData({
      ...favoritesData,
      settings: {
        ...favoritesData.settings,
        ...newSettings
      }
    });
  }, [favoritesData, setFavoritesData]);

  // Bulk remove favorites
  const bulkRemove = useCallback((videoIds: string[]) => {
    const updatedFavorites = favoritesData.favorites.filter(f => !videoIds.includes(f.videoId));
    const updatedMetadata = updateMetadata(updatedFavorites);

    setFavoritesData({
      ...favoritesData,
      favorites: updatedFavorites,
      metadata: updatedMetadata
    });

    // Update recently added
    setRecentlyAdded(prev => prev.filter(id => !videoIds.includes(id)));

    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bulk_remove_favorites', {
        removed_count: videoIds.length,
        reason: 'bulk_remove'
      });
    }
  }, [favoritesData, setFavoritesData, updateMetadata]);

  // Remove by category
  const removeByCategory = useCallback((category: string) => {
    const updatedFavorites = favoritesData.favorites.filter(f => f.category !== category);
    const updatedMetadata = updateMetadata(updatedFavorites);
    const removedIds = favoritesData.favorites
      .filter(f => f.category === category)
      .map(f => f.videoId);

    setFavoritesData({
      ...favoritesData,
      favorites: updatedFavorites,
      metadata: updatedMetadata
    });

    // Update recently added
    setRecentlyAdded(prev => prev.filter(id => !removedIds.includes(id)));

    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'remove_category_favorites', {
        category,
        removed_count: removedIds.length
      });
    }
  }, [favoritesData, setFavoritesData, updateMetadata]);

  // Initialize recently added from stored data
  useEffect(() => {
    const recent = favoritesData.favorites
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 5)
      .map(f => f.videoId);
    setRecentlyAdded(recent);
  }, [favoritesData.favorites]);

  const contextValue: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    favoritesCount,
    recentlyAdded,
    exportFavorites,
    importFavorites,
    getFavoriteData,
    getFavoritesByCategory,
    getMetadata,
    getSettings,
    updateSettings,
    bulkRemove,
    removeByCategory
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

export type { FavoritesContextType, FavoriteData, FavoritesMetadata, FavoritesSettings };
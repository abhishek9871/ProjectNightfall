import { Video, Category } from '../../types';
import { assignVideoToCluster } from './clusterAssignment';

/**
 * Enhanced category-aware search algorithm extracted from VideoGrid
 * Provides consistent search results across all pages
 * 
 * Features:
 * - Category-aware search using assignVideoToCluster()
 * - When searching "MILF", returns ALL videos assigned to MILF category PLUS text matches
 * - Searches fields: title, tags, category names (NO description field for precision)
 * - Combines category videos + text matches with deduplication
 * - Ensures identical result counts across all pages for same search terms
 */
export function filterVideosBySearchQuery(
  videos: Video[],
  searchQuery: string,
  categories: Category[],
  specialtyClusters: Category[]
): Video[] {
  if (!searchQuery.trim()) {
    return videos;
  }

  const query = searchQuery.toLowerCase();
  let filtered = [...videos];
  
  // Find if search query matches any category name
  const allCategories = [...categories, ...specialtyClusters];
  const matchingCategory = allCategories.find(cat => 
    cat.name.toLowerCase().includes(query) ||
    cat.slug.toLowerCase().includes(query) ||
    cat.id.toLowerCase().includes(query)
  );
  
  if (matchingCategory) {
    // Category search: get all videos assigned to this category + text matches
    const categoryVideos = filtered.filter(video => 
      assignVideoToCluster(video) === matchingCategory.id
    );
    
    const textMatchVideos = filtered.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query)) ||
      video.category.toLowerCase().includes(query)
    );
    
    // Combine and deduplicate
    const videoIds = new Set();
    filtered = [...categoryVideos, ...textMatchVideos].filter(video => {
      if (videoIds.has(video.id)) return false;
      videoIds.add(video.id);
      return true;
    });
  } else {
    // Regular text search - NO description field for precision
    filtered = filtered.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query)) ||
      video.category.toLowerCase().includes(query)
    );
  }
  
  return filtered;
}
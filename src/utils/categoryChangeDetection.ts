import { videos } from '../../data/videos';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';
import { getVideosForCluster } from './clusterAssignment';

export interface CategorySnapshot {
  categoryId: string;
  videoIds: number[];
  videoCount: number;
  lastModified: string;
}

export interface ChangeDetectionResult {
  changedCategories: string[];
  categorySnapshots: CategorySnapshot[];
  lastBuildTime: string;
}

/**
 * Generate current snapshot of all categories
 */
export function generateCategorySnapshots(): CategorySnapshot[] {
  const allCategories = [...categories, ...specialtyClusters];
  const snapshots: CategorySnapshot[] = [];
  
  for (const category of allCategories) {
    const isSpecialtyCluster = specialtyClusters.some(c => c.id === category.id);
    
    let categoryVideos;
    if (isSpecialtyCluster) {
      categoryVideos = getVideosForCluster(videos, category.id);
    } else {
      categoryVideos = videos.filter(v => 
        v.category.toLowerCase() === category.id.toLowerCase()
      );
    }
    
    // Sort by ID for consistent comparison
    const videoIds = categoryVideos.map(v => v.id).sort((a, b) => a - b);
    
    snapshots.push({
      categoryId: category.id,
      videoIds,
      videoCount: videoIds.length,
      lastModified: new Date().toISOString()
    });
  }
  
  return snapshots;
}

/**
 * Compare current state with previous snapshot to detect changes
 */
export function detectCategoryChanges(
  previousSnapshots: CategorySnapshot[]
): ChangeDetectionResult {
  const currentSnapshots = generateCategorySnapshots();
  const changedCategories: string[] = [];
  
  // Create lookup map for previous snapshots
  const previousMap = new Map<string, CategorySnapshot>();
  previousSnapshots.forEach(snapshot => {
    previousMap.set(snapshot.categoryId, snapshot);
  });
  
  // Compare each current snapshot with previous
  for (const currentSnapshot of currentSnapshots) {
    const previousSnapshot = previousMap.get(currentSnapshot.categoryId);
    
    if (!previousSnapshot) {
      // New category
      changedCategories.push(currentSnapshot.categoryId);
      continue;
    }
    
    // Check if video count changed
    if (currentSnapshot.videoCount !== previousSnapshot.videoCount) {
      changedCategories.push(currentSnapshot.categoryId);
      continue;
    }
    
    // Check if video IDs changed (different videos or order)
    const currentIds = currentSnapshot.videoIds.join(',');
    const previousIds = previousSnapshot.videoIds.join(',');
    
    if (currentIds !== previousIds) {
      changedCategories.push(currentSnapshot.categoryId);
    }
  }
  
  return {
    changedCategories,
    categorySnapshots: currentSnapshots,
    lastBuildTime: new Date().toISOString()
  };
}

/**
 * Get category slug from category ID
 */
export function getCategorySlug(categoryId: string): string {
  const category = [...categories, ...specialtyClusters].find(c => c.id === categoryId);
  return category?.slug || categoryId;
}

/**
 * Get URLs for changed categories
 */
export function getChangedCategoryUrls(changedCategoryIds: string[], baseUrl: string = 'https://project-nightfall.pages.dev'): string[] {
  return changedCategoryIds.map(categoryId => {
    const slug = getCategorySlug(categoryId);
    return `${baseUrl}/category/${slug}`;
  });
}
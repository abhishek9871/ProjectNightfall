import { Video } from '../../types';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../data/specialtyClusters';

/**
 * Assigns videos to specialty clusters based on content analysis
 * Ensures 100% coverage with no orphaned videos
 */
export function assignVideoToCluster(video: Video): string {
    // First check if video belongs to any of the 8 core pillars
    const pillarCategory = categories.find(cat =>
        cat.name.toLowerCase() === video.category.toLowerCase() ||
        cat.id.toLowerCase() === video.category.toLowerCase()
    );

    if (pillarCategory) {
        return pillarCategory.id;
    }

    // If not in pillars, assign to specialty clusters based on keywords
    const title = video.title.toLowerCase();
    const tags = video.tags.map(tag => tag.toLowerCase());
    const description = video.description.toLowerCase();
    const allText = `${title} ${tags.join(' ')} ${description}`;

    // Priority-based cluster assignment
    if (allText.includes('bbw') || allText.includes('big') || allText.includes('curvy')) {
        return 'bbw';
    }

    if (allText.includes('threesome') || allText.includes('group') || allText.includes('multiple')) {
        return 'threesome';
    }

    if (allText.includes('mature') || allText.includes('older') || allText.includes('experienced')) {
        return 'mature';
    }

    if (allText.includes('interracial') || allText.includes('mixed') || allText.includes('black') || allText.includes('ebony')) {
        return 'interracial';
    }

    if (allText.includes('cosplay') || allText.includes('costume') || allText.includes('roleplay')) {
        return 'cosplay';
    }

    if (allText.includes('hardcore') || allText.includes('rough') || allText.includes('intense')) {
        return 'hardcore';
    }

    if (allText.includes('fetish') || allText.includes('bdsm') || allText.includes('kinky')) {
        return 'fetish';
    }

    // Fallback to misc for any remaining videos
    return 'misc';
}

/**
 * Gets all videos for a specific cluster (pillar or specialty)
 */
export function getVideosForCluster(videos: Video[], clusterId: string): Video[] {
    return videos.filter(video => assignVideoToCluster(video) === clusterId);
}

/**
 * Computes video counts for all categories (pillars + specialty clusters)
 */
export function computeCategoryCounts(videos: Video[]): Record<string, number> {
    const counts: Record<string, number> = {};

    // Initialize all categories with 0
    [...categories, ...specialtyClusters].forEach(cat => {
        counts[cat.id] = 0;
    });

    // Count videos for each category
    videos.forEach(video => {
        const clusterId = assignVideoToCluster(video);
        counts[clusterId] = (counts[clusterId] || 0) + 1;
    });

    return counts;
}
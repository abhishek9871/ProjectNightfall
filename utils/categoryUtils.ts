import { categories, allCategories } from '../data/categories';

/**
 * Convert a category name to its corresponding slug
 */
export function getCategorySlug(categoryName: string): string {
  // First try to find in main categories
  const mainCategory = categories.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  
  if (mainCategory) {
    return mainCategory.slug;
  }
  
  // Then try all categories
  const allCategory = allCategories.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  
  if (allCategory) {
    return allCategory.slug;
  }
  
  // Fallback: convert name to slug format
  return categoryName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get category info by name
 */
export function getCategoryByName(categoryName: string) {
  return allCategories.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
}
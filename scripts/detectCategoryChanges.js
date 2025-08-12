// scripts/detectCategoryChanges.js
// Detect which category pages have changed content and need reindexing

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SNAPSHOTS_FILE = path.resolve(process.cwd(), '.category-snapshots.json');
const SITE_URL = 'https://project-nightfall.pages.dev';

// Import category data (simplified parsing for Node.js)
function loadCategoryData() {
  // Read categories
  const categoriesPath = path.resolve(process.cwd(), 'data/categories.ts');
  const categoriesContent = fs.readFileSync(categoriesPath, 'utf-8');
  const categoriesMatch = categoriesContent.match(/export const categories: Category\[\] = \[([\s\S]*?)\];/);
  if (!categoriesMatch) throw new Error('Could not find categories array');
  
  const categoriesData = categoriesMatch[1];
  const categoryMatches = [...categoriesData.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*slug:\s*'([^']+)'/g)];
  const categories = categoryMatches.map(match => ({ id: match[1], slug: match[2] }));

  // Read specialty clusters
  const clustersPath = path.resolve(process.cwd(), 'src/data/specialtyClusters.ts');
  const clustersContent = fs.readFileSync(clustersPath, 'utf-8');
  const clustersMatch = clustersContent.match(/export const specialtyClusters: Category\[\] = \[([\s\S]*?)\];/);
  if (!clustersMatch) throw new Error('Could not find specialtyClusters array');
  
  const clustersData = clustersMatch[1];
  const clusterMatches = [...clustersData.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*slug:\s*'([^']+)'/g)];
  const specialtyClusters = clusterMatches.map(match => ({ id: match[1], slug: match[2] }));

  return { categories, specialtyClusters };
}

// Simple video count extraction (approximation for change detection)
function getVideoCounts() {
  const videosPath = path.resolve(process.cwd(), 'data/videos.ts');
  const videosContent = fs.readFileSync(videosPath, 'utf-8');
  
  // Count videos by category (improved matching)
  const categoryMatches = [...videosContent.matchAll(/"category":\s*"([^"]+)"/g)];
  const categoryCounts = {};
  
  categoryMatches.forEach(match => {
    const category = match[1].toLowerCase();
    // Map common category names to IDs
    const categoryMap = {
      'milf': 'milf',
      'amateur': 'amateur', 
      'pov': 'pov',
      'japanese': 'japanese',
      'teen': 'teen',
      'lesbian': 'lesbian',
      'anal': 'anal',
      'big tits': 'big-tits',
      'ebony': 'interracial',
      'group': 'threesome',
      'office': 'hardcore',
      'gaming': 'misc',
      'desi': 'interracial',
      'college': 'teen',
      'latin': 'interracial',
      'romance': 'misc',
      'asian': 'interracial',
      'couple': 'misc',
      'fitness': 'misc',
      'outdoor': 'misc',
      'bdsm': 'fetish',
      'cheating': 'hardcore',
      'massage': 'misc',
      'vintage': 'mature',
      'roleplay': 'cosplay'
    };
    
    const mappedCategory = categoryMap[category] || 'misc';
    categoryCounts[mappedCategory] = (categoryCounts[mappedCategory] || 0) + 1;
  });
  
  return categoryCounts;
}

// Generate current snapshot
function generateCurrentSnapshot() {
  const { categories, specialtyClusters } = loadCategoryData();
  const videoCounts = getVideoCounts();
  const allCategories = [...categories, ...specialtyClusters];
  
  const snapshots = allCategories.map(category => ({
    categoryId: category.id,
    slug: category.slug,
    videoCount: videoCounts[category.id] || videoCounts[category.name] || 0,
    lastModified: new Date().toISOString()
  }));
  
  return {
    snapshots,
    lastBuildTime: new Date().toISOString()
  };
}

// Load previous snapshot
function loadPreviousSnapshot() {
  if (!fs.existsSync(SNAPSHOTS_FILE)) {
    console.log('📝 No previous snapshot found. Creating initial snapshot...');
    return null;
  }
  
  try {
    const content = fs.readFileSync(SNAPSHOTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.log('⚠️  Error reading previous snapshot, creating new one...');
    return null;
  }
}

// Detect changes
function detectChanges(previousSnapshot, currentSnapshot) {
  if (!previousSnapshot) {
    // First run - all categories are "changed"
    return currentSnapshot.snapshots.map(s => s.categoryId);
  }
  
  const changedCategories = [];
  const previousMap = new Map();
  
  previousSnapshot.snapshots.forEach(s => {
    previousMap.set(s.categoryId, s);
  });
  
  currentSnapshot.snapshots.forEach(current => {
    const previous = previousMap.get(current.categoryId);
    
    if (!previous || current.videoCount !== previous.videoCount) {
      changedCategories.push(current.categoryId);
    }
  });
  
  return changedCategories;
}

// Main function
async function detectCategoryChanges() {
  console.log('🔍 Detecting category content changes...\n');
  
  const previousSnapshot = loadPreviousSnapshot();
  const currentSnapshot = generateCurrentSnapshot();
  const changedCategoryIds = detectChanges(previousSnapshot, currentSnapshot);
  
  console.log(`📊 Analysis Results:`);
  console.log(`   - Total categories: ${currentSnapshot.snapshots.length}`);
  console.log(`   - Changed categories: ${changedCategoryIds.length}`);
  
  if (changedCategoryIds.length === 0) {
    console.log('\n✅ No category changes detected. No indexing needed.');
    return;
  }
  
  // Get changed category URLs
  const changedUrls = changedCategoryIds.map(categoryId => {
    const snapshot = currentSnapshot.snapshots.find(s => s.categoryId === categoryId);
    return `${SITE_URL}/category/${snapshot.slug}`;
  });
  
  console.log(`\n📝 Changed categories:`);
  changedCategoryIds.forEach(categoryId => {
    const snapshot = currentSnapshot.snapshots.find(s => s.categoryId === categoryId);
    const previous = previousSnapshot?.snapshots.find(s => s.categoryId === categoryId);
    const prevCount = previous?.videoCount || 0;
    console.log(`   - ${categoryId}: ${prevCount} → ${snapshot.videoCount} videos`);
  });
  
  // Submit to IndexNow
  console.log('\n🔄 Submitting changed URLs to IndexNow...');
  try {
    const indexNowCommand = `node scripts/indexNow.js ${changedUrls.join(' ')}`;
    const stdout = execSync(indexNowCommand, { encoding: 'utf-8' });
    console.log(stdout);
  } catch (error) {
    console.error('❌ IndexNow submission failed:', error.message);
  }
  
  // Save current snapshot for next comparison
  fs.writeFileSync(SNAPSHOTS_FILE, JSON.stringify(currentSnapshot, null, 2));
  console.log(`\n💾 Snapshot saved for next comparison`);
  console.log(`✅ Change detection completed!`);
}

// Run the function
detectCategoryChanges().catch(console.error);

export { detectCategoryChanges };
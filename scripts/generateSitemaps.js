// scripts/generateSitemaps.js
import fs from 'fs';
import path from 'path';

// Since we can't directly import TypeScript, we'll read and parse the categories
const categoriesPath = path.resolve(process.cwd(), 'data/categories.ts');
const categoriesContent = fs.readFileSync(categoriesPath, 'utf-8');

// Extract the main categories array from the TypeScript file
const categoriesMatch = categoriesContent.match(/export const categories: Category\[\] = \[([\s\S]*?)\];/);
if (!categoriesMatch) {
    throw new Error('Could not find categories array in categories.ts');
}

// Parse the categories data
const categoriesData = categoriesMatch[1];
const categoryMatches = [...categoriesData.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*slug:\s*'([^']+)'/g)];

const categories = categoryMatches.map(match => ({
    id: match[1],
    slug: match[2]
}));

// Read and parse specialty clusters
const specialtyClustersPath = path.resolve(process.cwd(), 'src/data/specialtyClusters.ts');
const specialtyClustersContent = fs.readFileSync(specialtyClustersPath, 'utf-8');

// Extract the specialty clusters array
const clustersMatch = specialtyClustersContent.match(/export const specialtyClusters: Category\[\] = \[([\s\S]*?)\];/);
if (!clustersMatch) {
    throw new Error('Could not find specialtyClusters array in specialtyClusters.ts');
}

// Parse the specialty clusters data
const clustersData = clustersMatch[1];
const clusterMatches = [...clustersData.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*slug:\s*'([^']+)'/g)];

const specialtyClusters = clusterMatches.map(match => ({
    id: match[1],
    slug: match[2]
}));

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SITE_URL = 'https://project-nightfall.pages.dev';

function generateCategorySitemap() {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Load category snapshots for accurate lastmod dates
    const snapshotsPath = path.resolve(process.cwd(), '.category-snapshots.json');
    let categoryLastMod = {};
    
    if (fs.existsSync(snapshotsPath)) {
        try {
            const snapshots = JSON.parse(fs.readFileSync(snapshotsPath, 'utf-8'));
            snapshots.snapshots?.forEach(snapshot => {
                categoryLastMod[snapshot.categoryId] = snapshot.lastModified.split('T')[0];
            });
        } catch (error) {
            console.log('⚠️  Could not read category snapshots, using current date');
        }
    }
    
    // Combine all categories (pillars + specialty clusters)
    const allCategories = [...categories, ...specialtyClusters];
    
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/categories</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${allCategories.map(category => {
    const lastmod = categoryLastMod[category.id] || currentDate;
    return `  <url>
    <loc>${SITE_URL}/category/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
}).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'category-sitemap.xml'), sitemapContent);
    console.log(`✅ Category sitemap generated with ${allCategories.length + 1} URLs (hub + categories).`);
    console.log(`   - Categories hub: /categories`);
    console.log(`   - Main categories: ${categories.length}`);
    console.log(`   - Specialty clusters: ${specialtyClusters.length}`);
    
    // Show lastmod info
    const uniqueLastMods = new Set(Object.values(categoryLastMod));
    if (uniqueLastMods.size > 0) {
        console.log(`   - Using ${uniqueLastMods.size} different lastmod dates from content changes`);
    }
}

// Execute the function
generateCategorySitemap();
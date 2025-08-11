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

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SITE_URL = 'https://project-nightfall.pages.dev';

function generateCategorySitemap() {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories.map(category => `  <url>
    <loc>${SITE_URL}/category/${category.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'category-sitemap.xml'), sitemapContent);
    console.log(`✅ Category sitemap generated with ${categories.length} categories.`);
}

// Execute the function
generateCategorySitemap();
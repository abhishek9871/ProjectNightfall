// scripts/indexAllCategories.js
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const SITE_URL = 'https://project-nightfall.pages.dev';

// Parse categories from TypeScript file
const categoriesPath = path.resolve(process.cwd(), 'data/categories.ts');
const categoriesContent = fs.readFileSync(categoriesPath, 'utf-8');
const categoriesMatch = categoriesContent.match(/export const categories: Category\[\] = \[([\s\S]*?)\];/);

if (!categoriesMatch) {
  throw new Error('Could not find categories array in categories.ts');
}

const categoriesData = categoriesMatch[1];
const categoryMatches = [...categoriesData.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*slug:\s*'([^']+)'/g)];

const categories = categoryMatches.map(match => ({
  id: match[1],
  slug: match[2]
}));

async function indexAllCategories() {
  console.log(`🚀 Starting indexing process for ${categories.length} categories...`);
  
  // Generate category URLs
  const categoryUrls = categories.map(cat => `${SITE_URL}/category/${cat.slug}`);
  
  // Add main pages
  const mainUrls = [
    SITE_URL,
    `${SITE_URL}/trending`,
    `${SITE_URL}/categories`,
    `${SITE_URL}/top-rated`
  ];
  
  const allUrls = [...mainUrls, ...categoryUrls];
  
  console.log(`📋 URLs to index: ${allUrls.length}`);
  console.log('Main pages:', mainUrls.length);
  console.log('Category pages:', categoryUrls.length);
  
  // Submit to IndexNow (batch submission)
  console.log('\n🔄 Submitting to IndexNow...');
  try {
    const { stdout, stderr } = await execAsync(`node scripts/indexNow.js ${allUrls.join(' ')}`);
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error('❌ IndexNow submission failed:', error.message);
  }
  
  // Submit to Google (individual submissions due to API limitations)
  console.log('\n🔄 Submitting to Google Search Console...');
  for (const url of allUrls) {
    try {
      const { stdout, stderr } = await execAsync(`node scripts/indexGoogle.js "${url}"`);
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Google submission failed for ${url}:`, error.message);
    }
  }
  
  console.log('\n✅ Indexing process completed!');
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  indexAllCategories().catch(console.error);
}

export { indexAllCategories };
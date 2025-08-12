// scripts/indexHub.js
// Index the categories hub and all category pages for optimal discovery

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://project-nightfall.pages.dev';

// Read and parse categories
const categoriesPath = path.resolve(process.cwd(), 'data/categories.ts');
const categoriesContent = fs.readFileSync(categoriesPath, 'utf-8');
const categoriesMatch = categoriesContent.match(/export const categories: Category\[\] = \[([\s\S]*?)\];/);
if (!categoriesMatch) {
    throw new Error('Could not find categories array in categories.ts');
}
const categoriesData = categoriesMatch[1];
const categoryMatches = [...categoriesData.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*slug:\s*'([^']+)'/g)];
const categories = categoryMatches.map(match => ({ id: match[1], slug: match[2] }));

// Read and parse specialty clusters
const specialtyClustersPath = path.resolve(process.cwd(), 'src/data/specialtyClusters.ts');
const specialtyClustersContent = fs.readFileSync(specialtyClustersPath, 'utf-8');
const clustersMatch = specialtyClustersContent.match(/export const specialtyClusters: Category\[\] = \[([\s\S]*?)\];/);
if (!clustersMatch) {
    throw new Error('Could not find specialtyClusters array in specialtyClusters.ts');
}
const clustersData = clustersMatch[1];
const clusterMatches = [...clustersData.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*slug:\s*'([^']+)'/g)];
const specialtyClusters = clusterMatches.map(match => ({ id: match[1], slug: match[2] }));

async function indexHub() {
    console.log('🚀 Starting hub indexing process...\n');
    
    // Generate URLs
    const hubUrl = `${SITE_URL}/categories`;
    const categoryUrls = [...categories, ...specialtyClusters].map(cat => `${SITE_URL}/category/${cat.slug}`);
    const allUrls = [hubUrl, ...categoryUrls];
    
    console.log(`📊 URLs to index:`);
    console.log(`   - Categories hub: 1`);
    console.log(`   - Main categories: ${categories.length}`);
    console.log(`   - Specialty clusters: ${specialtyClusters.length}`);
    console.log(`   - Total URLs: ${allUrls.length}\n`);
    
    // Submit to IndexNow (batch submission)
    console.log('🔄 Submitting to IndexNow...');
    try {
        const indexNowCommand = `node scripts/indexNow.js ${allUrls.join(' ')}`;
        const stdout = execSync(indexNowCommand, { encoding: 'utf-8' });
        console.log(stdout);
    } catch (error) {
        console.error('❌ IndexNow submission failed:', error.message);
    }
    
    // Submit top priority URLs to Google Indexing API
    console.log('\n🔄 Submitting priority URLs to Google Indexing API...');
    const priorityUrls = [hubUrl, ...categoryUrls.slice(0, 10)]; // Hub + top 10 categories
    
    for (const url of priorityUrls) {
        try {
            const googleCommand = `node scripts/indexGoogle.js "${url}" "URL_UPDATED"`;
            const stdout = execSync(googleCommand, { encoding: 'utf-8' });
            console.log(`✅ Google: ${url}`);
        } catch (error) {
            console.log(`⚠️  Google: ${url} - ${error.message.split('\n')[0]}`);
        }
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n✅ Hub indexing process completed!');
    console.log(`📈 Submitted ${allUrls.length} URLs to IndexNow`);
    console.log(`📈 Submitted ${priorityUrls.length} priority URLs to Google`);
}

// Run the indexing process
indexHub().catch(console.error);
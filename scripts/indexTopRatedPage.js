#!/usr/bin/env node

/**
 * IndexNow Submission Script for Top Rated Page
 * Automatically submits the top-rated page and its paginated URLs to IndexNow API
 * for rapid indexing across Google, Bing, and Yandex
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://project-nightfall.pages.dev';
const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY || 'your-indexnow-key-here';
const VIDEOS_PER_PAGE = 24;

// Load video data to calculate total pages
const videosPath = path.join(__dirname, '../data/videos.ts');
let totalVideos = 362; // Default fallback

try {
    const videosContent = fs.readFileSync(videosPath, 'utf8');
    const videoMatches = videosContent.match(/export const videos: Video\[\] = \[([\s\S]*?)\];/);
    if (videoMatches) {
        // Count video objects by counting opening braces
        const videoObjects = (videoMatches[1].match(/{\s*"id":/g) || []).length;
        totalVideos = videoObjects;
    }
} catch (error) {
    console.warn('Could not read videos file, using default count:', error.message);
}

const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

// Generate URLs to submit
const urlsToSubmit = [
    `${SITE_URL}/top-rated`, // Main top-rated page
    ...Array.from({ length: Math.min(totalPages, 10) }, (_, i) => 
        `${SITE_URL}/top-rated?page=${i + 1}`
    ).slice(1) // Skip page 1 as it's the same as main URL
];

console.log(`📊 Submitting ${urlsToSubmit.length} top-rated page URLs to IndexNow...`);
console.log(`📈 Total videos: ${totalVideos}, Total pages: ${totalPages}`);

// IndexNow submission function
function submitToIndexNow(urls) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            host: 'project-nightfall.pages.dev',
            key: INDEX_NOW_KEY,
            keyLocation: `${SITE_URL}/indexnow-key.txt`,
            urlList: urls
        });

        const options = {
            hostname: 'api.indexnow.org',
            port: 443,
            path: '/indexnow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true, data });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Submit to Google Indexing API (if available)
function submitToGoogleIndexing(urls) {
    // Note: Google Indexing API is limited to JobPosting and BroadcastEvent
    // This is a placeholder for future implementation if Google expands support
    console.log('📝 Google Indexing API submission skipped (limited to JobPosting/BroadcastEvent)');
    return Promise.resolve();
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting IndexNow submission...');
        
        // Submit to IndexNow
        await submitToIndexNow(urlsToSubmit);
        console.log('✅ Successfully submitted to IndexNow API');
        
        // Log submitted URLs
        console.log('\n📋 Submitted URLs:');
        urlsToSubmit.forEach((url, index) => {
            console.log(`   ${index + 1}. ${url}`);
        });
        
        // Submit to Google (placeholder)
        await submitToGoogleIndexing(urlsToSubmit);
        
        console.log('\n🎉 Top Rated page indexing submission completed!');
        console.log('⏱️  Expected indexing time:');
        console.log('   • Bing: 1-24 hours');
        console.log('   • Yandex: 1-48 hours');
        console.log('   • Google: 1-7 days (via sitemap discovery)');
        
    } catch (error) {
        console.error('❌ Error during submission:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { submitToIndexNow, urlsToSubmit };
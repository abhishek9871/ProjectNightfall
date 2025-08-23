import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract all URLs from all sitemaps
const extractAllUrls = () => {
    const baseUrl = 'https://project-nightfall.pages.dev';
    const allUrls = [];
    let mainUrls = [];
    let categoryUrls = [];
    let videoUrls = [];

    // 1. Main pages from main-sitemap.xml
    const mainSitemapPath = path.join(__dirname, '../dist/main-sitemap.xml');
    if (fs.existsSync(mainSitemapPath)) {
        const mainSitemap = fs.readFileSync(mainSitemapPath, 'utf8');
        mainUrls = mainSitemap.match(/<loc>(.*?)<\/loc>/g)?.map(match => 
            match.replace('<loc>', '').replace('</loc>', '')
        ) || [];
        allUrls.push(...mainUrls);
    }

    // 2. Category pages from category-sitemap.xml
    const categorySitemapPath = path.join(__dirname, '../dist/category-sitemap.xml');
    if (fs.existsSync(categorySitemapPath)) {
        const categorySitemap = fs.readFileSync(categorySitemapPath, 'utf8');
        categoryUrls = categorySitemap.match(/<loc>(.*?)<\/loc>/g)?.map(match => 
            match.replace('<loc>', '').replace('</loc>', '')
        ) || [];
        allUrls.push(...categoryUrls);
    }

    // 3. Video pages from video-sitemap.xml
    const videoSitemapPath = path.join(__dirname, '../dist/video-sitemap.xml');
    if (fs.existsSync(videoSitemapPath)) {
        const videoSitemap = fs.readFileSync(videoSitemapPath, 'utf8');
        videoUrls = videoSitemap.match(/<loc>(.*?)<\/loc>/g)?.map(match => 
            match.replace('<loc>', '').replace('</loc>', '')
        ) || [];
        allUrls.push(...videoUrls);
    }

    // Remove duplicates and return
    const uniqueUrls = [...new Set(allUrls)];
    console.log(`📊 Total URLs extracted: ${uniqueUrls.length}`);
    console.log(`   - Main pages: ${mainUrls.length}`);
    console.log(`   - Category pages: ${categoryUrls.length}`);
    console.log(`   - Video pages: ${videoUrls.length}`);
    
    return uniqueUrls;
};

// Save URLs to file for other scripts
const saveUrlsToFile = (urls) => {
    const urlsFilePath = path.join(__dirname, '../all-urls.json');
    fs.writeFileSync(urlsFilePath, JSON.stringify(urls, null, 2));
    console.log(`💾 URLs saved to: ${urlsFilePath}`);
    return urlsFilePath;
};

// Main execution
const allUrls = extractAllUrls();
const urlsFile = saveUrlsToFile(allUrls);

console.log(`\n🚀 Ready for submission:`);
console.log(`   - Run: npm run submit:google`);
console.log(`   - Run: npm run submit:indexnow`);
console.log(`   - Total URLs: ${allUrls.length}`);

export { extractAllUrls, saveUrlsToFile };
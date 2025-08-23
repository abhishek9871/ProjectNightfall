import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import video data
const videosPath = path.join(__dirname, '../data/videos.ts');
const videosContent = fs.readFileSync(videosPath, 'utf8');

// Extract video data (simple regex parsing for this script)
const videoMatches = videosContent.match(/{\s*"id":\s*\d+,[\s\S]*?}/g) || [];

const generateVideoSitemap = () => {
    const baseUrl = 'https://project-nightfall.pages.dev';
    const currentDate = new Date().toISOString();
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

    videoMatches.forEach((videoMatch, index) => {
        try {
            // Extract video data using regex (simplified for script)
            const idMatch = videoMatch.match(/"id":\s*(\d+)/);
            const titleMatch = videoMatch.match(/"title":\s*"([^"]+)"/);
            const descriptionMatch = videoMatch.match(/"description":\s*"([^"]+)"/);
            const durationMatch = videoMatch.match(/"duration":\s*"([^"]+)"/);
            const thumbnailMatch = videoMatch.match(/"thumbnailUrl":\s*"([^"]+)"/);
            const categoryMatch = videoMatch.match(/"category":\s*"([^"]+)"/);
            const uploadDateMatch = videoMatch.match(/"uploadDate":\s*"([^"]+)"/);
            const viewsMatch = videoMatch.match(/"views":\s*"([^"]+)"/);
            const ratingMatch = videoMatch.match(/"rating":\s*([\d.]+)/);

            if (!idMatch || !titleMatch) return;

            const videoId = idMatch[1];
            const title = titleMatch[1];
            const description = descriptionMatch ? descriptionMatch[1] : '';
            const duration = durationMatch ? durationMatch[1] : '';
            const thumbnail = thumbnailMatch ? thumbnailMatch[1] : `https://picsum.photos/seed/video${videoId}/400/225`;
            const category = categoryMatch ? categoryMatch[1] : '';
            const uploadDate = uploadDateMatch ? uploadDateMatch[1] : currentDate;
            const views = viewsMatch ? viewsMatch[1] : '';
            const rating = ratingMatch ? ratingMatch[1] : '4.0';

            // Convert duration to seconds for video sitemap (GSC-compliant format)
            const durationInSeconds = duration ? convertDurationToSeconds(duration) : 600;
            
            // Format publication date to ISO 8601 with timezone (GSC-compliant)
            const publicationDate = new Date(uploadDate).toISOString();
            
            // Ensure thumbnail URL is absolute
            const thumbnailUrl = thumbnail.startsWith('http') 
                ? thumbnail 
                : `${baseUrl}${thumbnail}`;

            sitemapContent += `
    <url>
        <loc>${baseUrl}/watch/${videoId}</loc>
        <video:video>
            <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
            <video:title><![CDATA[${title}]]></video:title>
            <video:description><![CDATA[${description}]]></video:description>
            <video:player_loc>${baseUrl}/watch/${videoId}</video:player_loc>
            <video:duration>${durationInSeconds}</video:duration>
            <video:publication_date>${publicationDate}</video:publication_date>
            <video:family_friendly>no</video:family_friendly>
        </video:video>
    </url>`;
        } catch (error) {
            console.error(`Error processing video ${index}:`, error);
        }
    });

    sitemapContent += `
</urlset>`;

    // Ensure dist directory exists
    const distDir = path.join(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // Ensure public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write video sitemap
    const outputPath = path.join(__dirname, '../dist/video-sitemap.xml');
    fs.writeFileSync(outputPath, sitemapContent);
    
    // Also write to public for development
    const publicPath = path.join(__dirname, '../public/video-sitemap.xml');
    fs.writeFileSync(publicPath, sitemapContent);
    
    console.log(`✅ Video sitemap generated with ${videoMatches.length} videos`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📁 Saved to: ${publicPath}`);
    console.log(`🔗 Updated URLs to use /watch/{id} format`);
    console.log(`📋 GSC-compliant format with CDATA sections and adult content markers`);
};

// Helper function to convert duration to seconds
const convertDurationToSeconds = (duration) => {
    const parts = duration.split(':');
    if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 600; // Default 10 minutes
};

// Helper function to convert views to number
const convertViewsToNumber = (views) => {
    if (!views) return 1000;
    const match = views.match(/(\d+\.?\d*)(K|M)?/);
    if (!match) return 1000;
    
    const num = parseFloat(match[1]);
    const unit = match[2];
    
    if (unit === 'M') return Math.floor(num * 1000000);
    if (unit === 'K') return Math.floor(num * 1000);
    return Math.floor(num);
};

// Run the generator
generateVideoSitemap();
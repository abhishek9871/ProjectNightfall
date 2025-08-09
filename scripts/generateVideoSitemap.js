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
            const title = titleMatch[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const description = descriptionMatch ? descriptionMatch[1].substring(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
            const duration = durationMatch ? durationMatch[1] : '';
            const thumbnail = thumbnailMatch ? thumbnailMatch[1] : `https://picsum.photos/seed/video${videoId}/400/225`;
            const category = categoryMatch ? categoryMatch[1] : '';
            const uploadDate = uploadDateMatch ? uploadDateMatch[1] : currentDate;
            const views = viewsMatch ? viewsMatch[1] : '';
            const rating = ratingMatch ? ratingMatch[1] : '4.0';

            // Convert duration to seconds for video sitemap
            const durationInSeconds = duration ? convertDurationToSeconds(duration) : 600;
            
            // Convert views to number
            const viewCount = convertViewsToNumber(views);

            sitemapContent += `
    <url>
        <loc>${baseUrl}/video/${videoId}</loc>
        <lastmod>${uploadDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        <video:video>
            <video:thumbnail_loc>${thumbnail}</video:thumbnail_loc>
            <video:title>${title}</video:title>
            <video:description>${description}</video:description>
            <video:content_loc>${baseUrl}/video/${videoId}</video:content_loc>
            <video:player_loc>${baseUrl}/video/${videoId}</video:player_loc>
            <video:duration>${durationInSeconds}</video:duration>
            <video:publication_date>${uploadDate}</video:publication_date>
            <video:category>${category}</video:category>
            <video:rating>${rating}</video:rating>
            <video:view_count>${viewCount}</video:view_count>
            <video:family_friendly>no</video:family_friendly>
            <video:requires_subscription>no</video:requires_subscription>
            <video:live>no</video:live>
        </video:video>
    </url>`;
        } catch (error) {
            console.error(`Error processing video ${index}:`, error);
        }
    });

    sitemapContent += `
</urlset>`;

    // Write video sitemap
    const outputPath = path.join(__dirname, '../dist/video-sitemap.xml');
    fs.writeFileSync(outputPath, sitemapContent);
    
    // Also write to public for development
    const publicPath = path.join(__dirname, '../public/video-sitemap.xml');
    fs.writeFileSync(publicPath, sitemapContent);
    
    console.log(`✅ Video sitemap generated with ${videoMatches.length} videos`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📁 Saved to: ${publicPath}`);
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
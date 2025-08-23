import fs from 'fs';
import path from 'path';

const generateSitemapIndex = () => {
    const baseUrl = 'https://project-nightfall.pages.dev';
    const currentDate = new Date().toISOString().split('T')[0];
    
    const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${baseUrl}/main-sitemap.xml</loc>
        <lastmod>${currentDate}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${baseUrl}/video-sitemap.xml</loc>
        <lastmod>${currentDate}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${baseUrl}/category-sitemap.xml</loc>
        <lastmod>${currentDate}</lastmod>
    </sitemap>
</sitemapindex>`;

    // Write to both dist and public
    const distDir = path.join(process.cwd(), 'dist');
    const publicDir = path.join(process.cwd(), 'public');
    
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapIndexContent);
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndexContent);
    
    console.log('✅ Sitemap index generated successfully');
    console.log(`📁 Main sitemap: ${baseUrl}/sitemap.xml`);
    console.log(`📁 Video sitemap: ${baseUrl}/video-sitemap.xml (362 videos)`);
    console.log(`📁 Category sitemap: ${baseUrl}/category-sitemap.xml (16 categories)`);
};

generateSitemapIndex();
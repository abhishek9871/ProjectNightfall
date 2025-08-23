import fs from 'fs';
import path from 'path';
import https from 'https';

const validateSitemaps = async () => {
    const baseUrl = 'https://project-nightfall.pages.dev';
    const sitemaps = [
        '/sitemap.xml',
        '/video-sitemap.xml', 
        '/category-sitemap.xml'
    ];
    
    console.log('🔍 Validating sitemap accessibility...\n');
    
    for (const sitemap of sitemaps) {
        try {
            const url = `${baseUrl}${sitemap}`;
            console.log(`Testing: ${url}`);
            
            const response = await fetch(url);
            const content = await response.text();
            
            if (response.ok) {
                // Check if we got XML or HTML
                if (content.includes('<?xml')) {
                    console.log(`✅ ${sitemap} - Valid XML returned`);
                } else if (content.includes('<html')) {
                    console.log(`❌ ${sitemap} - HTML returned instead of XML (REDIRECT ISSUE)`);
                } else {
                    console.log(`⚠️  ${sitemap} - Unknown content type`);
                }
            } else {
                console.log(`❌ ${sitemap} - HTTP ${response.status}`);
            }
            
            console.log(`   Content-Type: ${response.headers.get('content-type')}`);
            console.log(`   Content-Length: ${content.length} chars\n`);
            
        } catch (error) {
            console.log(`❌ ${sitemap} - Error: ${error.message}\n`);
        }
    }
    
    // Validate local XML files
    console.log('🔍 Validating local XML structure...\n');
    
    const publicDir = path.join(process.cwd(), 'public');
    
    for (const sitemap of sitemaps) {
        const filePath = path.join(publicDir, sitemap);
        
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Basic XML validation
            if (content.includes('<?xml') && content.includes('</urlset>')) {
                console.log(`✅ ${sitemap} - Valid local XML structure`);
                
                // Check for invalid tags in video sitemap
                if (sitemap === '/video-sitemap.xml' && content.includes('video:content_rating')) {
                    console.log(`❌ ${sitemap} - Contains invalid 'video:content_rating' tag`);
                }
            } else {
                console.log(`❌ ${sitemap} - Invalid XML structure`);
            }
        } else {
            console.log(`❌ ${sitemap} - File not found locally`);
        }
    }
};

validateSitemaps().catch(console.error);
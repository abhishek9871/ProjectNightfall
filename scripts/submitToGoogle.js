import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const submitToGoogle = async () => {
    try {
        // Load URLs
        const urlsFilePath = path.join(__dirname, '../all-urls.json');
        if (!fs.existsSync(urlsFilePath)) {
            console.log('❌ URLs file not found. Run: node scripts/submitAllUrls.js first');
            return;
        }
        
        const urls = JSON.parse(fs.readFileSync(urlsFilePath, 'utf8'));
        console.log(`🎯 Submitting ${urls.length} URLs to Google Search Console...`);

        // Load Google credentials
        const credentialsPath = path.join(__dirname, '../google-credentials.json');
        if (!fs.existsSync(credentialsPath)) {
            console.log('❌ Google credentials not found at:', credentialsPath);
            return;
        }

        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        
        // Create JWT client using fromJSON
        const jwtClient = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/indexing']
        });

        // Get auth client
        const authClient = await jwtClient.getClient();
        console.log('✅ Google API authorized');

        const indexing = google.indexing({ version: 'v3', auth: authClient });
        
        let successCount = 0;
        let errorCount = 0;
        
        // Submit URLs in batches of 100 (Google's limit)
        const batchSize = 100;
        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            console.log(`📤 Submitting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(urls.length/batchSize)} (${batch.length} URLs)`);
            
            for (const url of batch) {
                try {
                    await indexing.urlNotifications.publish({
                        requestBody: {
                            url: url,
                            type: 'URL_UPDATED'
                        }
                    });
                    successCount++;
                    
                    // Rate limiting - Google allows 200 requests per minute
                    if (successCount % 50 === 0) {
                        console.log(`   ✅ ${successCount} URLs submitted successfully`);
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                    }
                } catch (error) {
                    errorCount++;
                    if (error.code === 429) {
                        console.log('⏳ Rate limit hit, waiting 60 seconds...');
                        await new Promise(resolve => setTimeout(resolve, 60000));
                        i--; // Retry this batch
                        break;
                    } else {
                        console.log(`❌ Error submitting ${url}:`, error.message);
                    }
                }
            }
            
            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`\n🎉 Google submission complete!`);
        console.log(`   ✅ Success: ${successCount} URLs`);
        console.log(`   ❌ Errors: ${errorCount} URLs`);
        console.log(`   📊 Success rate: ${((successCount/(successCount+errorCount))*100).toFixed(1)}%`);

    } catch (error) {
        console.error('❌ Google submission failed:', error.message);
    }
};

submitToGoogle();
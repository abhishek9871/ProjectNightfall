import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const submitToIndexNow = async () => {
    try {
        // Load URLs
        const urlsFilePath = path.join(__dirname, '../all-urls.json');
        if (!fs.existsSync(urlsFilePath)) {
            console.log('❌ URLs file not found. Run: node scripts/submitAllUrls.js first');
            return;
        }
        
        const urls = JSON.parse(fs.readFileSync(urlsFilePath, 'utf8'));
        console.log(`🎯 Submitting ${urls.length} URLs to IndexNow (Bing & Yandex)...`);

        // Get IndexNow API key from environment or use default
        const apiKey = process.env.VITE_INDEXNOW_KEY || '010ead4cd05b443e92eb4d00c2f586f1';
        const host = 'project-nightfall.pages.dev';
        
        console.log(`🔑 Using API key: ${apiKey}`);
        console.log(`🌐 Host: ${host}`);

        // IndexNow allows up to 10,000 URLs per request, but we'll use smaller batches for reliability
        const batchSize = 1000;
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            console.log(`📤 Submitting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(urls.length/batchSize)} (${batch.length} URLs)`);
            
            const payload = {
                host: host,
                key: apiKey,
                keyLocation: `https://${host}/${apiKey}.txt`,
                urlList: batch
            };

            try {
                const response = await fetch('https://api.indexnow.org/indexnow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok || response.status === 202) {
                    successCount += batch.length;
                    console.log(`   ✅ Batch submitted successfully (${batch.length} URLs)`);
                } else {
                    errorCount += batch.length;
                    const errorText = await response.text();
                    console.log(`   ❌ Batch failed (${response.status}): ${errorText}`);
                }

                // Rate limiting - wait between batches
                if (i + batchSize < urls.length) {
                    console.log('   ⏳ Waiting 5 seconds before next batch...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }

            } catch (error) {
                errorCount += batch.length;
                console.log(`   ❌ Network error for batch: ${error.message}`);
            }
        }

        console.log(`\n🎉 IndexNow submission complete!`);
        console.log(`   ✅ Success: ${successCount} URLs`);
        console.log(`   ❌ Errors: ${errorCount} URLs`);
        console.log(`   📊 Success rate: ${((successCount/(successCount+errorCount))*100).toFixed(1)}%`);
        console.log(`   🔍 Submitted to: Bing, Yandex, and other IndexNow partners`);

    } catch (error) {
        console.error('❌ IndexNow submission failed:', error.message);
    }
};

submitToIndexNow();
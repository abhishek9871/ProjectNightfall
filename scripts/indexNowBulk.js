// scripts/indexNowBulk.js
import 'dotenv/config';
import { videos } from '../data/videos.js';
import { categories } from '../data/categories.js';

const apiKey = process.env.VITE_INDEXNOW_KEY;
const siteUrl = 'https://project-nightfall.pages.dev';

// Delay function for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function submitToIndexNow(urlList, batchName) {
  if (!apiKey) {
    console.error('❌ IndexNow API key not found. Ensure VITE_INDEXNOW_KEY is set in your .env file.');
    return false;
  }

  console.log(`📡 Submitting ${batchName} batch with ${urlList.length} URLs to IndexNow...`);

  const body = {
    host: new URL(siteUrl).hostname,
    key: apiKey,
    keyLocation: `${siteUrl}/${apiKey}.txt`,
    urlList: urlList,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ Successfully submitted ${batchName} (${urlList.length} URLs) to IndexNow.`);
      return true;
    } else {
      console.error(`❌ IndexNow submission failed for ${batchName}: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error submitting ${batchName} to IndexNow:`, error);
    return false;
  }
}

// Split array into chunks of specified size
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function indexNowBulkSubmission() {
  console.log(`🚀 Starting IndexNow bulk submission for Bing and Yandex...`);
  console.log(`📍 Site: ${siteUrl}`);
  console.log(`🔑 API Key: ${apiKey ? 'Configured' : 'Missing'}\n`);

  if (!apiKey) {
    console.error('❌ Cannot proceed without IndexNow API key.');
    return;
  }

  // Build all URL lists
  const criticalPages = [
    `${siteUrl}/`,
    `${siteUrl}/categories`,
    `${siteUrl}/top-rated`,
  ];

  // Add category pages
  const categoryPages = categories.map(cat => `${siteUrl}/category/${cat.slug}`);

  // Add legal pages
  const legalPages = [
    `${siteUrl}/about-us`,
    `${siteUrl}/privacy-policy`,
    `${siteUrl}/terms-of-service`,
    `${siteUrl}/dmca`,
    `${siteUrl}/contact`,
    `${siteUrl}/2257-statement`,
  ];

  // Add all video pages
  const videoPages = videos.map(video => `${siteUrl}/watch/${video.id}`);

  let totalSuccess = 0;
  let totalFailed = 0;

  // Submit critical pages first
  console.log(`📋 1. SUBMITTING CRITICAL PAGES (${criticalPages.length} URLs)`);
  const criticalSuccess = await submitToIndexNow(criticalPages, 'Critical Pages');
  if (criticalSuccess) totalSuccess += criticalPages.length;
  else totalFailed += criticalPages.length;
  await delay(2000);

  // Submit category pages
  console.log(`📋 2. SUBMITTING CATEGORY PAGES (${categoryPages.length} URLs)`);
  const categorySuccess = await submitToIndexNow(categoryPages, 'Category Pages');
  if (categorySuccess) totalSuccess += categoryPages.length;
  else totalFailed += categoryPages.length;
  await delay(2000);

  // Submit legal pages
  console.log(`📋 3. SUBMITTING LEGAL PAGES (${legalPages.length} URLs)`);
  const legalSuccess = await submitToIndexNow(legalPages, 'Legal Pages');
  if (legalSuccess) totalSuccess += legalPages.length;
  else totalFailed += legalPages.length;
  await delay(2000);

  // Submit video pages in chunks (max 10,000 per request, but we'll use 100 for safety)
  console.log(`📋 4. SUBMITTING VIDEO PAGES (${videoPages.length} URLs in batches)`);
  const videoChunks = chunkArray(videoPages, 100);
  
  for (let i = 0; i < videoChunks.length; i++) {
    const chunk = videoChunks[i];
    console.log(`📦 Video batch ${i + 1}/${videoChunks.length} (${chunk.length} URLs)`);
    
    const chunkSuccess = await submitToIndexNow(chunk, `Video Batch ${i + 1}`);
    if (chunkSuccess) totalSuccess += chunk.length;
    else totalFailed += chunk.length;
    
    // Wait between batches to avoid overwhelming the API
    if (i < videoChunks.length - 1) {
      await delay(3000);
    }
  }

  // Summary
  const totalSubmitted = totalSuccess + totalFailed;
  console.log(`\n📊 INDEXNOW BULK SUBMISSION SUMMARY:`);
  console.log(`📈 Total URLs submitted: ${totalSubmitted}`);
  console.log(`✅ Successful submissions: ${totalSuccess}`);
  console.log(`❌ Failed submissions: ${totalFailed}`);
  console.log(`📊 Success rate: ${((totalSuccess / totalSubmitted) * 100).toFixed(1)}%`);
  
  if (totalSuccess > 0) {
    console.log(`\n🎉 ${totalSuccess} pages have been submitted to Bing and Yandex via IndexNow!`);
    console.log(`⚡ IndexNow provides near-instant indexing for Bing and Yandex`);
    console.log(`🔍 Check your Bing Webmaster Tools for indexing status updates`);
  }
}

// Run the bulk submission
indexNowBulkSubmission().catch(console.error);
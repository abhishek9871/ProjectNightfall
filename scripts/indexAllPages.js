// scripts/indexAllPages.js
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { categories } from '../data/categories.js';

const keyPath = path.resolve(process.cwd(), 'google-credentials.json');
const akey = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
const baseUrl = 'https://project-nightfall.pages.dev';

// Delay function to respect API rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function submitToGoogle(urlToSubmit) {
  const jwtClient = new google.auth.JWT(
    akey.client_email,
    null,
    akey.private_key,
    ['https://www.googleapis.com/auth/indexing']
  );

  try {
    const tokens = await jwtClient.authorize();
    
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access_token}`
      },
      body: JSON.stringify({ 
        url: urlToSubmit, 
        type: 'URL_UPDATED' 
      })
    });

    if (response.ok) {
      console.log(`✅ Successfully submitted ${urlToSubmit} to Google.`);
      return true;
    } else {
      const errorData = await response.json();
      console.error(`❌ Error submitting ${urlToSubmit}: ${response.status} ${response.statusText}`);
      if (errorData.error) {
        console.error('Error Details:', errorData.error.message);
      }
      return false;
    }
  } catch (e) {
    console.error(`❌ Script Error submitting ${urlToSubmit}: ${e.message}`);
    return false;
  }
}

async function indexAllPages() {
  console.log(`🚀 Starting comprehensive page indexing...`);
  console.log(`📍 Base URL: ${baseUrl}`);
  
  // Define all critical pages to submit
  const criticalPages = [
    { url: `${baseUrl}/`, name: 'Homepage' },
    { url: `${baseUrl}/categories`, name: 'Category Hub' },
    { url: `${baseUrl}/top-rated`, name: 'Top Rated Page' },
  ];

  // Add all category pages
  categories.forEach(category => {
    criticalPages.push({
      url: `${baseUrl}/category/${category.slug}`,
      name: `Category: ${category.name}`
    });
  });

  // Add legal pages
  const legalPages = [
    { url: `${baseUrl}/about-us`, name: 'About Us' },
    { url: `${baseUrl}/privacy-policy`, name: 'Privacy Policy' },
    { url: `${baseUrl}/terms-of-service`, name: 'Terms of Service' },
    { url: `${baseUrl}/dmca`, name: 'DMCA' },
    { url: `${baseUrl}/contact`, name: 'Contact' },
    { url: `${baseUrl}/2257-statement`, name: '2257 Statement' },
  ];

  criticalPages.push(...legalPages);
  
  let successCount = 0;
  let failureCount = 0;
  
  console.log(`📋 Total pages to submit: ${criticalPages.length}`);
  console.log(`\n🎯 CRITICAL PAGES INDEXING:\n`);
  
  for (let i = 0; i < criticalPages.length; i++) {
    const page = criticalPages[i];
    
    console.log(`[${i + 1}/${criticalPages.length}] ${page.name}`);
    console.log(`🔗 ${page.url}`);
    
    const success = await submitToGoogle(page.url);
    
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Respect API rate limits - wait 1 second between requests
    if (i < criticalPages.length - 1) {
      await delay(1000);
    }
  }
  
  console.log(`\n📊 INDEXING SUMMARY:`);
  console.log(`✅ Successful submissions: ${successCount}`);
  console.log(`❌ Failed submissions: ${failureCount}`);
  console.log(`📈 Success rate: ${((successCount / criticalPages.length) * 100).toFixed(1)}%`);
  
  if (successCount > 0) {
    console.log(`\n🎉 ${successCount} critical pages submitted to Google for indexing!`);
    console.log(`⏱️  Processing time: 24-48 hours`);
    console.log(`📈 Next step: Run 'node scripts/indexAllVideos.js' for video pages`);
  }
}

// Run the indexing process
indexAllPages().catch(console.error);
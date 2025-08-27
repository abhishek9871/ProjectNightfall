// scripts/indexAllVideos.js
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { videos } from '../data/videos.js';

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

async function indexAllVideos() {
  console.log(`🚀 Starting indexing of ${videos.length} video pages...`);
  console.log(`📍 Base URL: ${baseUrl}`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const videoUrl = `${baseUrl}/watch/${video.id}`;
    
    console.log(`\n[${i + 1}/${videos.length}] Processing: ${video.title}`);
    console.log(`🔗 URL: ${videoUrl}`);
    
    const success = await submitToGoogle(videoUrl);
    
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Respect API rate limits - wait 1 second between requests
    if (i < videos.length - 1) {
      await delay(1000);
    }
  }
  
  console.log(`\n📊 INDEXING SUMMARY:`);
  console.log(`✅ Successful submissions: ${successCount}`);
  console.log(`❌ Failed submissions: ${failureCount}`);
  console.log(`📈 Success rate: ${((successCount / videos.length) * 100).toFixed(1)}%`);
  
  if (successCount > 0) {
    console.log(`\n🎉 ${successCount} video pages have been submitted to Google for indexing!`);
    console.log(`⏱️  It may take 24-48 hours for Google to process these submissions.`);
  }
}

// Run the indexing process
indexAllVideos().catch(console.error);
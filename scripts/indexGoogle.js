// scripts/indexGoogle.js
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const keyPath = path.resolve(process.cwd(), 'google-credentials.json');
const akey = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));

async function submitToGoogle(urlToSubmit) {
  console.log(`Attempting to submit ${urlToSubmit} to Google...`);
  
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
    } else {
      const errorData = await response.json();
      console.error(`❌ Error submitting to Google: ${response.status} ${response.statusText}`);
      console.error('Error Details:', errorData.error.message);
    }
  } catch (e) {
    console.error(`❌ Script Error submitting to Google: ${e.message}`);
  }
}

const urlArg = process.argv[2];
if (urlArg) {
  submitToGoogle(urlArg);
} else {
  console.log('Usage: node scripts/indexGoogle.js <url_to_submit>');
}
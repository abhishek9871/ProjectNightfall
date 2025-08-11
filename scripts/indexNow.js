// scripts/indexNow.js
import 'dotenv/config';

const apiKey = process.env.VITE_INDEXNOW_KEY;
const siteUrl = 'https://project-nightfall.pages.dev';

async function submitToIndexNow(urlList) {
  if (!apiKey) {
    console.error('❌ IndexNow API key not found. Ensure VITE_INDEXNOW_KEY is set in your .env file.');
    return;
  }

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

    if (response.ok) {
      console.log(`✅ Successfully pinged IndexNow for ${urlList.length} URL(s).`);
    } else {
      console.error(`❌ IndexNow ping failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error pinging IndexNow:', error);
  }
}

const urlsToPing = process.argv.slice(2);
if (urlsToPing.length > 0) {
  submitToIndexNow(urlsToPing);
} else {
  console.log('Usage: node scripts/indexNow.js <url1> <url2> ...');
}
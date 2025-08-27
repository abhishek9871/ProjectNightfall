STEP-A-PURGE-RESPONSE:

PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> # Replace the bearer token value with your actual API token (keep private)
>> $headers = @{
>>   "Authorization" = "Bearer nrzDSzjwhSCNP2lkt68q1iaESSiFS2U6jT8_bb_U"
>>   "Content-Type" = "application/json"
>> }
>> 
>> $body = @{ purge_everything = $true } | ConvertTo-Json
>> 
>> Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/3857b1afb720914c0bb41859ef9d8569/pages/projects/project-nightfall/purge_build_cache" `
>>                   -Method Post `
>>                   -Headers $headers `
>>                   -Body $body

result success errors messages
------ ------- ------ --------
          True {}     {}


---

STEP-B-DEPLOY-OUTPUT:

PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> npm run build
>> npx wrangler pages deploy dist --project-name=project-nightfall --branch=master

> project-nightfall:-revenue-engine@0.0.0 build
> node scripts/generateVideoSitemap.js && node scripts/generateSitemaps.js && node scripts/generateMainSitemap.js && node scripts/generateSitemapIndex.js && vite build

✅ Video sitemap generated with 362 videos
📁 Saved to: C:\Users\VASU\Music\project-nightfall_-revenue-engine\dist\video-sitemap.xml
📁 Saved to: C:\Users\VASU\Music\project-nightfall_-revenue-engine\public\video-sitemap.xml
🔗 Updated URLs to use /watch/{id} format
📋 GSC-compliant format with CDATA sections and adult content markers
✅ Category sitemap generated with 17 URLs (hub + categories).
   - Categories hub: /categories
   - Main categories: 8
   - Specialty clusters: 8
   - Using 1 different lastmod dates from content changes
✅ Main sitemap generated with all existing pages
📁 Homepage, categories hub, top-rated, and 6 legal pages included
✅ Sitemap index generated successfully
📁 Main sitemap: https://project-nightfall.pages.dev/sitemap.xml
📁 Video sitemap: https://project-nightfall.pages.dev/video-sitemap.xml (362 videos)
📁 Category sitemap: https://project-nightfall.pages.dev/category-sitemap.xml (16 categories)   
vite v6.3.5 building for production...
✓ 89 modules transformed.
dist/registerSW.js                            0.13 kB
dist/manifest.webmanifest                     0.24 kB
dist/index.html                               6.60 kB │ gzip:  2.34 kB
dist/assets/index-DCGr5Sfs.css                8.81 kB │ gzip:  2.58 kB
dist/assets/ui-vendor-DBVGUQbb.js             0.04 kB │ gzip:  0.06 kB
dist/assets/searchUtils-Do6ueCuk.js           0.65 kB │ gzip:  0.29 kB
dist/assets/Layout-D6O7uIdi.js                0.80 kB │ gzip:  0.48 kB
dist/assets/ContactPage-B1zsoRNN.js           1.83 kB │ gzip:  0.91 kB
dist/assets/AboutUsPage-CmoC9-vP.js           2.34 kB │ gzip:  1.16 kB
dist/assets/Pagination-B3fMQkXz.js            2.42 kB │ gzip:  0.89 kB
dist/assets/VideoGrid-DH9DAsM7.js             3.22 kB │ gzip:  1.35 kB
dist/assets/Statement2257Page-D36OzSGz.js     5.54 kB │ gzip:  1.89 kB
dist/assets/VideoCard-Ds4xrYml.js             5.93 kB │ gzip:  2.53 kB
dist/assets/TermsOfServicePage-CjYRaowj.js    5.97 kB │ gzip:  2.20 kB
dist/assets/DMCAPage-B2_Yz42Y.js              6.06 kB │ gzip:  2.14 kB
dist/assets/HomePage-UaqmNQ4T.js              7.11 kB │ gzip:  2.60 kB
dist/assets/PrivacyPolicyPage-O9c7iLkv.js     7.51 kB │ gzip:  2.42 kB
dist/assets/CategoryHub-ynXKostw.js          10.58 kB │ gzip:  3.28 kB
dist/assets/TopRatedPage-CmA0T0Ng.js         11.56 kB │ gzip:  3.82 kB
dist/assets/FavoritesPage-IHnh89ao.js        12.03 kB │ gzip:  3.77 kB
dist/assets/WatchPage-Dd6vTXSm.js            12.04 kB │ gzip:  3.54 kB
dist/assets/react-vendor-CkOeJvzi.js         32.18 kB │ gzip: 11.29 kB
dist/assets/CategoryPage-D7hUxhZw.js         32.82 kB │ gzip: 10.62 kB
dist/assets/index-B1idmHFa.js               209.19 kB │ gzip: 67.08 kB
dist/assets/Footer-NguWzVZD.js              432.37 kB │ gzip: 44.45 kB
✓ built in 4.79s

✨ [vite-plugin-compression]:algorithm=gzip - compressed file successfully:
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/ContactPage-B1zsoRNN.js.gz    
      1.79kb / gzip: 0.89kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/AboutUsPage-CmoC9-vP.js.gz    
      2.29kb / gzip: 1.13kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/DMCAPage-B2_Yz42Y.js.gz       
      5.91kb / gzip: 2.09kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/CategoryHub-ynXKostw.js.gz    
      10.33kb / gzip: 3.20kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/FavoritesPage-IHnh89ao.js.gz  
      11.74kb / gzip: 3.68kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/HomePage-UaqmNQ4T.js.gz       
      6.94kb / gzip: 2.54kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/Pagination-B3fMQkXz.js.gz     
      2.37kb / gzip: 0.87kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/index-DCGr5Sfs.css.gz         
      8.60kb / gzip: 2.51kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/PrivacyPolicyPage-O9c7iLkv.js.gz    7.33kb / gzip: 2.36kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/Statement2257Page-D36OzSGz.js.gz    5.41kb / gzip: 1.85kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/TermsOfServicePage-CjYRaowj.js.gz   5.83kb / gzip: 2.15kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/index.html.gz                        
      6.44kb / gzip: 2.28kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/VideoCard-Ds4xrYml.js.gz      
      5.79kb / gzip: 2.47kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/CategoryPage-D7hUxhZw.js.gz   
      32.05kb / gzip: 10.36kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/VideoGrid-DH9DAsM7.js.gz      
      3.14kb / gzip: 1.32kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/WatchPage-Dd6vTXSm.js.gz      
      11.76kb / gzip: 3.45kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/TopRatedPage-CmA0T0Ng.js.gz   
      11.29kb / gzip: 3.73kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/react-vendor-CkOeJvzi.js.gz   
      31.42kb / gzip: 11.02kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/Footer-NguWzVZD.js.gz         
      422.24kb / gzip: 42.80kb
dist/C:/Users/VASU/Music/project-nightfall_-revenue-engine/assets/index-B1idmHFa.js.gz          
      204.28kb / gzip: 65.38kb



PWA v0.21.2
mode      generateSW
precache  29 entries (800.81 KiB)
files generated
  dist/sw.js
  dist/workbox-6e150728.js

 ⛅️ wrangler 4.26.0 (update available 4.33.0)
─────────────────────────────────────────────
▲ [WARNING] Warning: Your working directory is a git repo and has uncommitted changes

  To silence this warning, pass in --commit-dirty=true


✨ Compiled Worker successfully
✨ Success! Uploaded 3 files (56 already uploaded) (1.03 sec)

✨ Uploading _headers
✨ Uploading _redirects
✨ Uploading Functions bundle
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://d3c2540d.project-nightfall.pages.dev

--

STEP-C-GSC-SITEMAP-RESULT:

Submitted sitemaps
Sitemap	Type	Submitted	Last read	Status	Discovered pages	Discovered videos	
/sitemap.xml	Unknown	27 Aug 2025		Couldn't fetch	0	0	


Sitemaps

/sitemap.xml
Last read
27/08/2025
Discovered pages
0
Discovered videos
0

Sitemap could not be read

--

STEP-D-SITEMAP-HEAD:

PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> # Sitemap index headers + preview
>> $r = Invoke-WebRequest -Uri "https://project-nightfall.pages.dev/sitemap.xml" -Headers @{ 'User-Agent' = 'Googlebot/2.1 (+http://www.google.com/bot.html)' }                                 >> $r.StatusCode; $r.Headers['Content-Type']; $r.Content.Substring(0,500)                       200
application/xml; charset=utf-8
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>https://project-nightfall.pages.dev/main-sitemap.xml</loc>
        <lastmod>2025-08-27</lastmod>
    </sitemap>
    <sitemap>
        <loc>https://project-nightfall.pages.dev/video-sitemap.xml</loc>
        <lastmod>2025-08-27</lastmod>
    </sitemap>
    <sitemap>
        <loc>https://project-nightfall.pages.dev/category-sitemap.xml</loc>
        <lastmod>2025-08-

--

STEP-D-VIDEO-HEAD:

PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> $r2 = Invoke-WebRequest -Uri "https://project-nightfall.pages.dev/video-sitemap.xml" -Headers @{ 'User-Agent' = 'Googlebot/2.1 (+http://www.google.com/bot.html)' }                >> $r2.StatusCode; $r2.Headers['Content-Type']; $r2.Content.Substring(0,500)   200                                                                            
application/xml; charset=utf-8                                                 
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    <url>
        <loc>https://project-nightfall.pages.dev/watch/1</loc>
        <video:video>
            <video:thumbnail_loc>https://picsum.photos/seed/video1/400/225</video:thumbnail_loc>
            <video:title><![CDATA[Fucking Stepdad And My Bf On The Same - Hot Adult Video]]></video:title>
            <video:description>

--

STEP-D-WATCH1-BODY:

PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> $r3 = Invoke-WebRequest -Uri "https://project-nightfall.pages.dev/watch/1" -Headers @{ 'User-Agent' = 'Googlebot/2.1 (+http://www.google.com/bot.html)' }                                                                             >> $r3.StatusCode; $r3.Headers['Content-Type']; $r3.Content.Substring(0,800)                    200
text/html; charset=utf-8                                                                        
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml"
    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 font-weight=%22bold%22 fill=%22%238b5cf6%22>N</text></svg>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="rating" content="adult" />
  <meta name="rating" content="RTA-5042-1996-1400-1577-RTA">
  <meta name="description"
    content="Explore a curated collection of high-quality adult entertainment. Project Nightfall features in-depth reviews, top-rated videos, and a premium viewing experience." />
  <meta name="keywords"
    content="a
PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> 


--

STEP-E-URL-INSPECTION-WATCH1:


Tested on: 27 Aug 2025, 22:31
check_circle
URL is available to Google
If it gets indexed and selected as canonical, it could appear in Google Search results with all relevant enhancements. Learn more
Page changed?
check_circle
Page availability
Page can be indexed
URL will be indexed only if certain conditions are met
Discovery
Not checked in live tests
Crawl
Time
27 Aug 2025, 22:31:53
Crawled as
Google Inspection Tool smartphone
Crawl allowed?
Yes
Page fetch
Successful
Indexing allowed?
Yes
Indexing
User-declared canonical
https://project-nightfall.pages.dev/
Google-selected canonical

Only determined after indexing
Video discovery
Video detected
Enhancements and experience
URL has no enhancements

--

STEP-E-URL-INSPECTION-HOME:

check_circle
URL is available to Google
If it gets indexed and selected as canonical, it could appear in Google Search results with all relevant enhancements. Learn more
Page changed?
check_circle
Page availability
Page can be indexed
URL will be indexed only if certain conditions are met
Discovery
Not checked in live tests
Crawl
Time
27 Aug 2025, 22:33:52
Crawled as
Google Inspection Tool smartphone
Crawl allowed?
Yes
Page fetch
Successful
Indexing allowed?
Yes
Indexing
User-declared canonical
https://project-nightfall.pages.dev/
Google-selected canonical

Only determined after indexing
Enhancements and experience
URL has no enhancements

--



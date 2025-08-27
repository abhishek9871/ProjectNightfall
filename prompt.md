1) CRITICAL — Re-test sitemaps in Google Search Console----I dis this and the GSC shows "coudn't fetch" and "sitemap couldn't be read" errors.

2) CRITICAL — Run the repo validator again and paste output
Command: node scripts/validateSitemaps.js---------This script is flawed, I dont know why you used it

3) CRITICAL — Use GSC “URL Inspection” → “Test live URL” for:
a)  https://project-nightfall.pages.dev/watch/1
URL inspection shows this:

URL Inspection
Tested on: 27 Aug 2025, 19:12
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
27 Aug 2025, 19:12:15
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

- When i click on the view tested page and the HTML button I see: 

<!DOCTYPE html>
<html lang="en"><head>
  
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,&lt;svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22&gt;&lt;text y=%22.9em%22 font-size=%2290%22 font-weight=%22bold%22 fill=%22%238b5cf6%22&gt;N&lt;/text&gt;&lt;/svg&gt;" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="rating" content="adult" />
  <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
  <meta name="description" content="Explore a curated collection of high-quality adult entertainment. Project Nightfall features in-depth reviews, top-rated videos, and a premium viewing experience." />
  <meta name="keywords" content="adult videos, premium content, HD videos, adult entertainment, video streaming, adult site" />
  <meta name="author" content="Project Nightfall" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="https://project-nightfall.pages.dev/" />
  
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="73I4k_kYyoJISLM2jPYz1_0MIlzlqqOOgYacuo8dpm4" />
  
  <!-- Bing Webmaster Verification -->
  <meta name="msvalidate.01" content="FAD60D3EB4D6308F1F88EC94EDAC19AD" />
  
  <!-- Yandex Webmaster Verification -->
  <meta name="yandex-verification" content="e970a58da1013662" />

  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Project Nightfall - Premium Adult Entertainment" />
  <meta property="og:description" content="Explore a curated collection of high-quality adult entertainment with HD videos, expert reviews, and premium viewing experience." />
  <meta property="og:url" content="https://project-nightfall.pages.dev/" />
  <meta property="og:site_name" content="Project Nightfall" />
  <meta property="og:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Project Nightfall - Premium Adult Entertainment Platform" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Project Nightfall - Premium Adult Entertainment" />
  <meta name="twitter:description" content="Explore a curated collection of high-quality adult entertainment with HD videos and premium viewing experience." />
  <meta name="twitter:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
  <meta name="twitter:image:alt" content="Project Nightfall - Premium Adult Entertainment Platform" />
  <meta name="twitter:site" content="@ProjectNightfall" />
  <meta name="twitter:creator" content="@ProjectNightfall" />

  <!-- Additional SEO Meta Tags -->
  <meta name="theme-color" content="#8b5cf6" />
  <meta name="msapplication-TileColor" content="#8b5cf6" />
  <meta name="apple-mobile-web-app-title" content="Project Nightfall" />
  <meta name="application-name" content="Project Nightfall" />

  <!-- HilltopAds Website Verification -->
  <meta name="c54d7a64c490410890e7c7cd486ea527cc378ca8" content="c54d7a64c490410890e7c7cd486ea527cc378ca8" />
  <!-- ExoClick Website Verification -->
  <meta name="6a97888e-site-verification" content="48a0726be9a3019f49f36c155ed37dfa" />
  <title>Project Nightfall - Premium Adult Entertainment Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Critical resource preloading for LCP optimization -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link rel="preload" as="font" href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" type="font/woff2" crossorigin="" />
  <link rel="preload" as="image" href="https://picsum.photos/seed/video1/400/225" />
  
  <!-- DNS prefetch for critical third-party domains -->
  <link rel="dns-prefetch" href="//xvideos.com" />
  <link rel="dns-prefetch" href="//xvideos4.com" />
  <link rel="dns-prefetch" href="//xvv1deos.com" />
  <link rel="dns-prefetch" href="//picsum.photos" />
  <link rel="dns-prefetch" href="//www.googletagmanager.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-display: swap;
      background-color: #020617;
      /* slate-950 */
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1e293b;
      /* slate-800 */
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #475569;
      /* slate-600 */
      border-radius: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #64748b;
      /* slate-500 */
    }

    /* Prevent layout shift during font loading */
    .video-title {
      font-feature-settings: "kern" 1;
      text-rendering: optimizeSpeed;
    }

    /* Ensure consistent aspect ratios */
    .aspect-video {
      aspect-ratio: 16 / 9;
    }

    /* Professional video grid with consistent spacing */
    .professional-video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 640px) {
      .professional-video-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
    }
  </style>
  <!-- 
      IMPORTANT: Ad Network Scripts
      The finalized plan includes using ad networks. Their scripts, which often
      trigger pop-under ads, should be placed here, just before the closing </body> tag.
      Get the actual script from your ad network dashboard after signing up.
    -->
  <script type="module" crossorigin="" src="/assets/index-B1idmHFa.js"></script>
  <link rel="modulepreload" crossorigin="" href="/assets/react-vendor-CkOeJvzi.js" />
  <link rel="stylesheet" crossorigin="" href="/assets/index-DCGr5Sfs.css" />
<link rel="manifest" href="/manifest.webmanifest" /><script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script><style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.fixed{position:fixed}.inset-0{inset:0px}.z-50{z-index:50}.m-4{margin:1rem}.mb-2{margin-bottom:0.5rem}.mb-6{margin-bottom:1.5rem}.mt-6{margin-top:1.5rem}.flex{display:flex}.w-full{width:100%}.max-w-md{max-width:28rem}.scale-100{--tw-scale-x:1;--tw-scale-y:1;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.items-center{align-items:center}.justify-center{justify-content:center}.space-y-4 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.rounded-2xl{border-radius:1rem}.rounded-lg{border-radius:0.5rem}.border{border-width:1px}.border-slate-700{--tw-border-opacity:1;border-color:rgb(51 65 85 / var(--tw-border-opacity, 1))}.bg-black{--tw-bg-opacity:1;background-color:rgb(0 0 0 / var(--tw-bg-opacity, 1))}.bg-purple-600{--tw-bg-opacity:1;background-color:rgb(147 51 234 / var(--tw-bg-opacity, 1))}.bg-slate-700{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity, 1))}.bg-slate-900{--tw-bg-opacity:1;background-color:rgb(15 23 42 / var(--tw-bg-opacity, 1))}.bg-opacity-80{--tw-bg-opacity:0.8}.p-8{padding:2rem}.px-4{padding-left:1rem;padding-right:1rem}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}.text-center{text-align:center}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.tracking-tight{letter-spacing:-0.025em}.text-slate-300{--tw-text-opacity:1;color:rgb(203 213 225 / var(--tw-text-opacity, 1))}.text-slate-400{--tw-text-opacity:1;color:rgb(148 163 184 / var(--tw-text-opacity, 1))}.text-slate-500{--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-2xl{--tw-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25);--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-purple-500\/10{--tw-shadow-color:rgb(168 85 247 / 0.1);--tw-shadow:var(--tw-shadow-colored)}.backdrop-blur-sm{--tw-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition{transition-property:color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-300{transition-duration:300ms}.hover\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\:bg-purple-700:hover{--tw-bg-opacity:1;background-color:rgb(126 34 206 / var(--tw-bg-opacity, 1))}.hover\:bg-slate-600:hover{--tw-bg-opacity:1;background-color:rgb(71 85 105 / var(--tw-bg-opacity, 1))}.focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\:ring-4:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus\:ring-purple-500:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(168 85 247 / var(--tw-ring-opacity, 1))}.focus\:ring-opacity-50:focus{--tw-ring-opacity:0.5}</style></head>

<body>
  <div id="root"><div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm" data-testid="age-gate"><div role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-description" class="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-500/10 p-8 m-4 max-w-md w-full text-center transform transition-all duration-300 scale-100"><h1 id="age-gate-title" class="text-3xl font-black text-white mb-2 tracking-tight">Age Verification</h1><p id="age-gate-description" class="text-slate-400 mb-6">This website contains age-restricted materials including nudity and explicit depictions of sexual activity. By entering, you affirm that you are 18 years of age or older.</p><div class="space-y-4"><button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50">Yes, I am 18+</button><button class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-lg transition">Exit</button></div><p class="text-xs text-slate-500 mt-6">By entering this website, you are agreeing to our Terms of Service and Privacy Policy.</p></div></div></div>

<!-- Cloudflare Pages Analytics --><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{&quot;token&quot;: &quot;9908b66ea9934f8aa16620561b833f87&quot;}"></script><!-- Cloudflare Pages Analytics -->

</body></html>


- In the screenshot section I see, the age gate's screenshot and not the watch video page.

- In the more info section I see this:-

JavaScript console messages
4 messages

Warning
30:07.000
cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation
https://cdn.tailwindcss.com/:64

Error
30:07.000
Uncaught (in promise) Error: Rejected at wrsParams.serviceWorkers.navigator.serviceWorker.register (<anonymous>:13:684) at https://project-nightfall.pages.dev/registerSW.js:1:98
:12

Warning
30:08.000
The resource https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
https://project-nightfall.pages.dev/watch/1:0

Warning
30:08.000
The resource https://picsum.photos/seed/video1/400/225 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
https://project-nightfall.pages.dev/watch/1:0

HTTP response:

HTTP/1.1 200 OK
Date: Wed, 27 Aug 2025 14:01:18 GMT
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Access-Control-Allow-Origin: *
Cache-Control: public, max-age=0, must-revalidate
Nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Vary: accept-encoding
Report-To: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=%2B4cpTz7mmY10sOEJnhlXMmmtFeSaj7zf%2B9erakO2txbZTjGMUUM%2BYseACJl50VY1N7lfRjiSZkC4zrLeiz3mGybErcwTt6UalRFAxIMJkiE5Fo2%2BiVWa7ElmAw%3D%3D"}]}
Etag: W/"f13603cbbaa2764ea01e67735a8818c9"
Content-Encoding: br
Server: cloudflare
CF-RAY: 975c19a4ea30c4cb-SEA
alt-svc: h3=":443"; ma=86400

- Page resources shows:

Page resources
4/13 couldn't be loaded

Redirection error
Script
https://cdn.tailwindcss.com/

Googlebot blocked by robots.txt
Image
https://picsum.photos/seed/video1/400/225

Other error
Script
https://static.cloudflareinsights.com/beacon.min.js

Googlebot blocked by robots.txt
Stylesheet
https://vjs.zencdn.net/8.6.1/video-js.css


b) https://project-nightfall.pages.dev/

- The main test live URL page shows:
https://project-nightfall.pages.dev/
URL Inspection
Tested on: 27 Aug 2025, 19:28
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
27 Aug 2025, 19:28:18
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


- The view tested page shows the following:

The TML scetion shows this:

<!DOCTYPE html>
<html lang="en"><head>
  
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,&lt;svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22&gt;&lt;text y=%22.9em%22 font-size=%2290%22 font-weight=%22bold%22 fill=%22%238b5cf6%22&gt;N&lt;/text&gt;&lt;/svg&gt;" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="rating" content="adult" />
  <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
  <meta name="description" content="Explore a curated collection of high-quality adult entertainment. Project Nightfall features in-depth reviews, top-rated videos, and a premium viewing experience." />
  <meta name="keywords" content="adult videos, premium content, HD videos, adult entertainment, video streaming, adult site" />
  <meta name="author" content="Project Nightfall" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="https://project-nightfall.pages.dev/" />
  
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="73I4k_kYyoJISLM2jPYz1_0MIlzlqqOOgYacuo8dpm4" />
  
  <!-- Bing Webmaster Verification -->
  <meta name="msvalidate.01" content="FAD60D3EB4D6308F1F88EC94EDAC19AD" />
  
  <!-- Yandex Webmaster Verification -->
  <meta name="yandex-verification" content="e970a58da1013662" />

  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Project Nightfall - Premium Adult Entertainment" />
  <meta property="og:description" content="Explore a curated collection of high-quality adult entertainment with HD videos, expert reviews, and premium viewing experience." />
  <meta property="og:url" content="https://project-nightfall.pages.dev/" />
  <meta property="og:site_name" content="Project Nightfall" />
  <meta property="og:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Project Nightfall - Premium Adult Entertainment Platform" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Project Nightfall - Premium Adult Entertainment" />
  <meta name="twitter:description" content="Explore a curated collection of high-quality adult entertainment with HD videos and premium viewing experience." />
  <meta name="twitter:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
  <meta name="twitter:image:alt" content="Project Nightfall - Premium Adult Entertainment Platform" />
  <meta name="twitter:site" content="@ProjectNightfall" />
  <meta name="twitter:creator" content="@ProjectNightfall" />

  <!-- Additional SEO Meta Tags -->
  <meta name="theme-color" content="#8b5cf6" />
  <meta name="msapplication-TileColor" content="#8b5cf6" />
  <meta name="apple-mobile-web-app-title" content="Project Nightfall" />
  <meta name="application-name" content="Project Nightfall" />

  <!-- HilltopAds Website Verification -->
  <meta name="c54d7a64c490410890e7c7cd486ea527cc378ca8" content="c54d7a64c490410890e7c7cd486ea527cc378ca8" />
  <!-- ExoClick Website Verification -->
  <meta name="6a97888e-site-verification" content="48a0726be9a3019f49f36c155ed37dfa" />
  <title>Project Nightfall - Premium Adult Entertainment Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Critical resource preloading for LCP optimization -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link rel="preload" as="font" href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" type="font/woff2" crossorigin="" />
  <link rel="preload" as="image" href="https://picsum.photos/seed/video1/400/225" />
  
  <!-- DNS prefetch for critical third-party domains -->
  <link rel="dns-prefetch" href="//xvideos.com" />
  <link rel="dns-prefetch" href="//xvideos4.com" />
  <link rel="dns-prefetch" href="//xvv1deos.com" />
  <link rel="dns-prefetch" href="//picsum.photos" />
  <link rel="dns-prefetch" href="//www.googletagmanager.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-display: swap;
      background-color: #020617;
      /* slate-950 */
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1e293b;
      /* slate-800 */
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #475569;
      /* slate-600 */
      border-radius: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #64748b;
      /* slate-500 */
    }

    /* Prevent layout shift during font loading */
    .video-title {
      font-feature-settings: "kern" 1;
      text-rendering: optimizeSpeed;
    }

    /* Ensure consistent aspect ratios */
    .aspect-video {
      aspect-ratio: 16 / 9;
    }

    /* Professional video grid with consistent spacing */
    .professional-video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 640px) {
      .professional-video-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
    }
  </style>
  <!-- 
      IMPORTANT: Ad Network Scripts
      The finalized plan includes using ad networks. Their scripts, which often
      trigger pop-under ads, should be placed here, just before the closing </body> tag.
      Get the actual script from your ad network dashboard after signing up.
    -->
  <script type="module" crossorigin="" src="/assets/index-B1idmHFa.js"></script>
  <link rel="modulepreload" crossorigin="" href="/assets/react-vendor-CkOeJvzi.js" />
  <link rel="stylesheet" crossorigin="" href="/assets/index-DCGr5Sfs.css" />
<link rel="manifest" href="/manifest.webmanifest" /><script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script><style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.fixed{position:fixed}.inset-0{inset:0px}.z-50{z-index:50}.m-4{margin:1rem}.mb-2{margin-bottom:0.5rem}.mb-6{margin-bottom:1.5rem}.mt-6{margin-top:1.5rem}.flex{display:flex}.w-full{width:100%}.max-w-md{max-width:28rem}.scale-100{--tw-scale-x:1;--tw-scale-y:1;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.items-center{align-items:center}.justify-center{justify-content:center}.space-y-4 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.rounded-2xl{border-radius:1rem}.rounded-lg{border-radius:0.5rem}.border{border-width:1px}.border-slate-700{--tw-border-opacity:1;border-color:rgb(51 65 85 / var(--tw-border-opacity, 1))}.bg-black{--tw-bg-opacity:1;background-color:rgb(0 0 0 / var(--tw-bg-opacity, 1))}.bg-purple-600{--tw-bg-opacity:1;background-color:rgb(147 51 234 / var(--tw-bg-opacity, 1))}.bg-slate-700{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity, 1))}.bg-slate-900{--tw-bg-opacity:1;background-color:rgb(15 23 42 / var(--tw-bg-opacity, 1))}.bg-opacity-80{--tw-bg-opacity:0.8}.p-8{padding:2rem}.px-4{padding-left:1rem;padding-right:1rem}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}.text-center{text-align:center}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.tracking-tight{letter-spacing:-0.025em}.text-slate-300{--tw-text-opacity:1;color:rgb(203 213 225 / var(--tw-text-opacity, 1))}.text-slate-400{--tw-text-opacity:1;color:rgb(148 163 184 / var(--tw-text-opacity, 1))}.text-slate-500{--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-2xl{--tw-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25);--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-purple-500\/10{--tw-shadow-color:rgb(168 85 247 / 0.1);--tw-shadow:var(--tw-shadow-colored)}.backdrop-blur-sm{--tw-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition{transition-property:color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-300{transition-duration:300ms}.hover\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\:bg-purple-700:hover{--tw-bg-opacity:1;background-color:rgb(126 34 206 / var(--tw-bg-opacity, 1))}.hover\:bg-slate-600:hover{--tw-bg-opacity:1;background-color:rgb(71 85 105 / var(--tw-bg-opacity, 1))}.focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\:ring-4:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus\:ring-purple-500:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(168 85 247 / var(--tw-ring-opacity, 1))}.focus\:ring-opacity-50:focus{--tw-ring-opacity:0.5}</style></head>

<body>
  <div id="root"><div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm" data-testid="age-gate"><div role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-description" class="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-500/10 p-8 m-4 max-w-md w-full text-center transform transition-all duration-300 scale-100"><h1 id="age-gate-title" class="text-3xl font-black text-white mb-2 tracking-tight">Age Verification</h1><p id="age-gate-description" class="text-slate-400 mb-6">This website contains age-restricted materials including nudity and explicit depictions of sexual activity. By entering, you affirm that you are 18 years of age or older.</p><div class="space-y-4"><button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50">Yes, I am 18+</button><button class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-lg transition">Exit</button></div><p class="text-xs text-slate-500 mt-6">By entering this website, you are agreeing to our Terms of Service and Privacy Policy.</p></div></div></div>

<!-- Cloudflare Pages Analytics --><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{&quot;token&quot;: &quot;9908b66ea9934f8aa16620561b833f87&quot;}"></script><!-- Cloudflare Pages Analytics -->

</body></html>


- The screenhot section shows the screenshot of the age gate.


4) 4) HIGH — If GSC still reports sitemap fetch failure, run these checks (I can run if you allow):

--

PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> Invoke-WebRequest -Uri "https://project-nightfall.pages.dev
/sitemap.xml" -Method Head -Headers @{"User-Agent"="Googlebot/2.1 (+http://www.google.com/bot.html)"}

                                                                                                                     
StatusCode        : 200                                                                                              
StatusDescription : OK                                                                                               
Content           :                                                                                                  
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Access-Control-Allow-Origin: *
                    Referrer-Policy: strict-origin-when-cross-origin
                    X-Content-Type-Options: nosniff
                    Vary: accept-encoding
                    Report-To: {"group":"...
Forms             : {}
Headers           : {[Connection, keep-alive], [Access-Control-Allow-Origin, *], [Referrer-Policy,
                    strict-origin-when-cross-origin], [X-Content-Type-Options, nosniff]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 0

--


PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> Invoke-WebRequest -Uri "https://project-nightfall.pages.dev/video-sitemap.xml" -Method Head -Headers @{"User-Agent"="Googlebot/2.1 (+http://www.google.com/bot.html)"}


StatusCode        : 200
StatusDescription : OK
Content           :
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Access-Control-Allow-Origin: *
                    Referrer-Policy: strict-origin-when-cross-origin
                    X-Content-Type-Options: nosniff
                    Vary: accept-encoding
                    Report-To: {"group":"...
Forms             : {}
Headers           : {[Connection, keep-alive], [Access-Control-Allow-Origin, *], [Referrer-Policy,
                    strict-origin-when-cross-origin], [X-Content-Type-Options, nosniff]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 0


--

PS C:\Users\VASU\Music\project-nightfall_-revenue-engine> Invoke-WebRequest -Uri "https://project-nightfall.pages.dev/watch/1" -Headers @{"User-Agent"="Googlebot/2.1 (+http://www.google.com/bot.html)"} | Select-Object -ExpandProperty Content | Select-Object -First 60
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
    content="adult videos, premium content, HD videos, adult entertainment, video streaming, adult site" />
  <meta name="author" content="Project Nightfall" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />      
  <link rel="canonical" href="https://project-nightfall.pages.dev/" />

  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="73I4k_kYyoJISLM2jPYz1_0MIlzlqqOOgYacuo8dpm4" />

  <!-- Bing Webmaster Verification -->
  <meta name="msvalidate.01" content="FAD60D3EB4D6308F1F88EC94EDAC19AD" />

  <!-- Yandex Webmaster Verification -->
  <meta name="yandex-verification" content="e970a58da1013662" />

  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Project Nightfall - Premium Adult Entertainment" />
  <meta property="og:description"
    content="Explore a curated collection of high-quality adult entertainment with HD videos, expert reviews, and premium viewing experience." />
  <meta property="og:url" content="https://project-nightfall.pages.dev/" />
  <meta property="og:site_name" content="Project Nightfall" />
  <meta property="og:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Project Nightfall - Premium Adult Entertainment Platform" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Project Nightfall - Premium Adult Entertainment" />
  <meta name="twitter:description"
    content="Explore a curated collection of high-quality adult entertainment with HD videos and premium viewing experience." />
  <meta name="twitter:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
  <meta name="twitter:image:alt" content="Project Nightfall - Premium Adult Entertainment Platform" />
  <meta name="twitter:site" content="@ProjectNightfall" />
  <meta name="twitter:creator" content="@ProjectNightfall" />

  <!-- Additional SEO Meta Tags -->
  <meta name="theme-color" content="#8b5cf6" />
  <meta name="msapplication-TileColor" content="#8b5cf6" />
  <meta name="apple-mobile-web-app-title" content="Project Nightfall" />
  <meta name="application-name" content="Project Nightfall" />

  <!-- HilltopAds Website Verification -->
  <meta name="c54d7a64c490410890e7c7cd486ea527cc378ca8" content="c54d7a64c490410890e7c7cd486ea527cc378ca8" />        
  <!-- ExoClick Website Verification -->
  <meta name="6a97888e-site-verification" content="48a0726be9a3019f49f36c155ed37dfa">
  <title>Project Nightfall - Premium Adult Entertainment Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Critical resource preloading for LCP optimization -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="font" href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" type="font/woff2" crossorigin>
  <link rel="preload" as="image" href="https://picsum.photos/seed/video1/400/225">

  <!-- DNS prefetch for critical third-party domains -->
  <link rel="dns-prefetch" href="//xvideos.com">
  <link rel="dns-prefetch" href="//xvideos4.com">
  <link rel="dns-prefetch" href="//xvv1deos.com">
  <link rel="dns-prefetch" href="//picsum.photos">
  <link rel="dns-prefetch" href="//www.googletagmanager.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
    rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-display: swap;
      background-color: #020617;
      /* slate-950 */
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1e293b;
      /* slate-800 */
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #475569;
      /* slate-600 */
      border-radius: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #64748b;
      /* slate-500 */
    }

    /* Prevent layout shift during font loading */
    .video-title {
      font-feature-settings: "kern" 1;
      text-rendering: optimizeSpeed;
    }

    /* Ensure consistent aspect ratios */
    .aspect-video {
      aspect-ratio: 16 / 9;
    }

    /* Professional video grid with consistent spacing */
    .professional-video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 640px) {
      .professional-video-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
    }
  </style>
  <!--
      IMPORTANT: Ad Network Scripts
      The finalized plan includes using ad networks. Their scripts, which often
      trigger pop-under ads, should be placed here, just before the closing </body> tag.
      Get the actual script from your ad network dashboard after signing up.
    -->
  <script type="module" crossorigin src="/assets/index-B1idmHFa.js"></script>
  <link rel="modulepreload" crossorigin href="/assets/react-vendor-CkOeJvzi.js">
  <link rel="stylesheet" crossorigin href="/assets/index-DCGr5Sfs.css">
<link rel="manifest" href="/manifest.webmanifest"><script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script></head>

<body>
  <div id="root"></div>
<!-- Cloudflare Pages Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "9908b66ea9934f8aa16620561b833f87"}'></script><!-- Cloudflare Pages Analytics --></body>

</html>









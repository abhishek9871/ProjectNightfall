// @ts-nocheck
import pako from 'pako';

function base64UrlToUint8Array(b64url) {
  const padded = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const withPad = padded + '='.repeat(padLen);
  const binary = atob(withPad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodePlaylistFromCode(code) {
  try {
    const bytes = base64UrlToUint8Array(code);
    const inflated = pako.inflate(bytes);
    const text = new TextDecoder().decode(inflated);
    const data = JSON.parse(text);
    if (!data || data.v !== 2 || !data.p) return null;
    return {
      id: data.p.id,
      name: data.p.name || 'Shared Playlist',
      desc: data.p.desc || '',
      thumb: data.p.thumb || '',
      cat: data.p.cat || 'Mixed',
      count: typeof data.p.count === 'number' ? data.p.count : (Array.isArray(data.p.vids) ? data.p.vids.length : 0),
    };
  } catch {
    return null;
  }
}

function isBot(ua) {
  if (!ua) return false;
  const botRegex = /(bot|crawler|spider|facebookexternalhit|whatsapp|twitterbot|slackbot|embedly|quora link preview|pinterest|discordbot|telegrambot|linkedinbot)/i;
  return botRegex.test(ua);
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'playlist';
}

export const onRequestGet = async (context) => {
  const { request, params } = context;
  const url = new URL(request.url);
  const code = (params && params.code) || url.searchParams.get('code') || '';
  const ua = request.headers.get('user-agent');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const decoded = decodePlaylistFromCode(code);

  const siteOrigin = url.origin;
  const shareUrl = url.href;
  const name = decoded?.name || 'Shared Playlist';
  const description = decoded?.desc || `A playlist on ${siteOrigin}`;
  // Use a local non-redirecting image for reliable previews (avoid external 302s like picsum)
  let image = `${siteOrigin}/og/playlist-default.jpg`;
  // Use slugless target to minimize URL issues across apps
  const appTarget = `${siteOrigin}/p?s=${encodeURIComponent(code)}`;

  // For non-bots, perform a server-side redirect to the SPA to avoid any JS/CSP issues
  if (!isBot(ua)) {
    return new Response(null, {
      status: 307,
      headers: {
        'location': appTarget,
        'cache-control': 'no-store, no-cache, must-revalidate',
        'vary': 'User-Agent',
        'x-robots-tag': 'noindex',
      },
    });
  }

  // Bots get an HTML page with OG tags for rich previews

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${name}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:alt" content="Playlist preview" />
  <meta property="og:url" content="${shareUrl}" />
  <meta property="og:site_name" content="Project Nightfall" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${name}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:src" content="${image}" />
  <link rel="canonical" href="${appTarget}" />
  <link rel="image_src" href="${image}" />
  <style>body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;padding:24px;color:#111}</style>
</head>
<body>
  <p>This is a share preview page for social platforms.</p>
  <p><a href="${appTarget}">Open the playlist</a></p>
  <script>
    (function(){
      try {
        var ua = navigator.userAgent || '';
        // naive bot check on client; most bots won't run JS anyway
        var isBot = /(bot|crawler|spider|facebookexternalhit|whatsapp|twitterbot|slackbot|embedly|quora link preview|pinterest|discordbot|telegrambot|linkedinbot)/i.test(ua);
        if (!isBot) {
          window.location.replace(${JSON.stringify(appTarget)});
        }
      } catch (e) {}
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate',
      'vary': 'User-Agent',
      'x-robots-tag': 'noindex',
    },
  });
};

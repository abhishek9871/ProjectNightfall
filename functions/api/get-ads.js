// functions/api/get-ads.js

/**
 * Handles POST requests to fetch ad data from the ExoClick NeverBlock API.
 * Expects a JSON body with a `zoneIds` array: { "zoneIds": ["123456", "789012"] }
 */
export async function onRequestPost(context) {
  try {
    // 1. Parse the incoming request body from the React frontend.
    const { zoneIds } = await context.request.json();

    if (!Array.isArray(zoneIds) || zoneIds.length === 0) {
      return new Response(JSON.stringify({ error: 'zoneIds must be a non-empty array.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Retrieve critical user context from the request headers.
    const userIp = context.request.headers.get('CF-Connecting-IP');
    const userAgent = context.request.headers.get('User-Agent');
    const referer = context.request.headers.get('Referer');
    const acceptLanguage = context.request.headers.get('Accept-Language');

    if (!userIp) {
      return new Response(JSON.stringify({ error: 'Could not determine user IP.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Construct the ExoClick NeverBlock API URL.
    const apiUrl = new URL('https://syndication-adblock.exoclick.com/ads-multi.php');
    apiUrl.searchParams.append('v', '1');
    apiUrl.searchParams.append('user_ip', userIp);

    zoneIds.forEach((id, index) => {
      apiUrl.searchParams.append(`zones[${index}][idzone]`, id);
    });

    // 4. Prepare the headers for the server-to-server request to ExoClick.
    const requestHeaders = new Headers();
    requestHeaders.append('User-Agent', userAgent || '');
    requestHeaders.append('Referer', referer || '');
    requestHeaders.append('Accept-Language', acceptLanguage || '');
    requestHeaders.append('X-Forwarded-For', userIp);

    // 5. Make the fetch request to the ExoClick API.
    const exoClickResponse = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: requestHeaders,
    });

    if (!exoClickResponse.ok) {
      console.error(`ExoClick API error: ${exoClickResponse.status} ${exoClickResponse.statusText}`);
      const errorBody = await exoClickResponse.text();
      console.error(`ExoClick API response: ${errorBody}`);
      return new Response(JSON.stringify({ error: 'Failed to fetch ads from provider.' }), {
        status: 502, // Bad Gateway
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6. Relay the successful JSON response back to the React frontend.
    const adData = await exoClickResponse.json();
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return new Response(JSON.stringify(adData), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error in API proxy function:', error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Handle other HTTP methods, returning a 405 Method Not Allowed.
 */
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  return await onRequestPost(context);
}
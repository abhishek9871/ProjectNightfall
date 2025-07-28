export async function onRequest(request) {
    const url = new URL(request.url);
    const videoId = url.pathname.split('/').pop();

    // Mirror domains for fallback
    const mirrors = ['www.xvv1deos.com', 'www.xvideos4.com'];
    const host = mirrors[Math.floor(Math.random() * mirrors.length)];
    const originUrl = `https://${host}/embedframe/${videoId}`;

    try {
        const resp = await fetch(originUrl, {
            headers: {
                'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (compatible; CloudflareProxy/1.0)'
            }
        });

        const headers = new Headers(resp.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return new Response(resp.body, {
            status: resp.status,
            headers
        });
    } catch (error) {
        // Fallback to other mirror on error
        const fallbackHost = mirrors.find(m => m !== host);
        const fallbackUrl = `https://${fallbackHost}/embedframe/${videoId}`;

        try {
            const fallbackResp = await fetch(fallbackUrl, {
                headers: {
                    'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (compatible; CloudflareProxy/1.0)'
                }
            });

            const headers = new Headers(fallbackResp.headers);
            headers.set('Access-Control-Allow-Origin', '*');

            return new Response(fallbackResp.body, {
                status: fallbackResp.status,
                headers
            });
        } catch (fallbackError) {
            return new Response('Video temporarily unavailable', { status: 503 });
        }
    }
}
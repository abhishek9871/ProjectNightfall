export async function onRequest(request) {
    const url = new URL(request.url);
    const videoId = url.pathname.split('/').pop();

    // Enhanced logging for debugging
    console.log('🔧 Proxy request for videoId:', videoId);
    console.log('🔧 User-Agent:', request.headers.get('User-Agent'));

    // Prioritize mirrors that work best for Jio network
    const mirrors = ['www.xvideos4.com', 'www.xvv1deos.com'];
    const host = mirrors[Math.floor(Math.random() * mirrors.length)];
    const originUrl = `https://${host}/embedframe/${videoId}`;

    console.log('🔧 Trying primary mirror:', originUrl);

    try {
        const resp = await fetch(originUrl, {
            headers: {
                'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.xvideos.com/',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            cf: {
                // Cloudflare-specific optimizations
                cacheEverything: true,
                cacheTtl: 300, // 5 minutes cache
                mirage: true, // Image optimization
                polish: 'lossy' // Compression
            }
        });

        console.log('✅ Primary mirror response:', resp.status);

        const headers = new Headers(resp.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type, User-Agent');
        headers.set('X-Frame-Options', 'ALLOWALL');
        headers.set('Cache-Control', 'public, max-age=300');

        return new Response(resp.body, {
            status: resp.status,
            headers
        });
    } catch (error) {
        console.log('❌ Primary mirror failed:', error.message);
        
        // Fallback to other mirror on error
        const fallbackHost = mirrors.find(m => m !== host);
        const fallbackUrl = `https://${fallbackHost}/embedframe/${videoId}`;

        console.log('🔄 Trying fallback mirror:', fallbackUrl);

        try {
            const fallbackResp = await fetch(fallbackUrl, {
                headers: {
                    'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Referer': 'https://www.xvideos.com/'
                },
                cf: {
                    cacheEverything: true,
                    cacheTtl: 300
                }
            });

            console.log('✅ Fallback mirror response:', fallbackResp.status);

            const headers = new Headers(fallbackResp.headers);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            headers.set('Access-Control-Allow-Headers', 'Content-Type, User-Agent');
            headers.set('X-Frame-Options', 'ALLOWALL');

            return new Response(fallbackResp.body, {
                status: fallbackResp.status,
                headers
            });
        } catch (fallbackError) {
            console.log('❌ All mirrors failed:', fallbackError.message);
            return new Response('Video temporarily unavailable - Please try again', { 
                status: 503,
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
}
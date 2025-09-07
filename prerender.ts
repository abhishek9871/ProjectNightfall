// prerender.ts
import { renderPage } from './src/entry-prerender';

// IMPORTANT: We now rely entirely on React Helmet for meta tags
// This prevents duplication between prerender and runtime
// The old buildHeadForUrl function has been removed

/* Removed buildHeadForUrl function - we now use React Helmet's output
function buildHeadForUrl(urlStr: string): { title: string; elements: Set<HeadElement> } {
  let title = 'Project Nightfall - Premium Adult Entertainment Platform';
  let description = 'Explore a curated collection of high-quality adult entertainment with HD videos, expert reviews, and premium viewing experience.';
  let canonical = BASE_URL;
  let ogType = 'website';
  let ogImage = 'https://project-nightfall.pages.dev/og-image.jpg';
  let twitterCard = 'summary_large_image';

  try {
    const url = new URL(urlStr, BASE_URL);
    const p = url.pathname;
    const segs = p.split('/').filter(Boolean);

    if (p === '/' || p === '') {
      canonical = BASE_URL;
    } else if (p === '/categories') {
      title = 'Adult Video Categories - Project Nightfall';
      description = 'Browse adult videos by category. Find your favorite type of content organized by genre and style. Discover MILF, Amateur, Teen 18+, Lesbian, Anal, Japanese JAV, and more high-quality adult categories.';
      canonical = `${BASE_URL}/categories`;
    } else if (p === '/top-rated') {
      title = 'Top Rated Videos | The Best of Project Nightfall';
      description = 'Discover the highest-rated videos on Project Nightfall, ranked by our community. Explore premium quality content from our curated collection, updated regularly with the best adult entertainment.';
      canonical = `${BASE_URL}/top-rated`;
    } else if (p.startsWith('/watch/')) {
      const id = segs[1];
      const v = videos.find((vv: any) => String(vv.id) === id);
      if (v) {
        title = `${v.title} - Project Nightfall`;
        description = (v.description || '').slice(0, 155) || `Watch ${v.title}. High-quality adult video featuring ${v.actors?.join(', ') || 'premium performers'} in ${v.category} category. Duration: ${v.duration}.`;
        canonical = `${BASE_URL}/watch/${id}`;
        ogType = 'video.other';
        ogImage = v.thumbnailUrl || `https://picsum.photos/seed/video${id}/1200/630`;
        twitterCard = 'player';
      } else {
        canonical = `${BASE_URL}${p}`;
      }
    } else if (p.startsWith('/category/')) {
      const slug = segs[1];
      const allCats = [...categories, ...specialtyClusters];
      const cat = allCats.find((c: any) => c.slug === slug);
      if (cat) {
        const content = (categoryContent as any)[cat.id] || (categoryContent as any)[slug];
        title = content?.title || `Best ${cat.name} Videos - Project Nightfall`;
        description = content?.metaDescription || `Discover the best ${cat.name} adult videos. Watch high-quality ${cat.name} porn featuring top performers in HD. Updated daily with premium ${cat.name} content for your viewing pleasure.`;
        canonical = `${BASE_URL}/category/${slug}`;
      } else {
        canonical = `${BASE_URL}${p}`;
      }
    } else if (
      p === '/about-us' ||
      p === '/contact' ||
      p === '/terms-of-service' ||
      p === '/privacy-policy' ||
      p === '/dmca' ||
      p === '/2257-statement'
    ) {
      const nice = p.replace('/', '').replace(/-/g, ' ');
      title = `${nice.charAt(0).toUpperCase()}${nice.slice(1)} - Project Nightfall`;
      description = `Official ${nice} page for Project Nightfall. Read important information about our adult entertainment platform and our policies.`;
      canonical = `${BASE_URL}${p}`;
    } else {
      canonical = `${BASE_URL}${p}`;
    }
  } catch {
    // Fallbacks already set
  }

  const elements: Set<HeadElement> = new Set([
    { type: 'link', props: { rel: 'canonical', href: canonical } },
    { type: 'meta', props: { name: 'description', content: description } },
    { type: 'meta', props: { name: 'rating', content: 'adult' } },
    { type: 'meta', props: { property: 'og:type', content: ogType } },
    { type: 'meta', props: { property: 'og:title', content: title } },
    { type: 'meta', props: { property: 'og:description', content: description } },
    { type: 'meta', props: { property: 'og:url', content: canonical } },
    { type: 'meta', props: { property: 'og:site_name', content: 'Project Nightfall' } },
    { type: 'meta', props: { property: 'og:image', content: ogImage } },
    { type: 'meta', props: { property: 'og:image:width', content: '1200' } },
    { type: 'meta', props: { property: 'og:image:height', content: '630' } },
    { type: 'meta', props: { property: 'og:image:alt', content: title } },
    { type: 'meta', props: { name: 'twitter:card', content: twitterCard } },
    { type: 'meta', props: { name: 'twitter:title', content: title } },
    { type: 'meta', props: { name: 'twitter:description', content: description } },
    { type: 'meta', props: { name: 'twitter:image', content: ogImage } },
    { type: 'meta', props: { name: 'twitter:site', content: '@ProjectNightfall' } }
  ]);

  // Add video-specific Open Graph and Twitter metadata for watch pages
  try {
    const url = new URL(urlStr, BASE_URL);
    const p = url.pathname;
    const segs = p.split('/').filter(Boolean);
    
    if (p.startsWith('/watch/')) {
      const id = segs[1];
      const v = videos.find((vv: any) => String(vv.id) === id);
      if (v && v.embedUrls && v.embedUrls[0]) {
        elements.add({ type: 'meta', props: { property: 'og:video', content: v.embedUrls[0] } });
        elements.add({ type: 'meta', props: { property: 'og:video:secure_url', content: v.embedUrls[0] } });
        elements.add({ type: 'meta', props: { property: 'og:video:type', content: 'text/html' } });
        elements.add({ type: 'meta', props: { property: 'og:video:width', content: '1280' } });
        elements.add({ type: 'meta', props: { property: 'og:video:height', content: '720' } });
        
        if (v.duration) {
          const [mins, secs] = v.duration.split(':');
          const totalSeconds = (parseInt(mins) * 60) + parseInt(secs);
          elements.add({ type: 'meta', props: { property: 'og:video:duration', content: totalSeconds.toString() } });
        }
        
        elements.add({ type: 'meta', props: { name: 'twitter:player', content: v.embedUrls[0] } });
        elements.add({ type: 'meta', props: { name: 'twitter:player:width', content: '1280' } });
        elements.add({ type: 'meta', props: { name: 'twitter:player:height', content: '720' } });
      }
    }
  } catch {
    // Ignore video metadata errors
  }

  return { title, elements };
}
*/

// Export the prerender function that the plugin expects
export async function prerender(data: { url: string; [key: string]: any }) {
  try {
    console.log(`Prerendering: ${data.url}`);
    const renderResult = renderPage(data.url);
    const { html, helmet } = renderResult;

    // IMPORTANT: Use React Helmet's generated tags, not our own
    // This prevents duplication between prerender and runtime
    if (helmet) {
      // Extract head elements from Helmet
      const title = helmet.title ? helmet.title.toString() : 'Project Nightfall';
      const meta = helmet.meta ? helmet.meta.toString() : '';
      const link = helmet.link ? helmet.link.toString() : '';
      const script = helmet.script ? helmet.script.toString() : '';
      
      // Combine all helmet-generated tags
      const helmetTags = `${meta}${link}${script}`;
      
      console.log(`Using Helmet-generated tags for ${data.url}`);
      
      // Return HTML with Helmet's head tags
      return {
        html,
        head: {
          title: title.replace(/<title[^>]*>|<\/title>/g, ''), // Extract title text
          lang: 'en',
          elements: helmetTags
        }
      };
    }
    
    // Fallback if no helmet data (shouldn't happen)
    console.warn(`No helmet data for ${data.url}, using fallback`);
    return {
      html,
      head: {
        title: 'Project Nightfall',
        lang: 'en'
      }
    };
  } catch (error) {
    console.warn(`Failed to render route ${data.url}:`, error);
    return {
      html: `<div>Error rendering route: ${data.url}</div>`
    };
  }
}

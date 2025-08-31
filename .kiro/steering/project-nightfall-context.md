# Project Nightfall - AI Assistant Steering Guide

## Project Overview
Project Nightfall is a modern adult video streaming SPA built with React 19.1.0 and TypeScript, deployed on Cloudflare Pages. The primary business model is revenue generation through sophisticated advertising while providing a premium user experience.

**Production URL:** https://project-nightfall.pages.dev  
**Current Status:** Production-ready with 362 videos across 16 categories

## Technology Stack
- **Framework:** React 19.1.0 with TypeScript 5.7.2
- **Build Tool:** Vite 6.2.0 with advanced optimizations
- **Styling:** Tailwind CSS 4.1.11
- **Routing:** React Router DOM v6.30.1
- **Deployment:** Cloudflare Pages (Manual CLI via Wrangler)
- **Video Integration:** XVideos platform (xvideos4.com domain)

## Architecture Principles
- Single Page Application (SPA) with lazy loading
- Component composition over inheritance
- Strict TypeScript interfaces for all props
- Performance-first approach with Core Web Vitals optimization
- SEO-first design with comprehensive schema markup

## Key Directories & Files
```
├── src/pages/           # All page components (HomePage, CategoryPage, WatchPage, etc.)
├── components/          # Reusable UI components
├── data/               # Static data (videos.ts, categories.ts)
├── utils/              # Utility functions (geoDetector.ts, categoryUtils.ts)
├── scripts/            # Build and indexing scripts
├── public/             # Static assets and verification files
└── dist/               # Build output (deployment target)
```

## Content Structure
- **Total Videos:** 362 videos with XVideos integration
- **Categories:** 16 total (8 main featured + 8 specialty collections)
- **Pages:** 387 indexed pages total
- **Video Embedding:** XVideos native player via iframe integration

## SEO Implementation
- **Complete JSON-LD schemas** on all pages (WebPage, VideoObject, FAQPage, etc.)
- **Dynamic meta tags** with React Helmet Async
- **XML Sitemaps:** 3 sitemaps (main, category, video) with automated generation
- **Rapid Indexing:** Google Search Console API + IndexNow API (Bing/Yandex)
- **Adult Content Compliance:** Proper rating tags and age verification

## Deployment & Build Process
- **Build Command:** `npm run build` (includes sitemap generation)
- **Deploy Command:** `npx wrangler pages deploy dist --project-name=project-nightfall --branch=master`
- **Build Pipeline:** Video sitemap → Category sitemap → Vite build → Asset optimization
- **Environment:** Production secrets in Cloudflare dashboard

## External Integrations
- **Google Search Console API:** Service account with google-credentials.json
- **IndexNow API:** Key `010ead4cd05b443e92eb4d00c2f586f1` for Bing/Yandex
- **XVideos Platform:** Geographic optimization with utils/geoDetector.ts
- **Google Analytics 4:** Event tracking via components/Analytics.tsx

## Development Guidelines
- **Code Style:** Use TypeScript interfaces, React hooks, and functional components
- **Performance:** Prioritize Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **SEO:** Every new page needs JSON-LD schema and proper meta tags
- **Security:** Maintain CSP compliance and adult content warnings
- **Testing:** Manual testing required before deployment

## Common Tasks & Scripts
```bash
# Development
npm run dev              # Start development server
npm run build           # Production build with sitemaps
npm run preview         # Preview production build

# Deployment
npm run deploy:cloudflare # Deploy to Cloudflare Pages

# SEO & Indexing
npm run index:google     # Submit to Google Search Console
npm run index:now       # Submit to IndexNow (Bing/Yandex)
npm run index:all       # Submit all category pages
```

## Legal & Compliance
- **Legal Pages:** Privacy Policy, Terms of Service, DMCA, 2257 Statement
- **GDPR/CCPA Compliance:** Comprehensive privacy implementation
- **Adult Content Rating:** Proper schema markup and warnings

## Performance Optimizations
- **Code Splitting:** React vendor and UI vendor chunks
- **Lazy Loading:** Dynamic imports for all page components
- **Asset Optimization:** Image compression and DNS prefetching
- **PWA Support:** Service worker with offline functionality
- **CDN:** Cloudflare global edge network

## Video Integration Details
- **Embed Format:** `https://www.xvideos4.com/embedframe/{video_id}`
- **Player:** Native XVideos player with full controls
- **Security:** Sandboxed iframe with restricted permissions
- **Geographic Optimization:** Automatic domain switching for Indian users
- **Data Structure:** Videos stored in data/videos.ts with embedUrls array

## Category Management
- **Main Categories (8):** Amateur, MILF, POV, Japanese, Teen, Lesbian, Anal, Big Tits
- **Specialty Categories (8):** Fetish, Threesome, BBW, Mature, Interracial, Cosplay, Hardcore, Misc
- **URL Structure:** `/category/{slug}` with pagination support
- **SEO:** Each category has dedicated schema and FAQ sections

## AI Assistant Instructions
When working on this project:
1. **Always maintain adult content compliance** and age verification
2. **Prioritize SEO** - every new page needs proper schema markup
3. **Use existing patterns** - follow established component and routing patterns
4. **Test XVideos integration** - ensure video embedding works correctly
5. **Update sitemaps** - run sitemap generation after content changes
6. **Consider performance** - maintain Core Web Vitals optimization
7. **Follow TypeScript** - use strict typing for all new code
8. **Maintain legal compliance** - ensure all legal pages remain accessible

## Environment Variables
```bash
VITE_INDEXNOW_KEY=010ead4cd05b443e92eb4d00c2f586f1  # IndexNow API key
```

## Critical Files to Preserve
- `google-credentials.json` - Google Search Console API access
- `data/videos.ts` - Complete video library with XVideos URLs
- `data/categories.ts` - Category definitions and metadata
- `public/010ead4cd05b443e92eb4d00c2f586f1.txt` - IndexNow verification
- `wrangler.toml` - Cloudflare Pages configuration

This steering document ensures AI assistants understand the complete context of Project Nightfall and can provide accurate, relevant assistance while maintaining the project's architecture, compliance, and performance standards.
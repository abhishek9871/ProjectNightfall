# Technology Stack

## Core Technologies
- **Frontend Framework**: React 19.1.0 with TypeScript 5.7.2 (strict mode)
- **Build Tool**: Vite 6.2.0 with Hot Module Replacement
- **Styling**: Tailwind CSS (CDN-based, dark theme with slate palette)
- **State Management**: React Hooks + Local Storage (persistent data)
- **Package Manager**: npm
- **Deployment Platform**: Cloudflare Pages (migrated from Netlify)
- **Video Player**: Native Xvideos iframe embeds (removed Plyr dependency)

## Development Dependencies
- **@vitejs/plugin-react**: React plugin for Vite
- **@types/node**: Node.js TypeScript definitions
- **ts-node**: TypeScript execution for Node.js scripts
- **vite-plugin-sitemap**: SEO sitemap generation with dynamic routes
- **vite-plugin-compression**: Build compression for production
- **vite-plugin-pwa**: Progressive Web App features
- **wrangler**: Cloudflare Pages CLI for deployment
- **@custom-react-hooks/use-lock-body-scroll**: Modal scroll management
- **@headlessui/react**: Accessible UI components
- **plyr**: Video player library (for enhanced controls)

## Common Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Create production build in dist/
npm run preview      # Preview production build locally
npm run add-video    # Add new video content via Node.js script
npm run verify       # Verify deployment readiness
```

### Deployment (Cloudflare Pages)
```bash
npm run deploy       # Deploy to Cloudflare Pages
npm run deploy:pages # Deploy to Cloudflare Pages (alias)
npm run deploy:cloudflare # Deploy to Cloudflare Pages (explicit)
```

### Project Setup
```bash
npm install          # Install all dependencies
wrangler login       # Authenticate with Cloudflare (one-time)
# Windows: setup.bat
# Unix/Mac: ./setup.sh (automated setup with environment config)
```

## Build Configuration (vite.config.ts)
- **Plugins**: React, Sitemap, Compression, PWA
- **Environment Variables**: VITE_PAGES_URL for deployment URL
- **Path Aliases**: `@` alias points to project root
- **Dynamic Routes**: 25+ routes for categories and pages
- **PWA Manifest**: Service worker and app manifest configured

## Cloudflare Configuration (wrangler.toml)
- **Project Name**: project-nightfall
- **Compatibility Date**: 2025-01-27
- **Build Output**: dist/
- **Functions**: Automatic routing for /proxy/* endpoints

## Performance Features
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Efficient iframe and resource loading
- **PWA Support**: Service worker with auto-update
- **Compression**: Gzip compression for production builds
- **SEO**: Automatic sitemap with 25+ dynamic routes
- **Hot Module Replacement**: Development workflow optimization

## Content Management
- **Video Embeds**: 48 real Xvideos iframe embeds with intelligent routing
- **Network Detection**: Smart Jio/Airtel network detection for optimal performance
- **Proxy System**: Cloudflare Functions proxy for blocked networks
- **Data Structure**: TypeScript interfaces for Video, Category, AffiliateBanner
- **Content Scripts**: Node.js scripts for adding video content
- **Thumbnail System**: Picsum placeholder system with video ID seeding
- **Modal Player**: Enhanced video player with network-aware URL generation

## Ad Network Integration Points
- **Ad Slots**: Prepared placeholders for Traffic Junky, Hilltop Ads, Adsterra, JuicyAds
- **Analytics**: Google Analytics 4 event tracking for video plays
- **Conversion Tracking**: Ready for ad network pixel integration
- **Mobile Optimization**: Responsive ad slot sizing

## Browser Support & Testing
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile optimized
- **Testing**: Playwright automation for cross-device QA
- **Responsive**: Mobile-first design with breakpoints (768px, 1024px)

## Version 2.0 Technical Improvements
- **Mobile Navigation**: Complete hamburger menu implementation
- **State Management**: Mobile sidebar state with proper cleanup
- **Animation System**: CSS transitions for mobile interactions
- **Touch Optimization**: 44px minimum touch targets
- **Performance**: Zero critical console errors, optimized loading

## Version 2.1 Network Optimization
- **Jio Network Detection**: Automatic detection of Jio network blocking
- **Smart Routing**: Network-aware URL generation for optimal performance
- **Cloudflare Proxy**: Functions-based proxy for blocked networks
- **Performance Analytics**: Network-specific performance tracking
- **Fallback System**: Multi-level fallback chain for reliability
- **Zero Regression**: Maintains all existing functionality

## Network Performance Features
- **Jio Users**: <5 second load times (vs previous 4-5 minutes)
- **Airtel Users**: Maintained 3-5 second performance
- **Global Users**: Maintained 3-5 second performance
- **Proxy Latency**: <500ms additional latency for proxy routing
- **Reliability**: 99.9% uptime via Cloudflare infrastructure
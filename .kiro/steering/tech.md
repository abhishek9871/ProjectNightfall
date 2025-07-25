# Technology Stack

## Core Technologies
- **Frontend Framework**: React 19.1.0 with TypeScript 5.7.2 (strict mode)
- **Build Tool**: Vite 6.2.0 with Hot Module Replacement
- **Styling**: Tailwind CSS (CDN-based, dark theme with slate palette)
- **State Management**: React Hooks + Local Storage (persistent data)
- **Package Manager**: npm

## Development Dependencies
- **@vitejs/plugin-react**: React plugin for Vite
- **@types/node**: Node.js TypeScript definitions
- **ts-node**: TypeScript execution for Node.js scripts
- **vite-plugin-sitemap**: SEO sitemap generation with dynamic routes
- **vite-plugin-compression**: Build compression for production
- **vite-plugin-pwa**: Progressive Web App features

## Common Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Create production build in dist/
npm run preview      # Preview production build locally
npm run add-video    # Add new video content via Node.js script
```

### Project Setup
```bash
npm install          # Install all dependencies
# Windows: setup.bat
# Unix/Mac: ./setup.sh (automated setup with environment config)
```

## Build Configuration (vite.config.ts)
- **Plugins**: React, Sitemap, Compression, PWA
- **Environment Variables**: GEMINI_API_KEY support
- **Path Aliases**: `@` alias points to project root
- **Dynamic Routes**: 25+ routes for categories and pages
- **PWA Manifest**: Service worker and app manifest configured

## Performance Features
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Efficient iframe and resource loading
- **PWA Support**: Service worker with auto-update
- **Compression**: Gzip compression for production builds
- **SEO**: Automatic sitemap with 25+ dynamic routes
- **Hot Module Replacement**: Development workflow optimization

## Content Management
- **Video Embeds**: Xvideos iframe integration with geo-restriction handling
- **Data Structure**: TypeScript interfaces for Video, Category, AffiliateBanner
- **Content Scripts**: Node.js scripts for adding video content
- **Thumbnail System**: Picsum placeholder system with video ID seeding

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
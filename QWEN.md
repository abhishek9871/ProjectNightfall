# Project Nightfall - Revenue Engine

This document provides essential context about the Project Nightfall codebase for efficient development, debugging, and feature implementation.

## Project Overview

Project Nightfall is an adult legal content platform built with modern web technologies. The application uses React with TypeScript for the frontend, Vite as the build tool, and implements a comprehensive content management system with category-based organization.

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Deployment**: Cloudflare Pages
- **SEO**: Comprehensive sitemap generation and schema markup

## Project Structure

```
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page-level components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── data/               # Data management
├── data/                   # Static content data
├── scripts/                # Build and deployment scripts
├── public/                 # Static assets
└── components/             # Additional components
```

## Key Architectural Components

### Content Organization
- Content is organized into 8 main categories (pillars) and 8 specialty clusters
- Each content item is assigned to a category using the cluster assignment algorithm
- Categories support pagination and search functionality

### SEO System
- Dynamic meta tag generation per page
- Comprehensive JSON-LD schema implementation
- Sitemap generation for all content types
- Canonical URL management

### Ad System
- Ad engine context manages ad frequency and placement
- Interstitial ads with countdown timers
- Exit intent detection for popunder ads
- Frequency capping using localStorage

### Data Management
- Static data files for content and categories
- Type-safe interfaces for all data structures
- Utility functions for content categorization

## Development Workflow

### Local Development
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

## Key Files and Directories

### Configuration Files
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Styling configuration
- `.env` - Environment variables

### Core Application Files
- `App.tsx` - Main application component
- `AppRouter.tsx` - Routing configuration
- `index.tsx` - Application entry point

### Data Files
- `data/videos.ts` - Content data
- `data/categories.ts` - Category definitions
- `data/affiliates.ts` - Affiliate links

### Scripts
- `scripts/deploy.js` - Deployment automation
- `scripts/generateSitemaps.js` - SEO sitemap generation
- `scripts/addVideo.js` - Content management

## Important Patterns and Conventions

### Component Structure
- Components are organized by feature/function
- TypeScript interfaces define all props
- Context API for global state management
- Custom hooks for reusable logic

### Routing
- Declarative routing with React Router
- Lazy loading for code splitting
- Error boundaries for graceful error handling

### SEO Implementation
- Dynamic meta tags per page
- Structured data for search engines
- Canonical URLs for content deduplication

### Performance Optimization
- Code splitting with React.lazy
- Image optimization with proper sizing
- Critical resource preloading
- Service worker configuration

## Debugging Tips

1. Check browser console for TypeScript and runtime errors
2. Verify data imports in `data/` directory for content issues
3. Use React DevTools for component state inspection
4. Check network tab for failed API requests or asset loading
5. Verify localStorage for ad frequency capping values

## Common Development Tasks

### Adding New Content
1. Update `data/videos.ts` with new content
2. Run sitemap generation scripts
3. Deploy updated content

### Adding New Categories
1. Update `data/categories.ts` or `src/data/specialtyClusters.ts`
2. Update cluster assignment logic if needed
3. Regenerate sitemaps

### Modifying Ad Behavior
1. Update `src/contexts/AdEngineContext.tsx` for ad logic
2. Modify `components/InterstitialAd.tsx` for display changes
3. Adjust frequency capping in `src/utils/adUtils.ts`

## Deployment Process

The deployment process involves:
1. Building the application with Vite
2. Generating sitemaps and SEO assets
3. Deploying to Cloudflare Pages and Netlify
4. Verifying deployment with automated checks

For production deployment, use the official Wrangler command:
```bash
npx wrangler pages deploy dist --project-name=project-nightfall --branch=master
```
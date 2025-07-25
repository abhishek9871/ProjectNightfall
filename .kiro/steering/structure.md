# Project Structure

## Root Directory Organization
```
project-nightfall-revenue-engine/
├── components/           # React components (UI layer)
│   ├── AgeGate.tsx      # Age verification modal
│   ├── Header.tsx       # Search & mobile navigation
│   ├── Sidebar.tsx      # Navigation & affiliate banners
│   ├── VideoGrid.tsx    # Content display with filtering
│   ├── VideoCard.tsx    # Individual video cards with ratings
│   ├── Categories.tsx   # Category management & filtering
│   ├── Footer.tsx       # Legal links & ad slots
│   ├── LegalPages.tsx   # Legal compliance modals
│   ├── PrivacyNotice.tsx # Cookie consent system
│   ├── Analytics.tsx    # Google Analytics 4 integration
│   ├── AdSlot.tsx       # Ad network integration component
│   └── icons/           # Icon components
│       └── NavIcons.tsx # Navigation & UI icons
├── data/                # Static data and content management
│   ├── videos.ts        # 48 videos with real Xvideos embeds
│   ├── categories.ts    # 8 categories with descriptions
│   └── affiliates.ts    # CrakRevenue & ExoClick banners
├── hooks/               # Custom React hooks
│   └── useLocalStorage.tsx # Persistent storage management
├── utils/               # Utility functions
│   └── geoDetector.ts   # Geo-restriction handling
├── scripts/             # Build and utility scripts
│   └── addVideo.js      # Video content management script
├── public/              # Static assets and legal pages
├── plans/               # Project documentation
├── App.tsx              # Main application container
├── types.ts             # Global TypeScript definitions
├── index.tsx            # React application entry point
├── index.html           # HTML entry point
├── vite.config.ts       # Build configuration
└── dist/                # Production build output
```

## Component Architecture Patterns

### Functional Components with TypeScript
- All components use React functional components with hooks
- Strict TypeScript typing with proper interfaces
- Props interfaces defined for each component
- Return type: `React.ReactNode` for all components

### Core Component Responsibilities
- **App.tsx**: Root state management, age verification, page routing
- **AgeGate.tsx**: Legal age verification with localStorage persistence
- **Header.tsx**: Search functionality, mobile hamburger menu
- **Sidebar.tsx**: Navigation, affiliate banners, mobile slide-out
- **VideoGrid.tsx**: Content filtering, sorting algorithms, page-specific logic
- **VideoCard.tsx**: Video presentation, rating system, click-to-play
- **Categories.tsx**: Category filtering, video count management

## Data Layer Architecture

### Video Data Structure (data/videos.ts)
- 48 videos with real Xvideos embed URLs
- Geo-restriction handling (xvideos.com → xvideos4.com for India)
- Complete metadata: ratings, views, duration, categories, tags
- Upload dates for trending algorithm

### Category System (data/categories.ts)
- 8 distinct categories: Amateur, College, MILF, Office, Outdoor, Fitness, Romance, Gaming
- Category descriptions and video counts
- Filter integration with search functionality

### Affiliate Configuration (data/affiliates.ts)
- CrakRevenue and ExoClick banner configurations
- Ready for additional affiliate network integration

## File Naming Conventions
- **Components**: PascalCase (e.g., `VideoCard.tsx`, `AgeGate.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLocalStorage.tsx`)
- **Utilities**: camelCase (e.g., `geoDetector.ts`)
- **Data files**: camelCase (e.g., `videos.ts`, `categories.ts`)
- **Types**: camelCase (e.g., `types.ts`)

## Import/Export Patterns
- **Named exports** for components: `export function ComponentName()`
- **Default export** for main App component only
- **Interface exports** from types.ts using named exports
- **Relative imports** for local files (./components/, ../data/)
- **Absolute imports** using `@` alias for root-level imports

## State Management Architecture

### Application-Level State (App.tsx)
```typescript
const [isVerified, setIsVerified] = useLocalStorage('ageVerified', false);
const [currentPage, setCurrentPage] = useState<PageType>('home');
const [searchQuery, setSearchQuery] = useState('');
const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
```

### Persistent Storage Strategy
- **Age Verification**: localStorage with 'ageVerified' key
- **Cookie Consent**: localStorage with 'cookieConsent' key
- **User Preferences**: Ready for expansion with additional settings

### Props Drilling Pattern
- Parent-to-child data flow for state management
- Event handlers passed down for state updates
- Clean separation of concerns between components

## Page Type System
```typescript
export type PageType = 'home' | 'trending' | 'categories' | 'top-rated';
export type LegalPageType = 'terms' | 'privacy' | 'dmca' | '2257';
```

## Styling Architecture

### Tailwind CSS Implementation
- **CDN-based**: No build step required for styles
- **Dark Theme**: Slate color palette (slate-950, slate-900, slate-800)
- **Responsive Design**: Mobile-first with breakpoints
  - Mobile: `< 768px` (default)
  - Tablet: `sm:` (768px+)
  - Desktop: `lg:` (1024px+)

### Component-Scoped Styling
- Styles defined within component JSX using Tailwind classes
- Consistent spacing system (p-4, p-6, p-8)
- Hover states and transitions for interactive elements

## Mobile Navigation Architecture (Version 2.0)

### Mobile Sidebar Implementation
```typescript
// Mobile state management
const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

// Mobile sidebar props
interface SidebarProps {
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
    isMobileOpen: boolean;      // NEW in v2.0
    onMobileClose: () => void;  // NEW in v2.0
}
```

### Mobile Interaction Patterns
- **Hamburger Menu**: Header component triggers sidebar
- **Overlay System**: Semi-transparent backdrop with blur
- **Slide Animation**: Transform-based CSS transitions
- **Auto-Close**: Sidebar closes on navigation or overlay click

## Legal Compliance Structure
- **Static Pages**: HTML files in public/ directory
- **Dynamic Modals**: React components for legal content
- **Modal System**: Overlay-based with scroll support
- **Compliance Pages**: Terms, Privacy, DMCA, 2257 documentation

## Revenue Integration Points
- **Ad Slots**: Prepared in Footer and AdSlot components
- **Affiliate Links**: Sidebar banner placement with target="_blank"
- **Analytics**: Google Analytics 4 event tracking
- **Conversion Tracking**: Ready for ad network pixel integration
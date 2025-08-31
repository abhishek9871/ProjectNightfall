import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PrivacyNotice } from './components/PrivacyNotice';
import PrerenderMeta from './components/PrerenderMeta';
import Analytics from './components/Analytics';
import { AdStrategyProvider } from './components/AdStrategyProvider';
import { AggressiveAdStrategy } from './src/components/AggressiveAdStrategy';
import { AdEngineProvider } from './src/contexts/AdEngineContext';
import { SearchProvider } from './src/contexts/SearchContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { PlaylistProvider } from './src/contexts/PlaylistContext';
import { ShareProvider } from './components/ShareProvider';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load page components for code splitting
const HomePage = React.lazy(() => import('./src/pages/HomePage'));
const CategoryHub = React.lazy(() => import('./src/pages/CategoryHub'));
const CategoryPage = React.lazy(() => import('./src/pages/CategoryPage'));
const TopRatedPage = React.lazy(() => import('./src/pages/TopRatedPage').then(module => ({ default: module.TopRatedPage })));
const WatchPage = React.lazy(() => import('./src/pages/WatchPage').then(module => ({ default: module.WatchPage })));
const FavoritesPage = React.lazy(() => import('./src/pages/FavoritesPage'));
const PlaylistsPage = React.lazy(() => import('./src/pages/PlaylistsPage'));
const PlaylistViewPage = React.lazy(() => import('./src/pages/PlaylistViewPage'));
const SharedPlaylistPage = React.lazy(() => import('./src/pages/SharedPlaylistPage'));

// Legal and trust pages
const AboutUsPage = React.lazy(() => import('./src/pages/AboutUsPage'));
const ContactPage = React.lazy(() => import('./src/pages/ContactPage'));
const TermsOfServicePage = React.lazy(() => import('./src/pages/TermsOfServicePage'));
const PrivacyPolicyPage = React.lazy(() => import('./src/pages/PrivacyPolicyPage'));
const DMCAPage = React.lazy(() => import('./src/pages/DMCAPage'));
const Statement2257Page = React.lazy(() => import('./src/pages/Statement2257Page'));

function AppContent(): React.ReactNode {

  return (
    <>
      <PrerenderMeta />
      <Analytics />
      <AdStrategyProvider />
      <AggressiveAdStrategy />
      <PrivacyNotice />

      <SearchProvider>
        <FavoritesProvider>
          <PlaylistProvider>
            <ShareProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoryHub />} />
              <Route path="/top-rated" element={<TopRatedPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlist/:id" element={<PlaylistViewPage />} />
              <Route path="/shared-playlist" element={<SharedPlaylistPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              
              {/* Legal and trust pages */}
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/dmca" element={<DMCAPage />} />
              <Route path="/2257-statement" element={<Statement2257Page />} />
            </Routes>
            </Suspense>
            </ShareProvider>
          </PlaylistProvider>
        </FavoritesProvider>
      </SearchProvider>
    </>
  );
}

export function AppRouter() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AdEngineProvider>
          <AppContent />
        </AdEngineProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
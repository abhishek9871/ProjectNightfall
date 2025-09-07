// src/entry-prerender.tsx
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';

// Import contexts
import { AdEngineProvider } from './contexts/AdEngineContext';
import { SearchProvider } from './contexts/SearchContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { PlaylistProvider } from './contexts/PlaylistContext';

// Import page components
import HomePage from './pages/HomePage';
import CategoryHub from './pages/CategoryHub';
import CategoryPage from './pages/CategoryPage';
import { TopRatedPage } from './pages/TopRatedPage';
import { WatchPage } from './pages/WatchPage';
import FavoritesPage from './pages/FavoritesPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistViewPage from './pages/PlaylistViewPage';
import SharedPlaylistPage from './pages/SharedPlaylistPage';

// Legal pages
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DMCAPage from './pages/DMCAPage';
import Statement2257Page from './pages/Statement2257Page';

// Import available components only
import { AdStrategyProvider } from './components/AdStrategyProvider';
import { AggressiveAdStrategy } from './components/AggressiveAdStrategy';

// This function will be called by the prerender script for each route.
export function renderPage(url: string) {
  const helmetContext: { helmet?: any } = {};

  const AppContent = () => {
    return (
      <AdEngineProvider>
        <SearchProvider>
          <FavoritesProvider>
            <PlaylistProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoryHub />} />
                <Route path="/top-rated" element={<TopRatedPage />} />
                <Route path="/playlists" element={<PlaylistsPage />} />
                <Route path="/playlist/:id" element={<PlaylistViewPage />} />
                <Route path="/shared-playlist" element={<SharedPlaylistPage />} />
                <Route path="/p/:slug" element={<SharedPlaylistPage />} />
                <Route path="/p" element={<SharedPlaylistPage />} />
                <Route path="/s/:data" element={<SharedPlaylistPage />} />
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
            </PlaylistProvider>
          </FavoritesProvider>
        </SearchProvider>
      </AdEngineProvider>
    );
  };

  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AppContent />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  // Return both the rendered HTML and the captured helmet data (meta tags, title, etc.)
  return {
    html,
    helmet: helmetContext.helmet,
  };
}

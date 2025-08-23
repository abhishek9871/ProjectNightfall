import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AgeGate } from './components/AgeGate';
import { PrivacyNotice } from './components/PrivacyNotice';
import { useLocalStorage } from './hooks/useLocalStorage';
import Analytics from './components/Analytics';
import { AdStrategyProvider } from './components/AdStrategyProvider';
import { AggressiveAdStrategy } from './src/components/AggressiveAdStrategy';
import { AdEngineProvider } from './src/contexts/AdEngineContext';
import { SearchProvider } from './src/contexts/SearchContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load page components for code splitting
const HomePage = React.lazy(() => import('./src/pages/HomePage'));
const CategoryHub = React.lazy(() => import('./src/pages/CategoryHub'));
const CategoryPage = React.lazy(() => import('./src/pages/CategoryPage'));
const TopRatedPage = React.lazy(() => import('./src/pages/TopRatedPage').then(module => ({ default: module.TopRatedPage })));
const WatchPage = React.lazy(() => import('./src/pages/WatchPage').then(module => ({ default: module.WatchPage })));

// Legal and trust pages
const AboutUsPage = React.lazy(() => import('./src/pages/AboutUsPage'));
const ContactPage = React.lazy(() => import('./src/pages/ContactPage'));
const TermsOfServicePage = React.lazy(() => import('./src/pages/TermsOfServicePage'));
const PrivacyPolicyPage = React.lazy(() => import('./src/pages/PrivacyPolicyPage'));
const DMCAPage = React.lazy(() => import('./src/pages/DMCAPage'));
const Statement2257Page = React.lazy(() => import('./src/pages/Statement2257Page'));

function AppContent(): React.ReactNode {
  const [isVerified, setIsVerified] = useLocalStorage('ageVerified', false);

  // Detect search engine bots and bypass age gate
  const isBot = React.useMemo(() => {
    if (typeof window === 'undefined') return true; // SSR
    const userAgent = window.navigator.userAgent.toLowerCase();
    const botPatterns = [
      'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
      'yandexbot', 'facebookexternalhit', 'twitterbot', 'rogerbot',
      'linkedinbot', 'embedly', 'quora link preview', 'showyoubot',
      'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet',
      'www.google.com/webmasters/tools/richsnippets', 'slackbot', 'vkshare',
      'w3c_validator', 'redditbot', 'applebot', 'whatsapp', 'flipboard',
      'tumblr', 'bitlybot', 'skypeuripreview', 'nuzzel', 'discordbot',
      'google page speed', 'qwantify', 'pinterestbot', 'bitrix link preview',
      'xing-contenttabreceiver', 'chrome-lighthouse', 'telegrambot'
    ];
    return botPatterns.some(pattern => userAgent.includes(pattern));
  }, []);

  // Bypass age gate for bots and verified users
  if (!isVerified && !isBot) {
    return <AgeGate onVerified={() => setIsVerified(true)} />;
  }

  return (
    <>
      <Analytics />
      <AdStrategyProvider />
      <AggressiveAdStrategy />
      <PrivacyNotice />

      <SearchProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryHub />} />
          <Route path="/top-rated" element={<TopRatedPage />} />
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
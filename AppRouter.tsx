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
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load page components for code splitting
const HomePage = React.lazy(() => import('./src/pages/HomePage'));
const CategoryHub = React.lazy(() => import('./src/pages/CategoryHub'));
const CategoryPage = React.lazy(() => import('./src/pages/CategoryPage'));
const WatchPage = React.lazy(() => import('./src/pages/WatchPage').then(module => ({ default: module.WatchPage })));

function AppContent(): React.ReactNode {
  const [isVerified, setIsVerified] = useLocalStorage('ageVerified', false);

  if (!isVerified) {
    return <AgeGate onVerified={() => setIsVerified(true)} />;
  }

  return (
    <>
      <Analytics />
      <AdStrategyProvider />
      <AggressiveAdStrategy />
      <PrivacyNotice />

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryHub />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </Suspense>
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
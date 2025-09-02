import React, { useState, useEffect } from 'react';
import { AgeGate } from './components/AgeGate';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VideoGrid } from './components/VideoGrid';
import { Footer } from './components/Footer';
import { PrivacyNotice } from './components/PrivacyNotice';
import { LegalPages, LegalPageType } from './components/LegalPages';
import { useLocalStorage } from './hooks/useLocalStorage';
import Analytics from './components/Analytics';
import { SEOHead } from './components/SEOHead';
import { AdStrategyProvider } from './components/AdStrategyProvider';
import { AggressiveAdStrategy } from './src/components/AggressiveAdStrategy';
import { AdEngineProvider } from './src/contexts/AdEngineContext';
import { videos } from './data/videos';

import { PageType } from './types';

function AppContent(): React.ReactNode {
    const [isVerified, setIsVerified] = useLocalStorage('ageVerified', false);
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [currentPageNum, setCurrentPageNum] = useState(1);

    // Handle URL parameters for page navigation
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page') as PageType;
        if (pageParam && ['home', 'trending', 'categories', 'top-rated'].includes(pageParam)) {
            setCurrentPage(pageParam);
        }
    }, []);

    

    // Reset pagination when search query changes
    React.useEffect(() => {
        setCurrentPageNum(1);
    }, [searchQuery]);

    if (!isVerified) {
        return <AgeGate onVerified={() => setIsVerified(true)} />;
    }

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <SEOHead 
                currentPage={currentPage}
                searchQuery={searchQuery}
            />
            <Analytics />
            <AdStrategyProvider />
            <AggressiveAdStrategy />
            <div className="flex">
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />

                <main className="flex-1 lg:ml-64">
                    <Header
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    />
                    <div className="p-4 sm:p-6 lg:p-8" data-testid="video-grid">
                        <VideoGrid
                            currentPage={currentPage}
                            searchQuery={searchQuery}
                            currentPageNum={currentPageNum}
                            onPageChange={setCurrentPageNum}
                            totalVideos={videos.length}
                        />
                    </div>
                    <Footer />
                </main>
            </div>
            <PrivacyNotice />
            {legalPage && (
                <LegalPages
                    page={legalPage}
                    onClose={() => setLegalPage(null)}
                />
            )}
        </div>
    );
}

export default function App(): React.ReactNode {
    return (
        <AdEngineProvider>
            <AppContent />
        </AdEngineProvider>
    );
}
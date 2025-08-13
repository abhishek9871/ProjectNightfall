import React, { useState, useEffect } from 'react';
import { AgeGate } from './components/AgeGate';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VideoGrid } from './components/VideoGrid';
import { Footer } from './components/Footer';
import { PrivacyNotice } from './components/PrivacyNotice';
import { LegalPages, LegalPageType } from './components/LegalPages';
import { PreRollModal } from './components/PreRollModal';
import { ModalPlayer } from './components/ModalPlayer';
import { useLocalStorage } from './hooks/useLocalStorage';
import Analytics from './components/Analytics';
import { SEOHead } from './components/SEOHead';
import { AdStrategyProvider } from './components/AdStrategyProvider';
import { AggressiveAdStrategy } from './src/components/AggressiveAdStrategy';
import { InterstitialAd } from './components/InterstitialAd';
import { AdEngineProvider, useAdEngine } from './src/contexts/AdEngineContext';
import { Video } from './types';
import { videos } from './data/videos';

export type PageType = 'home' | 'trending' | 'categories' | 'top-rated';

function AppContent(): React.ReactNode {
    const [isVerified, setIsVerified] = useLocalStorage('ageVerified', false);
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle URL parameters for page navigation
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page') as PageType;
        if (pageParam && ['home', 'trending', 'categories', 'top-rated'].includes(pageParam)) {
            setCurrentPage(pageParam);
        }
    }, []);
    const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [currentPageNum, setCurrentPageNum] = useState(1);

    // Unified modal state to prevent race conditions
    type ModalState = {
        step: 'idle' | 'preroll' | 'content';
        video: Video | null;
    };
    const [modalState, setModalState] = useState<ModalState>({
        step: 'idle',
        video: null,
    });

    // Interstitial ad state
    const [showInterstitial, setShowInterstitial] = useState(false);
    const [nextPage, setNextPage] = useState<PageType | null>(null);

    // Get ad engine functions
    const { triggerInterstitial } = useAdEngine();

    // Dynamic page title management
    useEffect(() => {
        let title = 'Project Nightfall - Curated Adult Entertainment';

        if (modalState.step === 'content' && modalState.video) {
            title = `${modalState.video.title} - Project Nightfall`;
        } else if (currentPage === 'categories') {
            // For categories page, we'll use a generic title since we don't have access to selected category here
            title = 'Categories - Project Nightfall';
        } else if (currentPage === 'trending') {
            title = 'Trending Videos - Project Nightfall';
        } else if (currentPage === 'top-rated') {
            title = 'Top Rated Videos - Project Nightfall';
        } else if (currentPage === 'home') {
            title = 'Project Nightfall - Curated Adult Entertainment';
        }

        document.title = title;
    }, [currentPage, modalState.step, modalState.video]);

    // DNS prefetching for Xvideos domains to reduce connection time
    React.useEffect(() => {
        const dnsPrefetch = (domains: string[]) => {
            domains.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = `https://${domain}`;
                document.head.appendChild(link);
            });
        };

        dnsPrefetch(['xvideos4.com', 'xvv1deos.com', 'xvideos.com']);
    }, []);

    // Effect for injecting global ad scripts
    useEffect(() => {
        const scriptId = 'exoclick-native-widget-script';
        // Prevent re-injecting the script
        if (document.getElementById(scriptId)) {
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://mix.exoclick.com/getwidget.js';
        script.async = true;
        document.head.appendChild(script);

        // Optional: Cleanup script on main App unmount (for strict SPAs)
        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    // Modal flow handlers - now deprecated in favor of direct navigation
    // Videos now navigate directly to /watch/:id pages

    const handleAdComplete = () => {
        // STEP 2: Transition from 'preroll' to 'content'.
        // The selected video is already correctly set in the state.
        setModalState((prevState) => ({
            ...prevState,
            step: 'content',
        }));
    };

    const handleCloseContentModal = () => {
        // STEP 3: Reset the entire flow back to 'idle'.
        setModalState({
            step: 'idle',
            video: null,
        });
    };

    // Navigation handler with interstitial logic
    const handleNavigation = (page: PageType) => {
        // Reset pagination when changing pages
        setCurrentPageNum(1);

        // Update URL to reflect the current page
        const newUrl = page === 'home' ? '/' : `/?page=${page}`;
        window.history.pushState({}, '', newUrl);

        // Rule: Show interstitial only if it hasn't been shown this session,
        // and the user is navigating away from the 'home' page.
        if (currentPage === 'home') {
            let interstitialShown = false;
            triggerInterstitial(() => {
                setNextPage(page);
                setShowInterstitial(true);
                interstitialShown = true;
            });
            // If interstitial is blocked, navigate directly
            if (!interstitialShown) {
                setCurrentPage(page);
            }
        } else {
            // Navigate directly if not from home page
            setCurrentPage(page);
        }
    };

    // Reset pagination when search query changes
    React.useEffect(() => {
        setCurrentPageNum(1);
    }, [searchQuery]);

    // Ad closed handler
    const handleAdClosed = () => {
        setShowInterstitial(false);
        if (nextPage) {
            setCurrentPage(nextPage);
            // Update URL after ad closes
            const newUrl = nextPage === 'home' ? '/' : `/?page=${nextPage}`;
            window.history.pushState({}, '', newUrl);
            setNextPage(null);
        }
    };

    if (!isVerified) {
        return <AgeGate onVerified={() => setIsVerified(true)} />;
    }

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <SEOHead 
                currentPage={currentPage}
                searchQuery={searchQuery}
                videoTitle={modalState.video?.title}
                videoDescription={modalState.video?.description}
                videoThumbnail={modalState.video?.thumbnailUrl}
            />
            <Analytics />
            <AdStrategyProvider />
            <AggressiveAdStrategy />
            <div className="flex">
                <Sidebar
                    currentPage={currentPage}
                    onPageChange={handleNavigation}
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

            {/* Pre-roll ad modal */}
            {modalState.step === 'preroll' && modalState.video && (
                <PreRollModal
                    vastTagUrl="https://s.magsrv.com/v1/vast.php?idzone=5692184"
                    onAdComplete={handleAdComplete}
                />
            )}

            {/* Main video content modal */}
            {modalState.step === 'content' && modalState.video && (
                <ModalPlayer
                    video={modalState.video}
                    isOpen={modalState.step === 'content'}
                    onClose={handleCloseContentModal}
                />
            )}

            {/* Interstitial Ad */}
            {showInterstitial && (
                <InterstitialAd
                    adZoneId="YOUR_ADSTERRA_INTERSTITIAL_ZONE_ID"
                    onAdClosed={handleAdClosed}
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
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
import { AdStrategyProvider } from './components/AdStrategyProvider';
import { AggressiveAdStrategy } from './src/components/AggressiveAdStrategy';
import { InterstitialAd } from './components/InterstitialAd';
import { AdEngineProvider, useAdEngine } from './src/contexts/AdEngineContext';
import { Video } from './types';

export type PageType = 'home' | 'trending' | 'categories' | 'top-rated';

function AppContent(): React.ReactNode {
    const [isVerified, setIsVerified] = useLocalStorage('ageVerified', false);
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
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
    const { triggerPreRoll, triggerInterstitial } = useAdEngine();

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

    // Race-condition-free modal flow handlers
    const handleVideoCardClick = (video: Video) => {
        if (triggerPreRoll()) {
            // STEP 1: Set the video and trigger the 'preroll' step.
            // This is a single, atomic state update that prevents race conditions.
            setModalState({
                step: 'preroll',
                video: video,
            });
        }
    };

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

    // Ad closed handler
    const handleAdClosed = () => {
        setShowInterstitial(false);
        if (nextPage) {
            setCurrentPage(nextPage);
            setNextPage(null);
        }
    };

    if (!isVerified) {
        return <AgeGate onVerified={() => setIsVerified(true)} />;
    }

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
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
                            onVideoCardClick={handleVideoCardClick}
                        />
                    </div>
                    <Footer onLegalPageOpen={setLegalPage} />
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
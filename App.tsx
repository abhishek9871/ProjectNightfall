import React, { useState } from 'react';
import { AgeGate } from './components/AgeGate';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VideoGrid } from './components/VideoGrid';
import { Footer } from './components/Footer';
import { PrivacyNotice } from './components/PrivacyNotice';
import { LegalPages, LegalPageType } from './components/LegalPages';
import { useLocalStorage } from './hooks/useLocalStorage';
import Analytics from './components/Analytics';
import AdSlot from './components/AdSlot';

export type PageType = 'home' | 'trending' | 'categories' | 'top-rated';

export default function App(): React.ReactNode {
    const [isVerified, setIsVerified] = useLocalStorage('ageVerified', false);
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    if (!isVerified) {
        return <AgeGate onVerified={() => setIsVerified(true)} />;
    }

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <Analytics />
            <AdSlot type="popunder" network="hilltopads" />
            <div className="flex">
                <Sidebar 
                    currentPage={currentPage} 
                    onPageChange={setCurrentPage}
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
                        <VideoGrid currentPage={currentPage} searchQuery={searchQuery} />
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
        </div>
    );
}
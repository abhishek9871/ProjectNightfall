import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { VideoGrid } from '../../components/VideoGrid';
import { Footer } from '../../components/Footer';
import { SEOHead } from '../../components/SEOHead';
import { PageType } from '../../types';
import { videos } from '../../data/videos';
import { useSearch } from '../contexts/SearchContext';
import '../utils/webVitals';
import { useLocation } from 'react-router-dom';

export default function HomePage(): React.ReactNode {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const { searchQuery, setSearchQuery } = useSearch();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [currentPageNum, setCurrentPageNum] = useState(1);
    
    // Track previous search query to immediately reset pagination
    const prevSearchQueryRef = useRef(searchQuery);

    // Handle URL parameters for page navigation and search changes
    useEffect(() => {
        const handleUrlChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const pageParam = urlParams.get('page') as PageType;
            if (pageParam && ['home', 'trending', 'categories', 'top-rated'].includes(pageParam)) {
                setCurrentPage(pageParam);
            }
        };
        
        // Handle initial load
        handleUrlChange();
        
        // Listen to popstate events (back/forward navigation)
        window.addEventListener('popstate', handleUrlChange);
        
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    // Derive currentPage from router location for in-app navigation via <Link>
    const location = useLocation();
    useEffect(() => {
        const pageParam = new URLSearchParams(location.search).get('page') as PageType | null;
        const next = pageParam && ['home', 'trending'].includes(pageParam) ? pageParam : 'home';
        setCurrentPage(next);
    }, [location.search]);

    // Reset pagination immediately when search query changes
    useEffect(() => {
        if (searchQuery !== prevSearchQueryRef.current) {
            setCurrentPageNum(1);
            // Scroll to top when search query changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
            prevSearchQueryRef.current = searchQuery;
        }
    }, [searchQuery]);

    // Navigation handled via router links; currentPage is derived from URL

    // Scroll to top when navigating between different page types (home, trending, etc.)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <SEOHead
                currentPage={currentPage}
                searchQuery={searchQuery}
            />
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

        </div>
    );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { PrivacyNotice } from './PrivacyNotice';
import { PageType } from '../types';
import { useSearch } from '../src/contexts/SearchContext';

interface LayoutProps {
    children: React.ReactNode;
    currentPage?: PageType;
    onPageChange?: (page: PageType) => void;
}

export function Layout({
    children,
    currentPage = 'home',
    onPageChange
}: LayoutProps): React.ReactNode {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();
    const navigate = useNavigate();

    // Handle navigation - if no onPageChange provided, use router navigation
    const handlePageChange = (page: PageType) => {
        if (onPageChange) {
            onPageChange(page);
        } else {
            // Navigate to main app routes
            switch (page) {
                case 'home':
                    navigate('/');
                    break;
                case 'trending':
                case 'categories':
                case 'top-rated':
                    navigate(`/?page=${page}`);
                    break;
                default:
                    navigate('/');
            }
        }
    };

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <div className="flex">
                <Sidebar
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
                <main className="flex-1 lg:ml-64">
                    <Header
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    />
                    {children}
                    <Footer />
                </main>
            </div>
            <PrivacyNotice />

        </div>
    );
}
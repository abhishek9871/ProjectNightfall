import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { PrivacyNotice } from './PrivacyNotice';
import { LegalPages } from './LegalPages';
import { PageType, LegalPageType } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    currentPage?: PageType;
    onPageChange?: (page: PageType) => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export function Layout({
    children,
    currentPage = 'home',
    onPageChange,
    searchQuery = '',
    onSearchChange = () => { }
}: LayoutProps): React.ReactNode {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
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
                        onSearchChange={onSearchChange}
                        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    />
                    {children}
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
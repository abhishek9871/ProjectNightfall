import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { PrivacyNotice } from './PrivacyNotice';
import { useSearch } from '../src/contexts/SearchContext';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({
    children
}: LayoutProps): React.ReactNode {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
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
                    {children}
                    <Footer />
                </main>
            </div>
            <PrivacyNotice />

        </div>
    );
}
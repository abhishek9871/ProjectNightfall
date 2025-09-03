import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';
import { useSearch } from '../contexts/SearchContext';
import { VideoGrid } from '../../components/VideoGrid';
import { videos } from '../../data/videos';

export default function ContactPage(): React.ReactNode {
    const { searchQuery } = useSearch();
    const [currentPageNum, setCurrentPageNum] = useState(1);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPageNum(1);
    }, [searchQuery]);

    // Auto-scroll to top when search query changes
    useEffect(() => {
        if (searchQuery.trim()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [searchQuery]);

    return (
        <Layout>
            <Helmet>
                <title>Contact Us | Project Nightfall Support</title>
                <meta name="description" content="Get in touch with the Project Nightfall team. For support, inquiries, or feedback, please reach out to us via email." />
            </Helmet>
            
            {/* Search Results Section Above Legal Content */}
            {searchQuery && (
                <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-800">
                    <div className="mb-4">
                        <p className="text-slate-400 text-sm">
                            Showing search results for "{searchQuery}" • <span className="text-slate-500">Contact information below</span>
                        </p>
                    </div>
                    <VideoGrid
                        currentPage="home"
                        searchQuery={searchQuery}
                        currentPageNum={currentPageNum}
                        onPageChange={setCurrentPageNum}
                        totalVideos={videos.length}
                    />
                </div>
            )}
            
            <div className="container mx-auto p-4 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-6">Contact Us</h1>
                <div className="space-y-4 text-lg text-gray-300 max-w-4xl">
                    <p>For any inquiries, support requests, or feedback, please do not hesitate to reach out to our team.</p>
                    <p>You can contact us directly via email at: <a href="mailto:support@projectnightfall.com" className="text-blue-400 hover:underline">support@projectnightfall.com</a>.</p>
                    <p>We aim to respond to all inquiries within 24-48 hours.</p>
                </div>
            </div>
        </Layout>
    );
}
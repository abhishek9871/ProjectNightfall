import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';
import { useSearch } from '../contexts/SearchContext';
import { VideoGrid } from '../../components/VideoGrid';
import { videos } from '../../data/videos';

export default function TermsOfServicePage(): React.ReactNode {
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
        <Layout currentPage="home">
            <Helmet>
                <title>Terms of Service | Project Nightfall</title>
                <meta name="description" content="Please read the Terms of Service for Project Nightfall. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms." />
            </Helmet>
            
            {/* Search Results Section Above Legal Content */}
            {searchQuery && (
                <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-800">
                    <div className="mb-4">
                        <p className="text-slate-400 text-sm">
                            Showing search results for "{searchQuery}" • <span className="text-slate-500">Terms of Service below</span>
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
            
            <div className="container mx-auto p-4 text-white max-w-4xl">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6">Terms of Service</h1>
                        <div className="space-y-6 text-gray-300">
                            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                            <p>By accessing and using Project Nightfall ("the Website"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">2. Age Verification and Restrictions</h2>
                            <p><strong>YOU MUST BE AT LEAST 18 YEARS OF AGE TO ACCESS THIS WEBSITE.</strong> This website contains adult content that is not suitable for minors. By using this site, you represent and warrant that:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>You are at least 18 years old or the age of majority in your jurisdiction</li>
                                <li>You have the legal right to access adult material in your location</li>
                                <li>You will not allow minors to access this website through your account or device</li>
                                <li>You understand that this website contains explicit adult content</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">3. Content Usage and Restrictions</h2>
                            <p>All content on this website is for personal, non-commercial use only. You agree that you will not:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Redistribute, republish, or share any content from this website</li>
                                <li>Use automated systems to access or download content</li>
                                <li>Attempt to circumvent any security measures or access restrictions</li>
                                <li>Use the content for commercial purposes without explicit permission</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">4. User Conduct</h2>
                            <p>You agree to use this website in a manner consistent with all applicable laws and regulations. Prohibited activities include but are not limited to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Harassment or abuse of other users</li>
                                <li>Posting or transmitting illegal content</li>
                                <li>Attempting to gain unauthorized access to our systems</li>
                                <li>Interfering with the proper functioning of the website</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">5. Privacy and Data Protection</h2>
                            <p>Your privacy is important to us. Please review our Privacy Policy, which governs the collection, use, and disclosure of your personal information and forms part of these Terms of Service.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">6. Intellectual Property</h2>
                            <p>All content, trademarks, and intellectual property on this website are owned by their respective owners. Unauthorized use of any intellectual property is strictly prohibited.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">7. Disclaimer of Warranties</h2>
                            <p>This website is provided "as is" without any warranties, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">8. Limitation of Liability</h2>
                            <p>In no event shall Project Nightfall be liable for any indirect, incidental, special, or consequential damages arising from your use of this website.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">9. Modifications to Terms</h2>
                            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of any modifications.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">10. Termination</h2>
                            <p>We may terminate or suspend your access to the website at any time, without prior notice, for conduct that we believe violates these Terms of Service.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">11. Governing Law</h2>
                            <p>These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
                            
                            <p className="text-sm text-gray-400 italic">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
            </div>
        </Layout>
    );
}
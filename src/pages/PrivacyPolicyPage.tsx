import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';
import { useSearch } from '../contexts/SearchContext';
import { VideoGrid } from '../../components/VideoGrid';
import { videos } from '../../data/videos';

export default function PrivacyPolicyPage(): React.ReactNode {
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
                <title>Privacy Policy | Project Nightfall</title>
                <meta name="description" content="Your privacy is important to us. Our Privacy Policy explains how Project Nightfall collects, uses, and protects your personal information." />
            </Helmet>
            
            {/* Search Results Section Above Legal Content */}
            {searchQuery && (
                <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-800">
                    <div className="mb-4">
                        <p className="text-slate-400 text-sm">
                            Showing search results for "{searchQuery}" • <span className="text-slate-500">Privacy Policy below</span>
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
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6">Privacy Policy</h1>
                        <div className="space-y-6 text-gray-300">
                            <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                            <p>We collect several types of information from and about users of our website:</p>
                            
                            <h3 className="text-xl font-semibold text-white">Information You Provide</h3>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Age verification data (confirmation that you are 18+)</li>
                                <li>Contact information when you reach out to us</li>
                                <li>Preferences and settings you configure</li>
                            </ul>
                            
                            <h3 className="text-xl font-semibold text-white">Information Collected Automatically</h3>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Usage data and browsing patterns</li>
                                <li>Device information and IP addresses</li>
                                <li>Cookies and similar tracking technologies</li>
                                <li>Analytics data to improve our services</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Ensure compliance with age verification requirements</li>
                                <li>Personalize your experience and content recommendations</li>
                                <li>Communicate with you about our services</li>
                                <li>Analyze usage patterns to enhance user experience</li>
                                <li>Comply with legal obligations and industry regulations</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">3. Information Sharing and Disclosure</h2>
                            <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>With your explicit consent</li>
                                <li>To comply with legal obligations or court orders</li>
                                <li>To protect our rights, property, or safety</li>
                                <li>With service providers who assist in website operations</li>
                                <li>In connection with business transfers or mergers</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">4. Cookies and Tracking Technologies</h2>
                            <p>We use cookies and similar technologies to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Remember your preferences and settings</li>
                                <li>Analyze website traffic and usage patterns</li>
                                <li>Provide personalized content and advertisements</li>
                                <li>Ensure website security and prevent fraud</li>
                            </ul>
                            <p>You can control cookie settings through your browser preferences.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">5. Data Security</h2>
                            <p>We implement industry-standard security measures to protect your personal information, including:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Encryption of sensitive data in transit and at rest</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Access controls and authentication measures</li>
                                <li>Secure hosting infrastructure and monitoring</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">6. Data Retention</h2>
                            <p>We retain personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">7. Your Rights and Choices</h2>
                            <p>Depending on your location, you may have the right to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Access and review your personal information</li>
                                <li>Correct inaccurate or incomplete data</li>
                                <li>Delete your personal information</li>
                                <li>Restrict or object to certain processing activities</li>
                                <li>Data portability where applicable</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">8. Third-Party Links</h2>
                            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">9. Children's Privacy</h2>
                            <p>Our website is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware of such collection, we will take steps to delete the information immediately.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">10. International Data Transfers</h2>
                            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">11. Changes to This Policy</h2>
                            <p>We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page with an updated effective date.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">12. Contact Information</h2>
                            <p>If you have questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@project-nightfall.com" className="text-purple-400 hover:text-purple-300">privacy@project-nightfall.com</a></p>
                            
                            <p className="text-sm text-gray-400 italic">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
            </div>
        </Layout>
    );
}
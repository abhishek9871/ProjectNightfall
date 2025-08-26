import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';
import { useSearch } from '../contexts/SearchContext';
import { VideoGrid } from '../../components/VideoGrid';
import { videos } from '../../data/videos';

export default function Statement2257Page(): React.ReactNode {
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
                <title>18 U.S.C. 2257 Compliance Statement | Project Nightfall</title>
                <meta name="description" content="View the 18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement for all content featured on Project Nightfall." />
            </Helmet>
            
            {/* Search Results Section Above Legal Content */}
            {searchQuery && (
                <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-800">
                    <div className="mb-4">
                        <p className="text-slate-400 text-sm">
                            Showing search results for "{searchQuery}" • <span className="text-slate-500">2257 Statement below</span>
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
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6">18 U.S.C. 2257 Compliance Statement</h1>
                        <div className="space-y-6 text-gray-300">
                            <h2 className="text-2xl font-semibold text-white">Age Verification and Record-Keeping Compliance</h2>
                            <p>Project Nightfall is committed to full compliance with 18 U.S.C. § 2257 and 28 C.F.R. Part 75 record-keeping requirements for all content displayed on this website.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">Age Verification Statement</h2>
                            <p><strong>All models, actors, actresses, and other persons that appear in any visual depiction of actual sexually explicit conduct appearing or otherwise contained in or accessible through this website were over the age of eighteen (18) years at the time of the creation of such depictions.</strong></p>
                            
                            <h2 className="text-2xl font-semibold text-white">Content Sourcing</h2>
                            <p>This website displays embedded content from third-party platforms that maintain their own 2257 compliance records. We do not host, store, or produce any sexually explicit content directly. All embedded content is sourced from platforms that maintain proper age verification and record-keeping compliance.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">Custodian of Records</h2>
                            <p>For content that falls under our direct responsibility, the records required by 18 U.S.C. § 2257 and 28 C.F.R. Part 75 are kept by the Custodian of Records at:</p>
                            
                            <div className="bg-slate-800 p-4 rounded-lg my-4">
                                <p><strong>Project Nightfall - Custodian of Records</strong><br/>
                                Legal Compliance Department<br/>
                                Email: <a href="mailto:records@project-nightfall.com" className="text-purple-400 hover:text-purple-300">records@project-nightfall.com</a></p>
                            </div>
                            
                            <h2 className="text-2xl font-semibold text-white">Record Inspection</h2>
                            <p>Records may be inspected during regular business hours by contacting our Custodian of Records. Reasonable advance notice is required for inspection requests.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">Third-Party Content Compliance</h2>
                            <p>All embedded content displayed on this website is sourced from established adult entertainment platforms that maintain their own 2257 compliance programs. These platforms include but are not limited to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Xvideos.com and affiliated domains</li>
                                <li>Other verified adult content platforms</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">Reporting Non-Compliance</h2>
                            <p>If you believe any content on this website does not comply with age verification requirements, please contact us immediately at: <a href="mailto:compliance@project-nightfall.com" className="text-purple-400 hover:text-purple-300">compliance@project-nightfall.com</a></p>
                            
                            <h2 className="text-2xl font-semibold text-white">Legal Framework</h2>
                            <p>This compliance statement is made pursuant to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>18 U.S.C. § 2257 - Record keeping requirements</li>
                                <li>28 C.F.R. Part 75 - Record keeping requirements under section 2257</li>
                                <li>18 U.S.C. § 2257A - Record keeping requirements for simulated sexual conduct</li>
                            </ul>
                            
                            <h2 className="text-2xl font-semibold text-white">Compliance Certification</h2>
                            <p>Project Nightfall certifies that it maintains full compliance with all applicable federal record-keeping requirements and age verification laws. This compliance statement is reviewed and updated regularly to ensure continued adherence to all legal requirements.</p>
                            
                            <p className="text-sm text-gray-400 italic">This compliance statement is effective as of {new Date().toLocaleDateString()} and supersedes all previous versions.</p>
                        </div>
            </div>
        </Layout>
    );
}
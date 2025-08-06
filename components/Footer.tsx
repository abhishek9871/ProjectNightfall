import React from 'react';
import { DisplaySlot } from './AdBanner';
import { LegalPageType } from './LegalPages';

interface FooterProps {
    onLegalPageOpen: (page: LegalPageType) => void;
}

export function Footer({ onLegalPageOpen }: FooterProps): React.ReactNode {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-12" role="contentinfo">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Ad Banner placeholder */}
                <div className="mb-8">
                    <DisplaySlot slotId="footer-banner-728x90" />
                </div>
                <nav className="flex flex-wrap justify-center -mx-5 -my-2" role="navigation" aria-label="Footer">
                    {/* Trust & Information Pages */}
                    <div className="px-5 py-2">
                        <button 
                            onClick={() => onLegalPageOpen('about')}
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors"
                        >
                            About Us
                        </button>
                    </div>
                    <div className="px-5 py-2">
                        <button 
                            onClick={() => onLegalPageOpen('contact')}
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors"
                        >
                            Contact
                        </button>
                    </div>
                    
                    {/* Legal Compliance Pages */}
                    <div className="px-5 py-2">
                        <button 
                            onClick={() => onLegalPageOpen('terms')}
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            Terms of Service
                        </button>
                    </div>
                    <div className="px-5 py-2">
                        <button 
                            onClick={() => onLegalPageOpen('privacy')}
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            Privacy Policy
                        </button>
                    </div>
                    <div className="px-5 py-2">
                        <button 
                            onClick={() => onLegalPageOpen('dmca')}
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            DMCA
                        </button>
                    </div>
                    <div className="px-5 py-2">
                        <button 
                            onClick={() => onLegalPageOpen('2257')}
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            18 U.S.C. 2257
                        </button>
                    </div>
                </nav>
                <p className="mt-8 text-center text-base text-slate-500">
                    &copy; {new Date().getFullYear()} Project Nightfall. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
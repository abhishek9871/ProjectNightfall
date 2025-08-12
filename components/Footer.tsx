import React from 'react';
import { Link } from 'react-router-dom';
import { DisplaySlot } from './AdBanner';

export function Footer(): React.ReactNode {
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
                        <Link 
                            to="/about-us"
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors"
                        >
                            About Us
                        </Link>
                    </div>
                    <div className="px-5 py-2">
                        <Link 
                            to="/contact"
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                    
                    {/* Legal Compliance Pages */}
                    <div className="px-5 py-2">
                        <Link 
                            to="/terms-of-service"
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            Terms of Service
                        </Link>
                    </div>
                    <div className="px-5 py-2">
                        <Link 
                            to="/privacy-policy"
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                    <div className="px-5 py-2">
                        <Link 
                            to="/dmca"
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            DMCA
                        </Link>
                    </div>
                    <div className="px-5 py-2">
                        <Link 
                            to="/2257-statement"
                            className="text-base text-slate-400 hover:text-purple-400 transition-colors font-medium"
                        >
                            18 U.S.C. 2257
                        </Link>
                    </div>
                </nav>
                <p className="mt-8 text-center text-base text-slate-500">
                    &copy; {new Date().getFullYear()} Project Nightfall. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
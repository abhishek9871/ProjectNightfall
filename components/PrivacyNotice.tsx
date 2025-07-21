import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function PrivacyNotice(): React.ReactNode {
    const [hasConsented, setHasConsented] = useLocalStorage('cookieConsent', false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!hasConsented) {
            // Use a timeout to avoid layout shift issues on initial render
            const timer = setTimeout(() => setIsVisible(true), 500);
            return () => clearTimeout(timer);
        }
    }, [hasConsented]);

    const handleAccept = () => {
        setHasConsented(true);
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div 
            className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-40 transition-opacity duration-300"
            role="region"
            aria-label="Privacy Notice"
        >
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="p-4 rounded-lg bg-slate-800/90 backdrop-blur-sm shadow-lg sm:flex sm:items-center sm:justify-between">
                    <p className="flex-1 text-sm font-medium text-white">
                        This website uses cookies to ensure you get the best experience. By continuing to use this site, you agree to our use of cookies.
                    </p>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-4">
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
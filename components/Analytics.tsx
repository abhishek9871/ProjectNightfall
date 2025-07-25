import React, { useEffect } from 'react';

const Analytics: React.FC = () => {
    useEffect(() => {
        // Load Google Analytics script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
        `;
        document.head.appendChild(script2);

        return () => {
            // Cleanup scripts on unmount
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, []);

    // Global page view tracking
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'page_view', {
                page_path: window.location.pathname
            });
        }
    }, []);

    return null;
};

export default Analytics;
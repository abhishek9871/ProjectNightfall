import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageType } from '../types';

interface SEOHeadProps {
    currentPage: PageType;
    searchQuery?: string;
    videoTitle?: string;
    videoDescription?: string;
    videoThumbnail?: string;
    categoryName?: string;
}

export function SEOHead({ 
    currentPage, 
    searchQuery, 
    videoTitle: _videoTitle, 
    videoDescription: _videoDescription, 
    videoThumbnail: _videoThumbnail,
    categoryName 
}: SEOHeadProps): React.ReactNode {
    
    // Generate page-specific meta data
    const getPageMeta = () => {
        const baseUrl = 'https://project-nightfall.pages.dev';
        
        switch (currentPage) {
            case 'trending':
                return {
                    title: 'Trending Adult Videos - Project Nightfall',
                    description: 'Discover the most popular and trending adult videos. Updated daily with the hottest content from top performers.',
                    url: `${baseUrl}/trending`,
                    keywords: 'trending adult videos, popular videos, hot content, viral adult content'
                };
            case 'top-rated':
                return {
                    title: 'Top Rated Videos | The Best of Project Nightfall',
                    description: 'Discover the highest-rated videos on Project Nightfall, ranked by our community. Explore premium quality content from our curated collection, updated regularly.',
                    url: `${baseUrl}/top-rated`,
                    keywords: 'top rated videos, best adult content, 5 star videos, premium adult videos, highest rated, community choice'
                };
            case 'categories':
                const categoryTitle = categoryName ? `${categoryName} Videos` : 'Adult Video Categories';
                const categoryDesc = categoryName 
                    ? `Browse ${categoryName} adult videos. High-quality content in the ${categoryName} category.`
                    : 'Browse adult videos by category. Find your favorite type of content organized by genre and style.';
                return {
                    title: `${categoryTitle} - Project Nightfall`,
                    description: categoryDesc,
                    url: categoryName ? `${baseUrl}/categories/${categoryName.toLowerCase()}` : `${baseUrl}/categories`,
                    keywords: `${categoryName || 'categories'} videos, adult categories, video genres`
                };
            default:
                if (searchQuery) {
                    return {
                        title: `Search: ${searchQuery} - Project Nightfall`,
                        description: `Search results for "${searchQuery}". Find the best adult videos matching your interests.`,
                        url: `${baseUrl}/?search=${encodeURIComponent(searchQuery)}`,
                        keywords: `${searchQuery}, adult video search, find videos`
                    };
                }
                return {
                    title: 'Project Nightfall - Premium Adult Entertainment Platform',
                    description: 'Explore a curated collection of high-quality adult entertainment with HD videos, expert reviews, and premium viewing experience.',
                    url: baseUrl,
                    keywords: 'adult videos, premium content, HD videos, adult entertainment, video streaming'
                };
        }
    };

    const pageMeta = getPageMeta();

    // Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Project Nightfall",
        "url": "https://project-nightfall.pages.dev",
        "logo": "https://project-nightfall.pages.dev/logo.png",
        "description": "Premium adult entertainment platform featuring curated HD videos and expert reviews",
        "sameAs": [
            "https://twitter.com/ProjectNightfall"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@project-nightfall.pages.dev"
        }
    };

    // Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Project Nightfall",
        "url": "https://project-nightfall.pages.dev",
        "description": "Premium adult entertainment platform",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://project-nightfall.pages.dev/?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    // Breadcrumb Schema (for category pages)
    const getBreadcrumbSchema = () => {
        if (currentPage === 'categories' && categoryName) {
            return {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://project-nightfall.pages.dev"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Categories",
                        "item": "https://project-nightfall.pages.dev/categories"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": categoryName,
                        "item": `https://project-nightfall.pages.dev/categories/${categoryName.toLowerCase()}`
                    }
                ]
            };
        }
        return null;
    };

    const breadcrumbSchema = getBreadcrumbSchema();

    return (
        <Helmet>
            <title>{pageMeta.title}</title>
            <meta name="description" content={pageMeta.description} />
            <meta name="keywords" content={pageMeta.keywords} />
            
            {/* Canonical URL - MUST point to the actual page */}
            <link rel="canonical" href={pageMeta.url} />
            
            {/* Robots */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageMeta.title} />
            <meta property="og:description" content={pageMeta.description} />
            <meta property="og:url" content={pageMeta.url} />
            <meta property="og:site_name" content="Project Nightfall" />
            <meta property="og:image" content="https://project-nightfall.pages.dev/og-image.jpg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageMeta.title} />
            <meta name="twitter:description" content={pageMeta.description} />
            <meta name="twitter:image" content="https://project-nightfall.pages.dev/og-image.jpg" />

            {/* Adult content meta */}
            <meta name="rating" content="adult" />

            {/* JSON-LD Schemas */}
            <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
            {breadcrumbSchema && (
                <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            )}
        </Helmet>
    );
}
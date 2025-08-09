import React from 'react';
import { PageType } from '../App';

interface BreadcrumbProps {
    currentPage: PageType;
    categoryName?: string;
    searchQuery?: string;
}

export function Breadcrumb({ currentPage, categoryName, searchQuery }: BreadcrumbProps): React.ReactNode {
    const getBreadcrumbItems = () => {
        const items = [
            { name: 'Home', href: '/', current: false }
        ];

        if (searchQuery) {
            items.push({ name: `Search: ${searchQuery}`, href: `/?search=${encodeURIComponent(searchQuery)}`, current: true });
        } else {
            switch (currentPage) {
                case 'trending':
                    items.push({ name: 'Trending', href: '/trending', current: true });
                    break;
                case 'top-rated':
                    items.push({ name: 'Top Rated', href: '/top-rated', current: true });
                    break;
                case 'categories':
                    items.push({ name: 'Categories', href: '/categories', current: !categoryName });
                    if (categoryName) {
                        items.push({ name: categoryName, href: `/categories/${categoryName.toLowerCase()}`, current: true });
                    }
                    break;
                default:
                    items[0].current = true;
            }
        }

        return items;
    };

    const breadcrumbItems = getBreadcrumbItems();

    // Generate breadcrumb schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://project-nightfall.pages.dev${item.href}`
        }))
    };

    return (
        <>
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    {breadcrumbItems.map((item, index) => (
                        <li key={item.name} className="inline-flex items-center">
                            {index > 0 && (
                                <svg className="w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            )}
                            {item.current ? (
                                <span className="text-sm font-medium text-slate-300" aria-current="page">
                                    {item.name}
                                </span>
                            ) : (
                                <a 
                                    href={item.href} 
                                    className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-purple-400 transition-colors"
                                >
                                    {index === 0 && (
                                        <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                        </svg>
                                    )}
                                    {item.name}
                                </a>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
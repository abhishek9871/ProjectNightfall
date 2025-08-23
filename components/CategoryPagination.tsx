import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    categorySlug: string;
}

export function CategoryPagination({ currentPage, totalPages, categorySlug }: CategoryPaginationProps): React.ReactNode {
    const [searchParams] = useSearchParams();

    if (totalPages <= 1) return null;

    // Scroll handling now managed by CategoryPage useEffect for consistent behavior

    const generatePageUrl = (page: number): string => {
        const params = new URLSearchParams(searchParams);
        
        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }
        
        const queryString = params.toString();
        const baseUrl = `/category/${categorySlug}`;
        
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };

    const getVisiblePages = (): number[] => {
        const pages: number[] = [];
        const maxVisible = 7; // Show up to 7 page numbers

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Smart pagination logic
            if (currentPage <= 4) {
                // Near the beginning
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push(-1); // Ellipsis
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Near the end
                pages.push(1);
                pages.push(-1); // Ellipsis
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // In the middle
                pages.push(1);
                pages.push(-1); // Ellipsis
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push(-1); // Ellipsis
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav className="flex justify-center mt-12 mb-8" aria-label="Category pagination">
            <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Previous Button */}
                {currentPage > 1 ? (
                    <Link
                        to={generatePageUrl(currentPage - 1)}
                        className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Previous page"
                    >
                        <span className="hidden sm:inline">← Previous</span>
                        <span className="sm:hidden">‹</span>
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm font-medium text-slate-500 bg-slate-900 border border-slate-800 rounded-lg cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <span className="hidden sm:inline">← Previous</span>
                        <span className="sm:hidden">‹</span>
                    </span>
                )}

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {visiblePages.map((page, index) => {
                    if (page === -1) {
                        // Ellipsis
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-500">
                                ...
                            </span>
                        );
                    }

                    if (page === currentPage) {
                        // Current page
                        return (
                            <span
                                key={page}
                                className="px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-current="page"
                            >
                                {page}
                            </span>
                        );
                    }

                    // Other pages
                    return (
                        <Link
                            key={page}
                            to={generatePageUrl(page)}
                            className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={`Go to page ${page}`}
                        >
                            {page}
                        </Link>
                    );
                    })}
                </div>

                {/* Next Button */}
                {currentPage < totalPages ? (
                    <Link
                        to={generatePageUrl(currentPage + 1)}
                        className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Next page"
                    >
                        <span className="hidden sm:inline">Next →</span>
                        <span className="sm:hidden">›</span>
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm font-medium text-slate-500 bg-slate-900 border border-slate-800 rounded-lg cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <span className="hidden sm:inline">Next →</span>
                        <span className="sm:hidden">›</span>
                    </span>
                )}
            </div>
        </nav>
    );
}
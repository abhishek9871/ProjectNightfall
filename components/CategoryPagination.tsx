import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    categorySlug: string;
}

export function CategoryPagination({ currentPage, totalPages, categorySlug }: CategoryPaginationProps): React.ReactNode {

    if (totalPages <= 1) return null;

    // Scroll to video grid section when pagination is clicked
    const scrollToVideoGrid = () => {
        // Find the video grid or main content area
        const videoGrid = document.querySelector('.professional-video-grid');
        const mainContent = document.querySelector('main');
        const targetElement = videoGrid || mainContent;

        if (targetElement) {
            // Scroll to the element with some offset for better UX
            const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offset = 100; // Offset from top for better visibility

            window.scrollTo({
                top: Math.max(0, elementTop - offset),
                behavior: 'smooth'
            });
        } else {
            // Fallback: scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const generatePageUrl = (page: number): string => {
        if (page === 1) {
            return `/category/${categorySlug}`;
        }
        return `/category/${categorySlug}?page=${page}`;
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
            <div className="flex items-center space-x-2">
                {/* Previous Button */}
                {currentPage > 1 ? (
                    <Link
                        to={generatePageUrl(currentPage - 1)}
                        onClick={scrollToVideoGrid}
                        className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                        aria-label="Previous page"
                    >
                        ← Previous
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm font-medium text-slate-500 bg-slate-900 border border-slate-800 rounded-lg cursor-not-allowed">
                        ← Previous
                    </span>
                )}

                {/* Page Numbers */}
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
                                className="px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg"
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
                            onClick={scrollToVideoGrid}
                            className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                            aria-label={`Go to page ${page}`}
                        >
                            {page}
                        </Link>
                    );
                })}

                {/* Next Button */}
                {currentPage < totalPages ? (
                    <Link
                        to={generatePageUrl(currentPage + 1)}
                        onClick={scrollToVideoGrid}
                        className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                        aria-label="Next page"
                    >
                        Next →
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm font-medium text-slate-500 bg-slate-900 border border-slate-800 rounded-lg cursor-not-allowed">
                        Next →
                    </span>
                )}
            </div>
        </nav>
    );
}
import React from 'react';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps): React.ReactNode {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Don't render pagination if there's only one page or no items
    if (totalPages <= 1) {
        return null;
    }

    const getVisiblePages = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        // Calculate the range of pages to show
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        // Add first page and dots if needed
        if (start > 1) {
            rangeWithDots.push(1);
            if (start > 2) {
                rangeWithDots.push('...');
            }
        }

        // Add the main range
        rangeWithDots.push(...range);

        // Add last page and dots if needed
        if (end < totalPages) {
            if (end < totalPages - 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    const handlePageClick = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
            // Scroll to top of video grid
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav className="flex justify-center items-center mt-8 mb-6" aria-label="Pagination Navigation">
            <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                        px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                        ${currentPage === 1
                            ? 'text-slate-500 cursor-not-allowed bg-slate-800/50'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700 bg-slate-800'
                        }
                    `}
                    aria-label="Go to previous page"
                >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">‹</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {visiblePages.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`dots-${index}`}
                                    className="px-3 py-2 text-slate-500 text-sm"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        const isActive = pageNum === currentPage;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageClick(pageNum)}
                                className={`
                                    px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700 bg-slate-800'
                                    }
                                `}
                                aria-label={`Go to page ${pageNum}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                        px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                        ${currentPage === totalPages
                            ? 'text-slate-500 cursor-not-allowed bg-slate-800/50'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700 bg-slate-800'
                        }
                    `}
                    aria-label="Go to next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">›</span>
                </button>
            </div>

            {/* Page Info */}
            <div className="hidden lg:block ml-6 text-sm text-slate-400">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} videos
            </div>
        </nav>
    );
}
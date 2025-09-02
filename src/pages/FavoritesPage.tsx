import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';

import { Footer } from '../../components/Footer';

import { VideoCard } from '../../components/VideoCard';
import { Pagination } from '../../components/Pagination';
import { videos } from '../../data/videos';
import { categories } from '../../data/categories';
import { specialtyClusters } from '../../src/data/specialtyClusters';
import { assignVideoToCluster } from '../utils/clusterAssignment';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSearch } from '../contexts/SearchContext';
import { Video } from '../../types';
import { filterVideosBySearchQuery } from '../utils/searchUtils';

type SortOption = 'recent' | 'title' | 'rating' | 'category';
type FilterOption = 'all' | string; // 'all' or specific category

export default function FavoritesPage(): React.ReactNode {
    const { 
        favorites, 
        getFavoriteData, 
        bulkRemove, 
        clearAllFavorites,
        exportFavorites,
        importFavorites
    } = useFavorites();
    const { searchQuery, setSearchQuery } = useSearch();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [importData, setImportData] = useState('');
    
    const prevSearchQueryRef = useRef(searchQuery);
    const prevPageRef = useRef(currentPageNum);
    const videosPerPage = 20;

    // Get favorite video objects
    const favoriteVideos = useMemo(() => {
        return favorites
            .map(id => videos.find(v => v.id === parseInt(id)))
            .filter((video): video is Video => video !== undefined);
    }, [favorites]);

    // Apply search filter
    const searchFilteredVideos = useMemo(() => {
        if (!searchQuery.trim()) return favoriteVideos;
        return filterVideosBySearchQuery(favoriteVideos, searchQuery, categories, specialtyClusters);
    }, [favoriteVideos, searchQuery]);

    // Apply category filter using proper cluster assignment
    const categoryFilteredVideos = useMemo(() => {
        if (filterBy === 'all') return searchFilteredVideos;
        
        // Filter using cluster assignment to match current CategoryHub structure
        return searchFilteredVideos.filter(video => {
            const clusterId = assignVideoToCluster(video);
            const currentCategoryHubStructure = [...categories, ...specialtyClusters];
            const assignedCategory = currentCategoryHubStructure.find(cat => cat.id === clusterId);
            
            return assignedCategory?.name === filterBy;
        });
    }, [searchFilteredVideos, filterBy]);

    // Apply sorting
    const sortedVideos = useMemo(() => {
        const videosToSort = [...categoryFilteredVideos];
        
        switch (sortBy) {
            case 'recent':
                return videosToSort.sort((a, b) => {
                    const aData = getFavoriteData(String(a.id));
                    const bData = getFavoriteData(String(b.id));
                    if (!aData || !bData) return 0;
                    return new Date(bData.dateAdded).getTime() - new Date(aData.dateAdded).getTime();
                });
            case 'title':
                return videosToSort.sort((a, b) => a.title.localeCompare(b.title));
            case 'rating':
                return videosToSort.sort((a, b) => b.rating - a.rating);
            case 'category':
                return videosToSort.sort((a, b) => a.category.localeCompare(b.category));
            default:
                return videosToSort;
        }
    }, [categoryFilteredVideos, sortBy, getFavoriteData]);

    // Pagination
    const totalPages = Math.ceil(sortedVideos.length / videosPerPage);
    const startIndex = (currentPageNum - 1) * videosPerPage;
    const paginatedVideos = sortedVideos.slice(startIndex, startIndex + videosPerPage);

    // Get available categories mapped to current CategoryHub structure only
    const availableCategories = useMemo(() => {
        const currentCategoryHubStructure = [...categories, ...specialtyClusters];
        const categorySet = new Set<string>();
        
        favoriteVideos.forEach(video => {
            // Use cluster assignment to get the proper current category
            const clusterId = assignVideoToCluster(video);
            const currentCategory = currentCategoryHubStructure.find(cat => cat.id === clusterId);
            
            if (currentCategory) {
                // Only add categories that exist in current CategoryHub structure
                categorySet.add(currentCategory.name);
            }
        });
        
        return Array.from(categorySet).sort();
    }, [favoriteVideos]);

    // Reset pagination when search query or filters change
    useEffect(() => {
        if (searchQuery !== prevSearchQueryRef.current) {
            setCurrentPageNum(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            prevSearchQueryRef.current = searchQuery;
        }
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPageNum(1);
        // Add scroll to top when filters change for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filterBy, sortBy]);

    // Pagination scroll behavior - scroll to top when page changes (excluding initial load)
    useEffect(() => {
        // Only scroll if there was an actual page change (not initial component mount)
        if (prevPageRef.current !== currentPageNum) {
            const timer = setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
            
            // Update the previous page reference
            prevPageRef.current = currentPageNum;
            
            return () => clearTimeout(timer);
        }
    }, [currentPageNum]);

    // Handle video selection
    const handleVideoSelect = (videoId: string, selected: boolean) => {
        const newSelected = new Set(selectedVideos);
        if (selected) {
            newSelected.add(videoId);
        } else {
            newSelected.delete(videoId);
        }
        setSelectedVideos(newSelected);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedVideos.size === paginatedVideos.length) {
            setSelectedVideos(new Set());
        } else {
            setSelectedVideos(new Set(paginatedVideos.map(v => String(v.id))));
        }
    };

    // Handle bulk operations
    const handleBulkRemove = () => {
        if (selectedVideos.size > 0) {
            bulkRemove(Array.from(selectedVideos));
            setSelectedVideos(new Set());
            setIsSelectMode(false);
        }
    };

    // Handle export
    const handleExport = () => {
        const data = exportFavorites();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favorites-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setShowExportModal(false);
    };

    // Handle import
    const handleImport = () => {
        if (importData.trim()) {
            const success = importFavorites(importData);
            if (success) {
                alert('Favorites imported successfully!');
                setImportData('');
                setShowExportModal(false);
            } else {
                alert('Error importing favorites. Please check the format.');
            }
        }
    };

    // Generate structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "My Favorite Videos | Project Nightfall",
        "description": `Browse your ${favorites?.length || 0} favorite videos. Easily manage and organize your curated adult entertainment collection.`,
        "url": "https://project-nightfall.pages.dev/favorites",
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "BookmarkAction",
            "userInteractionCount": favorites?.length || 0
        },
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": favorites?.length || 0,
            "itemListElement": paginatedVideos.map((video, index) => ({
                "@type": "VideoObject",
                "position": startIndex + index + 1,
                "name": video.title,
                "url": `https://project-nightfall.pages.dev/watch/${video.id}`
            }))
        }
    };

    if (!favorites || favorites.length === 0) {
        return (
            <div className="bg-slate-950 text-slate-300 min-h-screen">
                <Helmet>
                    <title>My Favorites - Project Nightfall</title>
                    <meta name="description" content="Your favorite videos collection. Start building your personal collection of adult entertainment." />
                    <script type="application/ld+json">
                        {JSON.stringify(structuredData)}
                    </script>
                </Helmet>
                
                <div className="flex">
                    <Sidebar
                        isMobileOpen={isMobileSidebarOpen}
                        onMobileClose={() => setIsMobileSidebarOpen(false)}
                    />
                    <main className="flex-1 lg:ml-64">
                        <Header
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        />
                        
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="max-w-4xl mx-auto text-center py-16">
                                <div className="mb-8">
                                    <svg className="w-24 h-24 mx-auto text-slate-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-4">No Favorites Yet</h1>
                                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                                    Start building your personal collection by clicking the heart icon on videos you love. 
                                    Your favorites will be saved locally and sync across all your tabs.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                        Browse Videos
                                    </a>
                                    <a href="/categories" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                        Explore Categories
                                    </a>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <Helmet>
                <title>{`My Favorites (${favorites?.length || 0}) - Project Nightfall`}</title>
                <meta name="description" content={`Browse your ${favorites?.length || 0} favorite videos. Easily manage and organize your curated adult entertainment collection.`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <div className="flex">
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
                <main className="flex-1 lg:ml-64">
                    <Header
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    />
                    
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                My Favorites ({favorites?.length || 0})
                            </h1>
                            <p className="text-slate-400">
                                Manage your curated collection of favorite videos
                            </p>
                        </div>

                        {/* Controls Bar */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-4 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                {/* Sort and Filter Controls */}
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-slate-300">Sort by:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                                            className="bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded text-sm focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="recent">Recently Added</option>
                                            <option value="title">Title A-Z</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="category">Category</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-slate-300">Filter:</label>
                                        <select
                                            value={filterBy}
                                            onChange={(e) => setFilterBy(e.target.value)}
                                            className="bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded text-sm focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="all">All Categories ({favoriteVideos?.length || 0})</option>
                                            {availableCategories.map(category => {
                                                // Use cluster assignment to count videos correctly
                                                const count = favoriteVideos.filter(video => {
                                                    const clusterId = assignVideoToCluster(video);
                                                    const currentCategoryHubStructure = [...categories, ...specialtyClusters];
                                                    const assignedCategory = currentCategoryHubStructure.find(cat => cat.id === clusterId);
                                                    return assignedCategory?.name === category;
                                                }).length;
                                                return (
                                                    <option key={category} value={category}>
                                                        {category} ({count})
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setIsSelectMode(!isSelectMode)}
                                        className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {isSelectMode ? 'Cancel' : 'Select'}
                                    </button>
                                    
                                    {isSelectMode && (
                                        <>
                                            <button
                                                onClick={handleSelectAll}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                            >
                                                {selectedVideos.size === paginatedVideos.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                            
                                            {selectedVideos.size > 0 && (
                                                <button
                                                    onClick={handleBulkRemove}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                >
                                                    Remove ({selectedVideos.size})
                                                </button>
                                            )}
                                        </>
                                    )}
                                    
                                    <button
                                        onClick={() => setShowExportModal(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Manage Data
                                    </button>
                                </div>
                            </div>

                            {/* Results Summary */}
                            <div className="mt-3 pt-3 border-t border-slate-800/50">
                                <p className="text-sm text-slate-400">
                                    Showing {sortedVideos?.length || 0} of {favorites?.length || 0} favorites
                                    {searchQuery && ` for "${searchQuery}"`}
                                    {filterBy !== 'all' && ` in ${filterBy}`}
                                </p>
                            </div>
                        </div>

                        {/* Video Grid */}
                        {sortedVideos.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                    {paginatedVideos.map((video) => (
                                        <div key={video.id} className="relative">
                                            {isSelectMode && (
                                                <div className="absolute top-2 left-2 z-20">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedVideos.has(String(video.id))}
                                                        onChange={(e) => handleVideoSelect(String(video.id), e.target.checked)}
                                                        className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500"
                                                    />
                                                </div>
                                            )}
                                            <VideoCard
                                                video={video}
                                                priority={false}
                                                compact={false}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Pagination
                                        totalItems={sortedVideos?.length || 0}
                                        itemsPerPage={videosPerPage}
                                        currentPage={currentPageNum}
                                        onPageChange={setCurrentPageNum}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <h2 className="text-xl font-semibold text-white mb-2">No videos found</h2>
                                <p className="text-slate-400">
                                    {searchQuery 
                                        ? `No favorites match your search for "${searchQuery}"`
                                        : filterBy !== 'all' 
                                            ? `No favorites in the ${filterBy} category`
                                            : 'No favorites to display'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                    <Footer />
                </main>
            </div>

            {/* Export/Import Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Manage Favorites Data</h2>
                            
                            <div className="space-y-6">
                                {/* Export Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Export Favorites</h3>
                                    <p className="text-slate-400 mb-3">Download your favorites as a JSON file for backup or sharing.</p>
                                    <button
                                        onClick={handleExport}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        Download Favorites ({favorites?.length || 0} videos)
                                    </button>
                                </div>

                                {/* Import Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Import Favorites</h3>
                                    <p className="text-slate-400 mb-3">Paste JSON data to import favorites (duplicates will be skipped).</p>
                                    <textarea
                                        value={importData}
                                        onChange={(e) => setImportData(e.target.value)}
                                        placeholder="Paste your favorites JSON data here..."
                                        className="w-full h-32 bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded resize-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={handleImport}
                                            disabled={!importData.trim()}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
                                        >
                                            Import Favorites
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="border-t border-slate-800 pt-6">
                                    <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                                    <p className="text-slate-400 mb-3">Permanently delete all favorites. This action cannot be undone.</p>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete ALL favorites? This cannot be undone.')) {
                                                clearAllFavorites();
                                                setShowExportModal(false);
                                            }
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        Clear All Favorites
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 pt-6 border-t border-slate-800">
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
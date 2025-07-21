import React, { useState } from 'react';
import { categories } from '../data/categories';
import { videos } from '../data/videos';
import { VideoCard } from './VideoCard';

interface CategoriesProps {
    searchQuery: string;
}

export function Categories({ searchQuery }: CategoriesProps): React.ReactNode {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Filter videos based on selected category and search
    const filteredVideos = videos.filter(video => {
        const matchesSearch = searchQuery.trim() === '' || 
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === null || 
            video.category.toLowerCase() === selectedCategory.toLowerCase();
        
        return matchesSearch && matchesCategory;
    });

    const getTitle = () => {
        if (searchQuery.trim()) {
            return selectedCategory 
                ? `Search Results in ${selectedCategory} for "${searchQuery}"`
                : `Search Results for "${searchQuery}"`;
        }
        return selectedCategory ? `${selectedCategory} Videos` : 'All Categories';
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">{getTitle()}</h2>
            
            {/* Category Filter Buttons */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === null
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === category.name
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {category.name} ({category.videoCount})
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Grid (when no category selected) */}
            {!selectedCategory && searchQuery.trim() === '' && (
                <div className="mb-12">
                    <h3 className="text-xl font-semibold text-white mb-4">Browse by Category</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.name)}
                                className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 text-left transition-all hover:scale-105 border border-slate-700 hover:border-purple-500"
                            >
                                <h4 className="font-semibold text-white mb-1">{category.name}</h4>
                                <p className="text-sm text-slate-400 mb-2">{category.description}</p>
                                <span className="text-xs text-purple-400">{category.videoCount} videos</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Videos Grid */}
            {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">No videos found.</p>
                    {(searchQuery || selectedCategory) && (
                        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {filteredVideos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}
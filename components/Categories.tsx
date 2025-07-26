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
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">{getTitle()}</h1>

            <div className="mb-8">
                <h2 className="text-xl text-white mb-4">Category Filters</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === null
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
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.name
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            {category.name} ({category.videoCount})
                        </button>
                    ))}
                </div>
            </div>

            {/* Show category overview when no category is selected */}
            {!selectedCategory && searchQuery.trim() === '' && (
                <div className="mb-8">
                    <h2 className="text-xl text-white mb-4">Browse Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => setSelectedCategory(category.name)}
                                className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 border border-slate-700 hover:border-purple-500"
                            >
                                <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                                <p className="text-sm text-slate-400 mb-2">{category.description}</p>
                                <span className="text-xs text-purple-400">{category.videoCount} videos</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Videos section */}
            <div>
                <h2 className="text-xl text-white mb-4">
                    {selectedCategory ? `${selectedCategory} Videos` : 'All Videos'}
                </h2>

                {filteredVideos.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400 text-lg">No videos found.</p>
                        {(searchQuery || selectedCategory) && (
                            <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                        )}
                    </div>
                ) : (
                    <div className="continuous-video-grid">
                        {filteredVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
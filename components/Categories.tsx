import React, { useState } from 'react';
import { categories } from '../data/categories';
import { videos } from '../data/videos';
import { VideoCard } from './VideoCard';

interface CategoriesProps {
    searchQuery: string;
}

export function Categories({ searchQuery }: CategoriesProps): React.ReactNode {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Simple test - just return basic content first
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Categories Page</h1>
            
            <div className="mb-8">
                <h2 className="text-xl text-white mb-4">Category Filters</h2>
                <div className="flex flex-wrap gap-3">
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

            {/* Show category overview when no category is selected */}
            {!selectedCategory && (
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
                
                <div className="continuous-video-grid">
                    {videos
                        .filter(video => !selectedCategory || video.category === selectedCategory)
                        .filter(video => !searchQuery || 
                            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                        )
                        .map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
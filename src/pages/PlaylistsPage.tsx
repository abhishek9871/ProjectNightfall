import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePlaylist } from '../contexts/PlaylistContext';
import { PlaylistCard } from '../../components/playlist/PlaylistCard';
import { PlaylistModal } from '../../components/playlist/PlaylistModal';
import { Layout } from '../../components/Layout';
import { sortPlaylists, filterPlaylistsByCategory, getPlaylistCategories, generatePlaylistStats } from '../../utils/playlistUtils';

export default function PlaylistsPage(): React.ReactNode {
  const { 
    playlists, 
    createPlaylist, 
    deletePlaylist, 
    updatePlaylist,
    duplicatePlaylist,
    getSettings,
    updateSettings,
    clearAllPlaylists
  } = usePlaylist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState(getSettings().sortPreference);
  const [displayMode, setDisplayMode] = useState(getSettings().displayMode);
  const [showStats, setShowStats] = useState(false);

  // Filter and sort playlists
  const filteredAndSortedPlaylists = useMemo(() => {
    let filtered = playlists;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(playlist =>
        playlist.name.toLowerCase().includes(query) ||
        playlist.description.toLowerCase().includes(query) ||
        playlist.category?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    filtered = filterPlaylistsByCategory(filtered, selectedCategory);

    // Apply sorting
    return sortPlaylists(filtered, sortBy);
  }, [playlists, searchQuery, selectedCategory, sortBy]);

  const categories = getPlaylistCategories(playlists);
  const stats = generatePlaylistStats(playlists);

  // Handle creating new playlist
  const handleCreatePlaylist = async (data: { name: string; description: string; category?: string }) => {
    const playlistId = createPlaylist(data.name, data.description);
    if (data.category && data.category !== 'Mixed') {
      updatePlaylist(playlistId, { category: data.category });
    }
  };

  // Handle editing playlist
  const handleEditPlaylist = async (data: { name: string; description: string; category?: string }) => {
    if (!editingPlaylist) return;
    
    updatePlaylist(editingPlaylist.id, {
      name: data.name,
      description: data.description,
      category: data.category
    });
    setEditingPlaylist(null);
  };

  // Handle duplicate playlist
  const handleDuplicatePlaylist = (playlistId: string) => {
    duplicatePlaylist(playlistId);
  };

  // Handle settings changes
  const handleSortChange = (newSort: any) => {
    setSortBy(newSort);
    updateSettings({ sortPreference: newSort });
  };

  const handleDisplayModeChange = (newMode: any) => {
    setDisplayMode(newMode);
    updateSettings({ displayMode: newMode });
  };

  // Handle clear all playlists
  const handleClearAll = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete all ${playlists.length} playlists? This action cannot be undone.`
    );
    if (confirmed) {
      clearAllPlaylists();
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>My Playlists - Project Nightfall</title>
        <meta name="description" content={`Manage your ${playlists.length} custom video playlists. Create, organize, and share your favorite adult video collections.`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://project-nightfall.pages.dev/playlists" />
      </Helmet>

      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Playlists</h1>
                <p className="text-slate-400">
                  {playlists.length === 0 
                    ? 'Create your first playlist to organize your favorite videos'
                    : `${playlists.length} playlist${playlists.length !== 1 ? 's' : ''} • ${stats.totalVideos} total videos`
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="px-4 py-2 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
                >
                  {showStats ? 'Hide Stats' : 'Show Stats'}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Playlist
                </button>
              </div>
            </div>

            {/* Stats Panel */}
            {showStats && playlists.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-6 mb-6 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.totalPlaylists}</div>
                    <div className="text-sm text-slate-400">Playlists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.totalVideos}</div>
                    <div className="text-sm text-slate-400">Total Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.averageVideosPerPlaylist}</div>
                    <div className="text-sm text-slate-400">Avg per Playlist</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.largestPlaylist.videoCount}</div>
                    <div className="text-sm text-slate-400">Largest Playlist</div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            {playlists.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search playlists..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="recent">Recently Updated</option>
                  <option value="name">Name A-Z</option>
                  <option value="videoCount">Video Count</option>
                  <option value="category">Category</option>
                </select>

                {/* Display Mode */}
                <div className="flex bg-slate-800 rounded-md border border-slate-700">
                  <button
                    onClick={() => handleDisplayModeChange('grid')}
                    className={`px-3 py-2 text-sm rounded-l-md transition-colors ${
                      displayMode === 'grid' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDisplayModeChange('list')}
                    className={`px-3 py-2 text-sm rounded-r-md transition-colors ${
                      displayMode === 'list' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {playlists.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No playlists yet</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Create your first playlist to organize your favorite videos. You can add videos to playlists from any video page.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Playlist
              </button>
            </div>
          ) : filteredAndSortedPlaylists.length === 0 ? (
            /* No Results */
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No playlists found</h3>
              <p className="text-slate-400 mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Playlists Grid/List */
            <div className={
              displayMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredAndSortedPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onEdit={setEditingPlaylist}
                  onDelete={deletePlaylist}
                  onDuplicate={handleDuplicatePlaylist}
                  compact={displayMode === 'list'}
                />
              ))}
            </div>
          )}

          {/* Bulk Actions */}
          {playlists.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-400">
                  Showing {filteredAndSortedPlaylists.length} of {playlists.length} playlists
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                >
                  Clear All Playlists
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playlist Modal */}
      <PlaylistModal
        isOpen={isModalOpen || !!editingPlaylist}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlaylist(null);
        }}
        onSave={editingPlaylist ? handleEditPlaylist : handleCreatePlaylist}
        playlist={editingPlaylist}
        existingPlaylists={playlists}
      />
    </Layout>
  );
}
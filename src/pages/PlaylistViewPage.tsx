import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePlaylist } from '../contexts/PlaylistContext';
import { Layout } from '../../components/Layout';
import { VideoCard } from '../../components/VideoCard';
import { Pagination } from '../../components/Pagination';
import { calculatePlaylistDuration } from '../../utils/playlistUtils';

const VIDEOS_PER_PAGE = 24;

export default function PlaylistViewPage(): React.ReactNode {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getPlaylistById, 
    updatePlaylist, 
    deletePlaylist, 
    removeFromPlaylist,

    exportPlaylist,
    getShareableUrl,
    duplicatePlaylist
  } = usePlaylist();

  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showActions, setShowActions] = useState(false);


  const playlist = id ? getPlaylistById(id) : null;

  useEffect(() => {
    if (!playlist && id) {
      // Playlist not found, redirect to playlists page
      navigate('/playlists');
    }
  }, [playlist, id, navigate]);

  useEffect(() => {
    if (playlist) {
      setEditName(playlist.name);
      setEditDescription(playlist.description);
    }
  }, [playlist]);

  // Pagination logic
  const totalPages = playlist ? Math.ceil(playlist.videos.length / VIDEOS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const endIndex = startIndex + VIDEOS_PER_PAGE;
  const currentVideos = playlist ? playlist.videos.slice(startIndex, endIndex) : [];

  // Playlist metadata
  const duration = playlist ? calculatePlaylistDuration(playlist.videos) : '0:00';
  const createdDate = playlist ? new Date(playlist.createdAt).toLocaleDateString() : '';
  const updatedDate = playlist ? new Date(playlist.updatedAt).toLocaleDateString() : '';

  if (!playlist) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Playlist Not Found</h1>
            <p className="text-slate-400 mb-6">The playlist you're looking for doesn't exist.</p>
            <Link 
              to="/playlists"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Back to Playlists
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle playlist editing
  const handleSaveEdit = () => {
    if (editName.trim()) {
      updatePlaylist(playlist.id, {
        name: editName.trim(),
        description: editDescription.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description);
    setIsEditing(false);
  };

  // Handle video removal
  const handleRemoveVideo = (videoId: string) => {
    const confirmed = window.confirm('Remove this video from the playlist?');
    if (confirmed) {
      removeFromPlaylist(playlist.id, videoId);
    }
  };

  // Handle playlist actions
  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`);
    if (confirmed) {
      deletePlaylist(playlist.id);
      navigate('/playlists');
    }
  };

  const handleExport = () => {
    exportPlaylist(playlist.id);
  };

  const handleShare = async () => {
    const shareUrl = getShareableUrl(playlist.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: playlist.name,
          text: `Check out my playlist: ${playlist.name}`,
          url: shareUrl
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  const handleDuplicate = () => {
    const newId = duplicatePlaylist(playlist.id);
    if (newId) {
      navigate(`/playlist/${newId}`);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{playlist.name} - Playlist | Project Nightfall</title>
        <meta name="description" content={`${playlist.description || `Watch ${playlist.videoCount} videos in this curated playlist`}. Total duration: ${duration}.`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://project-nightfall.pages.dev/playlist/${playlist.id}`} />
        
        {/* JSON-LD Schema for Playlist */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": playlist.name,
            "description": playlist.description,
            "numberOfItems": playlist.videoCount,
            "itemListElement": playlist.videos.map((video, index) => ({
              "@type": "VideoObject",
              "position": index + 1,
              "name": video.title,
              "description": video.description,
              "duration": `PT${video.duration.replace(':', 'M')}S`,
              "thumbnailUrl": video.thumbnailUrl,
              "uploadDate": video.uploadDate,
              "genre": video.category
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-4">
              <Link to="/playlists" className="hover:text-white transition-colors">Playlists</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">{playlist.name}</span>
            </nav>

            {/* Playlist Info */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                {/* Thumbnail and Basic Info */}
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className="w-full sm:w-48 aspect-video object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full text-2xl font-bold bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          maxLength={50}
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Add a description..."
                          rows={3}
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                          maxLength={200}
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{playlist.name}</h1>
                        {playlist.description && (
                          <p className="text-slate-300 mb-4 leading-relaxed">{playlist.description}</p>
                        )}
                        
                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                            </svg>
                            {playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}
                          </span>
                          {duration !== '0:00' && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {duration}
                            </span>
                          )}
                          <span>Created {createdDate}</span>
                          {updatedDate !== createdDate && (
                            <span>Updated {updatedDate}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    More
                  </button>

                  {showActions && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                      <div className="py-1">
                        <button
                          onClick={handleExport}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export Playlist
                        </button>
                        
                        <button
                          onClick={handleDuplicate}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Duplicate
                        </button>

                        <div className="border-t border-slate-700 my-1"></div>
                        
                        <button
                          onClick={handleDelete}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Playlist
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Videos */}
          {playlist.videos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No videos in this playlist</h3>
              <p className="text-slate-400 mb-6">
                Start adding videos to this playlist by clicking the playlist button on any video.
              </p>
              <Link 
                to="/"
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                Browse Videos
              </Link>
            </div>
          ) : (
            <>
              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentVideos.map((video, index) => (
                  <div key={video.id} className="relative group">
                    <VideoCard 
                      video={video}
                      priority={index < 4}
                      fetchPriority={index < 4 ? "high" : "auto"}
                    />
                    
                    {/* Remove from playlist button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveVideo(video.id.toString());
                      }}
                      className="absolute top-2 left-2 w-8 h-8 bg-red-600/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                      title="Remove from playlist"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={playlist.videos.length}
                  itemsPerPage={VIDEOS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowActions(false)}
        />
      )}
    </Layout>
  );
}
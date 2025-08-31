import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Playlist } from '../../src/contexts/PlaylistContext';
import { calculatePlaylistDuration } from '../../utils/playlistUtils';

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: (playlist: Playlist) => void;
  onDelete?: (playlistId: string) => void;
  onDuplicate?: (playlistId: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

export function PlaylistCard({ 
  playlist, 
  onEdit, 
  onDelete, 
  onDuplicate,
  compact = false,
  showActions = true 
}: PlaylistCardProps): React.ReactNode {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const duration = calculatePlaylistDuration(playlist.videos);
  const createdDate = new Date(playlist.createdAt).toLocaleDateString();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      onDelete(playlist.id);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(playlist);
    }
    setShowMenu(false);
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(playlist.id);
    }
    setShowMenu(false);
  };

  return (
    <div className={`group relative rounded-lg overflow-hidden bg-slate-900/95 border border-slate-800/50 shadow-md transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40 hover:bg-slate-900 ${compact ? 'h-auto' : 'h-full'}`}>
      {/* Playlist Link */}
      <Link 
        to={`/playlist/${playlist.id}`}
        className="block h-full"
        onClick={() => {
          // Analytics event
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'playlist_view', {
              playlist_id: playlist.id,
              playlist_name: playlist.name,
              video_count: playlist.videoCount
            });
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-slate-900/70 overflow-hidden">
            <img 
              src={playlist.thumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Video count overlay */}
            <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
              </svg>
              {playlist.videoCount}
            </div>

            {/* Category badge */}
            {playlist.category && (
              <div className="absolute top-2 left-2 bg-purple-600/95 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                {playlist.category}
              </div>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 flex flex-col flex-grow">
            <div className="flex-grow mb-2">
              <h3 className="font-semibold text-sm text-white group-hover:text-purple-400 transition-colors leading-tight line-clamp-2">
                {playlist.name}
              </h3>
              {!compact && playlist.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {playlist.description}
                </p>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex justify-between items-center text-xs text-slate-400 mt-auto">
              <div className="flex items-center space-x-3">
                <span>{playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}</span>
                {duration !== '0:00' && (
                  <span>{duration}</span>
                )}
              </div>
              {!compact && (
                <span>{createdDate}</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
              title="Playlist options"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Playlist
                    </button>
                  )}
                  
                  {onDuplicate && (
                    <button
                      onClick={handleDuplicate}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicate
                    </button>
                  )}

                  <Link
                    to={`/playlist/${playlist.id}`}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Playlist
                  </Link>

                  <div className="border-t border-slate-700 my-1"></div>
                  
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
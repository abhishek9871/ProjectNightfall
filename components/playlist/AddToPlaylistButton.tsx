import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Video } from '../../types';
import { usePlaylist } from '../../src/contexts/PlaylistContext';

interface AddToPlaylistButtonProps {
  video: Video;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'text';
  className?: string;
  showTooltip?: boolean;
}

export const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ 
  video, 
  size = 'md', 
  variant = 'icon',
  className = '',
  showTooltip = true 
}: AddToPlaylistButtonProps): React.ReactNode => {
  const { 
    playlists, 
    addToPlaylist, 
    createPlaylist, 
    isVideoInPlaylist,
    getPlaylistsContainingVideo 
  } = usePlaylist();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCreateForm(false);
        setNewPlaylistName('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Calculate and update dropdown viewport coordinates
  useEffect(() => {
    if (!isOpen) return;
    const updateCoords = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 256; // w-64
      const gap = 8; // mt-2
      const vw = window.innerWidth;
      let left = rect.right - dropdownWidth; // align to right edge of button
      // Keep within viewport with small margins
      left = Math.max(8, Math.min(left, vw - dropdownWidth - 8));
      const top = rect.bottom + gap;
      setCoords({ top, left });
    };
    // run after paint
    updateCoords();
    const onScrollOrResize = () => updateCoords();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isOpen]);


  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 text-xs';
      case 'lg':
        return 'w-10 h-10 text-base';
      default:
        return 'w-8 h-8 text-sm';
    }
  };

  // Handle adding video to existing playlist
  const handleAddToPlaylist = (playlistId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    try {
      addToPlaylist(playlistId, video);
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding video to playlist:', error);
    }
  };

  // Handle creating new playlist
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e as any).nativeEvent?.stopImmediatePropagation?.();
    if (!newPlaylistName.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const playlistId = createPlaylist(newPlaylistName.trim(), `Created for ${video.title}`);
      // Defer until context state commits the new playlist
      setTimeout(() => {
        try {
          addToPlaylist(playlistId, video);
        } catch (err) {
          console.error('Deferred addToPlaylist failed:', err);
        }
      }, 0);
       
      setNewPlaylistName('');
      setShowCreateForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Check if video is in any playlists
  const containingPlaylists = getPlaylistsContainingVideo(video.id.toString());
  const isInAnyPlaylist = containingPlaylists.length > 0;


  // Render button based on variant with improved mobile styling
  const renderButton = () => {
    const colorClasses = isInAnyPlaylist
      ? 'bg-purple-600 text-white hover:bg-purple-700'
      : 'bg-black/60 text-white hover:bg-black/80';
    const sharedBase = 'relative inline-flex items-center justify-center rounded-md transition-all duration-200';

    // Icon SVG
    const iconSvg = isInAnyPlaylist ? (
      // Checkmark icon when added
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      // Plus icon when not added
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    );

    switch (variant) {
      case 'button':
        return (
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`${sharedBase} ${colorClasses} h-8 sm:h-9 px-3 gap-2 whitespace-nowrap ${className}`}
            title={showTooltip ? (isInAnyPlaylist ? 'In playlist' : 'Add to playlist') : undefined}
          >
            {iconSvg}
            <span className="font-medium hidden sm:inline">
              {isInAnyPlaylist ? 'Added' : 'Add to Playlist'}
            </span>
            <span className="font-medium sm:hidden">
              {isInAnyPlaylist ? 'Added' : 'Add'}
            </span>
          </button>
        );

      case 'text':
        return (
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            title={showTooltip ? (isInAnyPlaylist ? 'In playlist' : 'Add to playlist') : undefined}
          >
            {isInAnyPlaylist ? 'In Playlist' : 'Add to Playlist'}
          </button>
        );

      default: // icon
        return (
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`${sharedBase} ${getSizeClasses()} ${colorClasses} ${className}`}
            title={showTooltip ? (isInAnyPlaylist ? 'In playlist' : 'Add to playlist') : undefined}
          >
            {iconSvg}
          </button>
        );
    }
  };

  return (
    <div className="relative">
      {renderButton()}

      {/* Portal-based fixed dropdown to avoid parent overflow clipping */}
      {isOpen && coords && createPortal(
        <div
          className="w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            maxHeight: '60vh',
            zIndex: 999999,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
          onMouseDown={(e) => {
            // Only stop propagation so outside-click handler doesn't fire
            e.stopPropagation();
            (e as any).nativeEvent?.stopImmediatePropagation?.();
          }}
          onClick={(e) => {
            // Prevent click bubbling to underlying card/link which may navigate
            e.stopPropagation();
            (e as any).nativeEvent?.stopImmediatePropagation?.();
          }}
        >
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white">Add to Playlist</h3>
          </div>

          <div className="max-h-[40vh] overflow-y-auto custom-scrollbar">
            {playlists.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                No playlists yet. Create your first one!
              </div>
            ) : (
              <div className="py-2">
                {playlists.map((playlist) => {
                  const isVideoInThisPlaylist = isVideoInPlaylist(playlist.id, video.id.toString());
                  
                  return (
                    <button
                      key={playlist.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        if (!isVideoInThisPlaylist) {
                          handleAddToPlaylist(playlist.id, e);
                        }
                      }}
                      disabled={isVideoInThisPlaylist}
                      className={`
                        w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between
                        ${isVideoInThisPlaylist 
                          ? 'text-slate-500 cursor-not-allowed' 
                          : 'text-white hover:bg-slate-700'
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{playlist.name}</div>
                        <div className="text-xs text-slate-400">
                          {playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      {isVideoInThisPlaylist && (
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Create New Playlist Section */}
          <div className="border-t border-slate-700">
            {!showCreateForm ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setShowCreateForm(true);
                }}
                className="w-full px-4 py-3 text-left text-sm text-purple-400 hover:bg-slate-700 hover:text-purple-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Playlist
              </button>
            ) : (
              <form onSubmit={handleCreatePlaylist} className="p-3">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                  maxLength={50}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setShowCreateForm(false);
                      setNewPlaylistName('');
                    }}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newPlaylistName.trim() || isCreating}
                    className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>, document.body
      )}
    </div>
  );
}
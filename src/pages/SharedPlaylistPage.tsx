import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePlaylist } from '../contexts/PlaylistContext';
import { Layout } from '../../components/Layout';
import { VideoCard } from '../../components/VideoCard';
import { Pagination } from '../../components/Pagination';
import { calculatePlaylistDuration } from '../../utils/playlistUtils';
import type { Playlist } from '../contexts/PlaylistContext';

const VIDEOS_PER_PAGE = 24;

// Safely attempt decodeURIComponent, return original on failure
function decodeURIComponentSafe(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

export default function SharedPlaylistPage(): React.ReactNode {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const { loadSharedPlaylist, createPlaylist, addToPlaylist, playlists } = usePlaylist();
  
  const [sharedPlaylist, setSharedPlaylist] = useState<Playlist | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Targeted fix: clear PWA SW/caches once for this tab when opening a shared link.
  // Some SW/stale cache scenarios can lead to blank renders on subsequent tabs.
  useEffect(() => {
    const hasShareCode =
      searchParams.get('s') || searchParams.get('code') || searchParams.get('c') || searchParams.get('data');
    if (!hasShareCode) return;
    if (typeof window === 'undefined' || !("serviceWorker" in navigator)) return;

    // If early pre-React SW clear already ran, skip to avoid double reload
    const preReactKey = 'sw-pre-react-cleared';
    if (sessionStorage.getItem(preReactKey)) return;

    const key = 'sw-cleared-for-shared-playlist';
    const alreadyCleared = sessionStorage.getItem(key) || sessionStorage.getItem(preReactKey);
    if (alreadyCleared) return;

    (async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        sessionStorage.setItem(key, '1');
        // Reload once to ensure a fresh network response not controlled by a SW
        window.location.replace(window.location.href);
      } catch {
        // ignore
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    // Get data from path param (e.g., /s/:data) or query param (e.g., ?s=...)
    let sourceKey: 's' | 'code' | 'c' | 'data' | null = null;
    let encodedData: string | null | undefined = params.data;

    if (encodedData) {
      sourceKey = 's'; // Treat path data as the primary 's' format
    } else {
      const sp = searchParams;
      encodedData = sp.get('s');
      if (encodedData) {
        sourceKey = 's';
      } else {
        encodedData = sp.get('code');
        if (encodedData) sourceKey = 'code';
        else {
          encodedData = sp.get('c');
          if (encodedData) sourceKey = 'c';
          else {
            encodedData = sp.get('data');
            if (encodedData) sourceKey = 'data';
          }
        }
      }
    }

    // Fragment/hash fallback (some apps move query to #)
    if (!encodedData && typeof window !== 'undefined' && window.location.hash) {
      try {
        const hash = window.location.hash.replace(/^#/, '').replace(/^\?/, '');
        const hp = new URLSearchParams(hash);
        encodedData = hp.get('s') || hp.get('code') || hp.get('c') || hp.get('data');
        if (encodedData) {
          if (hp.get('s')) sourceKey = 's';
          else if (hp.get('code')) sourceKey = 'code';
          else if (hp.get('c')) sourceKey = 'c';
          else if (hp.get('data')) sourceKey = 'data';
        }
      } catch {}
    }

    if (!encodedData) {
      setError('No playlist data found in URL');
      setIsLoading(false);
      return;
    }

    try {
      // Build decode candidates depending on source format
      const candidatesRaw: string[] = [];
      if (sourceKey === 's' || sourceKey === 'code') {
        // base64url-safe: keep original, decoded, and sanitized variants
        const stripped = encodedData.replace(/[^A-Za-z0-9_-]/g, '');
        candidatesRaw.push(
          encodedData,
          decodeURIComponentSafe(encodedData),
          stripped,
          decodeURIComponentSafe(stripped)
        );
      } else {
        // legacy (lz-string or canonical base64) – do NOT strip characters
        candidatesRaw.push(
          encodedData,
          decodeURIComponentSafe(encodedData)
        );
      }

      // Deduplicate, keep truthy
      const seen = new Set<string>();
      const candidates = candidatesRaw.filter((c) => c && !seen.has(c) && (seen.add(c), true));

      let playlist = null as ReturnType<typeof loadSharedPlaylist>;
      for (const candidate of candidates) {
        playlist = loadSharedPlaylist(candidate);
        if (playlist) break;
      }
      if (playlist) {
        setSharedPlaylist(playlist);
        
        // Analytics event for shared playlist view
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'shared_playlist_view', {
            playlist_id: playlist.id,
            playlist_name: playlist.name,
            video_count: playlist.videoCount
          });
        }
      } else {
        setError('Invalid or corrupted playlist data');
      }
    } catch (err) {
      console.error('Error loading shared playlist:', err);
      setError('Failed to load shared playlist');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, params, loadSharedPlaylist]);

  // Pagination logic
  const totalPages = sharedPlaylist ? Math.ceil(sharedPlaylist.videos.length / VIDEOS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const endIndex = startIndex + VIDEOS_PER_PAGE;
  const currentVideos = sharedPlaylist ? sharedPlaylist.videos.slice(startIndex, endIndex) : [];

  // Playlist metadata
  const duration = sharedPlaylist ? calculatePlaylistDuration(sharedPlaylist.videos) : '0:00';
  const createdDate = sharedPlaylist ? new Date(sharedPlaylist.createdAt).toLocaleDateString() : '';

  // Check if playlist already exists in user's collection
  const existingPlaylist = sharedPlaylist ? playlists.find(p => 
    p.name === sharedPlaylist.name && p.videoCount === sharedPlaylist.videoCount
  ) : null;

  // Handle saving playlist to user's collection
  const handleSavePlaylist = async () => {
    if (!sharedPlaylist || isSaving) return;

    setIsSaving(true);
    try {
      // Create new playlist with a unique name if needed
      let playlistName = sharedPlaylist.name;
      const existingNames = playlists.map(p => p.name.toLowerCase());
      let counter = 1;
      
      while (existingNames.includes(playlistName.toLowerCase())) {
        playlistName = `${sharedPlaylist.name} (${counter})`;
        counter++;
      }

      const newPlaylistId = createPlaylist(
        playlistName,
        sharedPlaylist.description + (sharedPlaylist.description ? ' ' : '') + '(Shared playlist)'
      );

      // Add all videos to the new playlist
      for (const video of sharedPlaylist.videos) {
        addToPlaylist(newPlaylistId, video);
      }

      // Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'shared_playlist_save', {
          original_playlist_id: sharedPlaylist.id,
          new_playlist_id: newPlaylistId,
          video_count: sharedPlaylist.videoCount
        });
      }

      // Navigate to the new playlist
      navigate(`/playlist/${newPlaylistId}`);
    } catch (error) {
      console.error('Error saving playlist:', error);
      alert('Failed to save playlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading shared playlist...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !sharedPlaylist) {
    return (
      <Layout>
        <Helmet>
          <title>Shared Playlist - Error | Project Nightfall</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-2xl font-bold text-white mb-2">Unable to Load Playlist</h1>
            <p className="text-slate-400 mb-6">{error || 'The shared playlist link appears to be invalid or corrupted.'}</p>
            <div className="space-y-3">
              <Link 
                to="/playlists"
                className="block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                View My Playlists
              </Link>
              <Link 
                to="/"
                className="block px-6 py-3 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
              >
                Browse Videos
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{sharedPlaylist.name} - Shared Playlist | Project Nightfall</title>
        <meta name="description" content={`${sharedPlaylist.description || `Watch ${sharedPlaylist.videoCount} videos in this shared playlist`}. Total duration: ${duration}.`} />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* JSON-LD Schema for Shared Playlist */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": sharedPlaylist.name,
            "description": sharedPlaylist.description,
            "numberOfItems": sharedPlaylist.videoCount,
            "itemListElement": sharedPlaylist.videos.map((video, index) => ({
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
            {/* Shared Playlist Banner */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-purple-400 font-medium">Shared Playlist</span>
              </div>
              <p className="text-white text-sm">
                Someone shared this playlist with you. You can view all videos and save it to your collection.
              </p>
            </div>

            {/* Playlist Info */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                {/* Thumbnail and Basic Info */}
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={sharedPlaylist.thumbnail}
                      alt={sharedPlaylist.name}
                      className="w-full sm:w-48 aspect-video object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{sharedPlaylist.name}</h1>
                    {sharedPlaylist.description && (
                      <p className="text-slate-300 mb-4 leading-relaxed">{sharedPlaylist.description}</p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                        </svg>
                        {sharedPlaylist.videoCount} video{sharedPlaylist.videoCount !== 1 ? 's' : ''}
                      </span>
                      {duration !== '0:00' && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {duration}
                        </span>
                      )}
                      {sharedPlaylist.category && (
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-md text-xs">
                          {sharedPlaylist.category}
                        </span>
                      )}
                      <span>Created {createdDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {existingPlaylist ? (
                  <Link
                    to={`/playlist/${existingPlaylist.id}`}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Already Saved
                  </Link>
                ) : (
                  <button
                    onClick={handleSavePlaylist}
                    disabled={isSaving}
                    className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Save to My Playlists
                      </>
                    )}
                  </button>
                )}
                
                <Link
                  to="/playlists"
                  className="px-4 py-3 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  My Playlists
                </Link>
              </div>
            </div>
          </div>

          {/* Videos */}
          {sharedPlaylist.videos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">Empty Playlist</h3>
              <p className="text-slate-400 mb-6">
                This shared playlist doesn't contain any videos yet.
              </p>
            </div>
          ) : (
            <>
              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentVideos.map((video, index) => (
                  <VideoCard 
                    key={video.id}
                    video={video}
                    priority={index < 4}
                    fetchPriority={index < 4 ? "high" : "auto"}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={sharedPlaylist.videos.length}
                  itemsPerPage={VIDEOS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
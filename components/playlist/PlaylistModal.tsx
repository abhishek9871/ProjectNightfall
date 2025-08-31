import React, { useState, useEffect } from 'react';
import { Playlist } from '../../src/contexts/PlaylistContext';
import { getPlaylistCategories } from '../../utils/playlistUtils';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; category?: string }) => void;
  playlist?: Playlist | null; // For editing existing playlist
  existingPlaylists?: Playlist[];
}

export function PlaylistModal({ 
  isOpen, 
  onClose, 
  onSave, 
  playlist = null,
  existingPlaylists = []
}: PlaylistModalProps): React.ReactNode {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!playlist;
  const availableCategories = getPlaylistCategories(existingPlaylists);
  const commonCategories = ['Mixed', 'Favorites', 'Watch Later', 'MILF', 'Teen', 'Amateur', 'Lesbian', 'Anal'];

  // Reset form when modal opens/closes or playlist changes
  useEffect(() => {
    if (isOpen) {
      if (playlist) {
        setName(playlist.name);
        setDescription(playlist.description);
        setCategory(playlist.category || '');
      } else {
        setName('');
        setDescription('');
        setCategory('Mixed');
      }
      setErrors({});
    }
  }, [isOpen, playlist]);

  // Validate form
  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Playlist name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Playlist name must be at least 2 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Playlist name must be less than 50 characters';
    } else if (!isEditing) {
      // Check for duplicate names when creating new playlist
      const isDuplicate = existingPlaylists.some(p => 
        p.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      if (isDuplicate) {
        newErrors.name = 'A playlist with this name already exists';
      }
    }

    if (description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        category: category || 'Mixed'
      });
      onClose();
    } catch (error) {
      console.error('Error saving playlist:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-slate-800 rounded-lg shadow-xl border border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit Playlist' : 'Create New Playlist'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="playlist-name" className="block text-sm font-medium text-white mb-2">
                Playlist Name *
              </label>
              <input
                id="playlist-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter playlist name..."
                className={`w-full px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-slate-600'
                }`}
                maxLength={50}
                autoFocus
                disabled={isSaving}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {name.length}/50 characters
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="playlist-description" className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                id="playlist-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for your playlist..."
                rows={3}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-slate-600'
                }`}
                maxLength={200}
                disabled={isSaving}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {description.length}/200 characters
              </p>
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="playlist-category" className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <select
                id="playlist-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                disabled={isSaving}
              >
                {commonCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                {availableCategories
                  .filter(cat => !commonCategories.includes(cat))
                  .map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                }
              </select>
              <p className="mt-1 text-xs text-slate-400">
                Category will be auto-detected based on videos added
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !name.trim()}
                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEditing ? 'Update Playlist' : 'Create Playlist'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
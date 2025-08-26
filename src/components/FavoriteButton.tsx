import React, { useState, useCallback } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { Video } from '../../types';

interface FavoriteButtonProps {
  videoId: string;
  video?: Video;
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'absolute' | 'fab';
  showTooltip?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  videoId,
  video,
  size = 'md',
  position = 'absolute',
  showTooltip = true,
  className = '',
  disabled = false
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const favorited = isFavorite(videoId);

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'w-8 h-8 min-w-[32px] min-h-[32px]',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    md: {
      button: 'w-10 h-10 min-w-[40px] min-h-[40px]',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      button: 'w-12 h-12 min-w-[44px] min-h-[44px]', // 44px minimum for touch targets
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  // Position configurations
  const positionConfig = {
    inline: '',
    absolute: 'absolute top-2 right-2 z-10',
    fab: 'fixed bottom-20 right-4 z-50 shadow-lg'
  };

  const config = sizeConfig[size];

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isAnimating) return;

    setIsAnimating(true);

    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    try {
      if (favorited) {
        removeFavorite(videoId);
      } else {
        addFavorite(videoId, video);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }

    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 300);
  }, [videoId, video, favorited, addFavorite, removeFavorite, disabled, isAnimating]);

  const heartIcon = (
    <svg
      className={`${config.icon} transition-all duration-200 ${
        favorited 
          ? 'text-red-500 fill-current' 
          : 'text-white/80 hover:text-red-400'
      } ${isAnimating ? 'scale-125' : 'scale-100'}`}
      viewBox="0 0 24 24"
      fill={favorited ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const successIcon = (
    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
      showSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
    }`}>
      <svg className={`${config.icon} text-green-400 fill-current`} viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );

  const tooltipText = favorited ? 'Remove from favorites' : 'Add to favorites';

  return (
    <div className={`${position !== 'inline' ? positionConfig[position] : ''} group`}>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${config.button}
          relative
          flex items-center justify-center
          rounded-full
          bg-black/60 hover:bg-black/80
          backdrop-blur-sm
          border border-white/20
          transition-all duration-200
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-purple-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          touch-manipulation
          ${position === 'fab' ? 'shadow-lg hover:shadow-xl' : ''}
          ${className}
        `}
        aria-label={tooltipText}
        title={showTooltip ? tooltipText : undefined}
      >
        {/* Heart icon */}
        <div className={`transition-all duration-200 ${showSuccess ? 'opacity-0' : 'opacity-100'}`}>
          {heartIcon}
        </div>

        {/* Success checkmark */}
        {successIcon}

        {/* Ripple effect */}
        <div className={`
          absolute inset-0 rounded-full
          bg-red-500/30
          transition-all duration-300
          ${isAnimating ? 'scale-150 opacity-0' : 'scale-100 opacity-0'}
        `} />

        {/* FAB specific styling */}
        {position === 'fab' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-75" />
        )}
      </button>

      {/* Enhanced tooltip for better UX */}
      {showTooltip && position !== 'fab' && (
        <div className={`
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
          px-2 py-1 text-xs text-white bg-black/90 rounded
          opacity-0 group-hover:opacity-100
          transition-all duration-200
          pointer-events-none
          whitespace-nowrap
          z-20
        `}>
          {tooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90" />
        </div>
      )}

      {/* Success message for FAB */}
      {position === 'fab' && showSuccess && (
        <div className="absolute bottom-full right-0 mb-4 px-3 py-2 bg-green-500 text-white text-sm rounded-lg shadow-lg animate-pulse">
          Added to favorites!
        </div>
      )}
    </div>
  );
};

// Memoized version for performance
export default React.memo(FavoriteButton);
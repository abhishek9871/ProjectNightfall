import React, { useState } from 'react';
import { Video } from '../types';

interface ShareButtonProps {
  video: Video;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'floating';
  className?: string;
  showTooltip?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  video,
  size = 'md',
  variant = 'icon',
  className = '',
  showTooltip = true
}) => {
  const [showTooltipState, setShowTooltipState] = useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality will be implemented in the modal
    const event = new CustomEvent('openShareModal', { detail: { video } });
    window.dispatchEvent(event);
  };
  
  const handleMouseEnter = () => {
    if (showTooltip) {
      setShowTooltipState(true);
    }
  };
  
  const handleMouseLeave = () => {
    setShowTooltipState(false);
  };
  
  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg transition-colors ${className}`}
      >
        <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        <span className="text-sm">Share</span>
      </button>
    );
  }
  
  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all ${sizeClasses[size]} flex items-center justify-center z-50 ${className}`}
      >
        <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
    );
  }
  
  // Default icon variant
  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        onClick={handleClick}
        className={`bg-slate-800/70 hover:bg-slate-700 text-white rounded-full transition-colors ${sizeClasses[size]} flex items-center justify-center ${className}`}
      >
        <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      {showTooltipState && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          Share this video
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
};
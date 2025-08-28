import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Video } from '../types';
import { ShareModal } from './ShareModal';

interface ShareContextType {
  openShareModal: (video: Video) => void;
}

export const ShareContext = createContext<ShareContextType | undefined>(undefined);

interface ShareProviderProps {
  children: ReactNode;
}

export const ShareProvider: React.FC<ShareProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  
  // Handle custom event for opening share modal
  useEffect(() => {
    const handleOpenShareModal = (event: CustomEvent) => {
      const video = event.detail.video;
      if (video) {
        setCurrentVideo(video);
        setIsModalOpen(true);
      }
    };
    
    window.addEventListener('openShareModal', handleOpenShareModal as EventListener);
    
    return () => {
      window.removeEventListener('openShareModal', handleOpenShareModal as EventListener);
    };
  }, []);
  
  const openShareModal = (video: Video) => {
    setCurrentVideo(video);
    setIsModalOpen(true);
  };
  
  const closeShareModal = () => {
    setIsModalOpen(false);
    setCurrentVideo(null);
  };
  
  return (
    <ShareContext.Provider value={{ openShareModal }}>
      {children}
      {currentVideo && (
        <ShareModal 
          isOpen={isModalOpen} 
          onClose={closeShareModal} 
          video={currentVideo} 
        />
      )}
    </ShareContext.Provider>
  );
};
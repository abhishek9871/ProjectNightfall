import { useEffect, useRef } from 'react';

/**
 * A React hook that triggers a callback function on user exit intent.
 * @param {() => void} onExitIntent - The callback function to execute.
 */
export const useExitIntent = (onExitIntent: () => void) => {
  const triggeredThisSession = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY < 15 && !triggeredThisSession.current) {
        triggeredThisSession.current = true;
        onExitIntent();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [onExitIntent]);
};
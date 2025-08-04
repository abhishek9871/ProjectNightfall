import { useEffect, useRef, useCallback } from 'react';
import videojs from 'video.js';
// CRITICAL: This 'ads' plugin must be imported BEFORE the IMA plugin to extend the player prototype correctly.
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'video.js/dist/video-js.css';
import 'videojs-ima/src/css/videojs.ima.css';

// Extend the Video.js Player interface to include the plugin methods for TypeScript safety.
interface ExtendedPlayer extends ReturnType<typeof videojs> {
    ads(): void;
    ima(options: { id: string; adTagUrl: string }): void;
}

interface PreRollModalProps {
    vastTagUrl: string;
    onAdComplete: () => void;
}

export function PreRollModal({ vastTagUrl, onAdComplete }: PreRollModalProps) {
    const videoNodeRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<ExtendedPlayer | null>(null);

    const handleAdEnd = useCallback(() => {
        // Add a small delay to prevent race condition with ModalPlayer initialization
        setTimeout(() => {
            onAdComplete();
        }, 500); // 500ms delay to allow ModalPlayer to initialize properly
    }, [onAdComplete]);

    useEffect(() => {
        const videoNode = videoNodeRef.current;
        if (!videoNode || playerRef.current) {
            return; // Exit if the node doesn't exist or player is already initialized
        }

        // --- BOMB-PROOFING MECHANISM ---
        // This fail-safe timer is our guarantee. If no ad event (success or error)
        // fires within 8 seconds, we assume a catastrophic failure and rescue the user.
        const failSafeTimer = setTimeout(() => {
            console.log('PreRollModal Fail-Safe: Ad timed out after 8 seconds. Proceeding to content.');
            handleAdEnd();
        }, 8000); // 8-second timeout (reduced for better UX)

        const videoElement = document.createElement('video');
        videoElement.className = 'video-js vjs-fluid';
        videoNode.appendChild(videoElement);

        const player = videojs(videoElement, {
            autoplay: true,
            controls: true,
        }) as ExtendedPlayer;

        playerRef.current = player;

        // Wait for player to be ready before initializing plugins
        player.ready(() => {
            try {
                // Initialize the ads plugin first
                if (typeof player.ads === 'function') {
                    player.ads();
                }

                // Initialize the IMA plugin
                if (typeof player.ima === 'function') {
                    player.ima({
                        id: 'ima-plugin',
                        adTagUrl: vastTagUrl
                    });
                }

                // Attach listeners for all completion scenarios
                player.on('adserror', handleAdEnd);
                player.on('adend', handleAdEnd);
                player.on('ads-ad-started', () => {
                    console.log('Pre-roll ad started successfully');
                });

            } catch (pluginError) {
                console.log('Plugin initialization failed, skipping ad:', pluginError);
                clearTimeout(failSafeTimer);
                handleAdEnd();
            }
        });

        return () => {
            clearTimeout(failSafeTimer); // Clean up the timer on unmount.
            const p = playerRef.current;
            if (p && !p.isDisposed()) {
                p.dispose();
                playerRef.current = null;
            }
        };
    }, [vastTagUrl, handleAdEnd]);

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[1000]">
            <div className="w-full max-w-4xl p-2 aspect-video">
                <div ref={videoNodeRef} data-vjs-player></div>
                <div className="text-center mt-4">
                    <p className="text-slate-400 text-sm font-mono animate-pulse">Advertisement Loading...</p>
                    <p className="text-slate-600 text-xs mt-2">Please wait while we prepare your content</p>
                </div>
            </div>
        </div>
    );
}
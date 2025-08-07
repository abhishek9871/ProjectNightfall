import React from 'react';

interface NativeAdCardProps {
  widgetZoneId: string;
  widgetFormat: string; // e.g., '1x1'
}

export function NativeAdCard({ widgetZoneId, widgetFormat }: NativeAdCardProps): React.ReactNode {
  // The component renders a div that will be targeted by the ExoClick widget script.
  // The script finds divs with these specific data attributes and injects the ad content.
  return (
    <div
      className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/30 transform hover:-translate-y-1 cursor-pointer w-full"
      data-widget-id={widgetZoneId}
      data-widget-format={widgetFormat}
    >
      {/* This inner div is a placeholder that maintains aspect ratio, preventing layout shift */}
      <div className="relative aspect-video w-full bg-slate-900/70 overflow-hidden">
        {/* Sponsored label for compliance */}
        <div className="absolute top-2 left-2 bg-cyan-600/90 text-white text-xs px-2 py-1 rounded">
          Sponsored
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mb-2 mx-auto">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-slate-400 text-sm">Loading Ad...</span>
          </div>
        </div>
      </div>
      {/* Content area to match video card structure */}
      <div className="p-4">
        <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors mb-2 leading-tight min-h-[2.5rem] line-clamp-2">
          Advertisement
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">Sponsored Content</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-slate-400">
          <span>Ad Network</span>
          <span className="text-cyan-400">Click to view</span>
        </div>
      </div>
    </div>
  );
}
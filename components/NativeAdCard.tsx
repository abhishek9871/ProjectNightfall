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
      className="group rounded-xl overflow-hidden bg-slate-800/50 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-cyan-500/30"
      data-widget-id={widgetZoneId}
      data-widget-format={widgetFormat}
    >
      {/* This inner div is a placeholder that maintains aspect ratio, preventing layout shift */}
      <div className="relative aspect-video w-full">
        <div className="flex h-full w-full items-center justify-center bg-slate-900">
          <span className="text-slate-500 text-sm">Loading Ad...</span>
        </div>
      </div>
    </div>
  );
}
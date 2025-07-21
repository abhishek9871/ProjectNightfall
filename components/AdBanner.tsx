import React from 'react';

interface DisplaySlotProps {
    slotId: string;
}

export function DisplaySlot({ slotId }: DisplaySlotProps): React.ReactNode {
    return (
        <div id={slotId} className="bg-slate-800 border border-dashed border-slate-600 rounded-lg flex items-center justify-center min-h-[90px] w-full max-w-[728px] mx-auto">
            <div className="text-center text-slate-500">
                <p className="font-semibold">Display Placeholder</p>
                <p className="text-sm">Slot ID: {slotId}</p>
                <p className="text-xs mt-1">Replace this with ad network script/code.</p>
            </div>
        </div>
    );
}
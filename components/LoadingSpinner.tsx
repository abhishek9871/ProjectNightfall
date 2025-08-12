import React from 'react';

export default function LoadingSpinner(): React.ReactNode {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm">Loading...</p>
            </div>
        </div>
    );
}
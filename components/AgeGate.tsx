import React from 'react';

interface AgeGateProps {
    onVerified: () => void;
}

export function AgeGate({ onVerified }: AgeGateProps): React.ReactNode {

    const handleExit = () => {
        window.location.href = 'https://www.google.com';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
            <div 
                role="dialog"
                aria-modal="true"
                aria-labelledby="age-gate-title"
                aria-describedby="age-gate-description"
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-500/10 p-8 m-4 max-w-md w-full text-center transform transition-all duration-300 scale-100"
            >
                <h1 id="age-gate-title" className="text-3xl font-black text-white mb-2 tracking-tight">
                    Age Verification
                </h1>
                <p id="age-gate-description" className="text-slate-400 mb-6">
                    This website contains age-restricted materials including nudity and explicit depictions of sexual activity. By entering, you affirm that you are 18 years of age or older.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={onVerified}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
                    >
                        I am 18 or older - Enter
                    </button>
                    <button
                        onClick={handleExit}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-lg transition"
                    >
                        Exit
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-6">
                    By entering this website, you are agreeing to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
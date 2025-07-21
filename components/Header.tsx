import React from 'react';
import { SearchIcon } from './icons/NavIcons';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onMobileMenuToggle: () => void;
}

export function Header({ searchQuery, onSearchChange, onMobileMenuToggle }: HeaderProps): React.ReactNode {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 shadow-md">
            {/* Mobile Nav Trigger */}
            <button 
                onClick={onMobileMenuToggle}
                className="px-4 border-r border-slate-800 text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden transition-colors"
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
                <div className="flex-1 flex">
                    <form className="w-full flex md:ml-0" onSubmit={handleSubmit} role="search">
                        <label htmlFor="search-field" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full text-slate-400 focus-within:text-slate-200">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5" />
                            </div>
                            <input
                                id="search-field"
                                className="block w-full h-full pl-8 pr-3 py-2 border-transparent bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                placeholder="Search for videos, categories..."
                                type="search"
                                name="search"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </header>
    );
}
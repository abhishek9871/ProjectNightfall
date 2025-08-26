import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { affiliateBanners } from '../data/affiliates';
import { categories } from '../data/categories';
import { HomeIcon, FireIcon, VideoCameraIcon, StarIcon, HeartIcon } from './icons/NavIcons';
import { PageType } from '../App';
import { useFavorites } from '../src/contexts/FavoritesContext';

interface SidebarProps {
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

const navigation = [
    { name: 'Home', icon: HomeIcon, page: 'home' as PageType, path: '/' },
    { name: 'Trending', icon: FireIcon, page: 'trending' as PageType, path: '/?page=trending' },
    { name: 'Categories', icon: VideoCameraIcon, page: 'categories' as PageType, path: '/categories' },
    { name: 'Top Rated', icon: StarIcon, page: 'top-rated' as PageType, path: '/top-rated' },
    { name: 'Favorites', icon: HeartIcon, page: 'favorites' as PageType, path: '/favorites' },
];

export function Sidebar({ currentPage, onPageChange, isMobileOpen, onMobileClose }: SidebarProps): React.ReactNode {
    const location = useLocation();
    const { favoritesCount } = useFavorites();
    
    const handleNavClick = (page: PageType) => {
        onPageChange(page);
        onMobileClose(); // Close mobile sidebar after navigation
    };

    const isActive = (item: typeof navigation[0]) => {
        if (item.page === 'top-rated') {
            return location.pathname === '/top-rated';
        }
        if (item.page === 'favorites') {
            return location.pathname === '/favorites';
        }
        if (item.page === 'categories') {
            return location.pathname === '/categories';
        }
        return currentPage === item.page;
    };

    // Helper function to check if a category is active
    const isCategoryActive = (categorySlug: string) => {
        return location.pathname === `/category/${categorySlug}`;
    };

    return (
        <>
            {/* Mobile sidebar overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={onMobileClose}
                >
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-800 lg:bg-slate-900">
                <div className="flex items-center h-16 flex-shrink-0 px-6 bg-slate-950 border-b border-slate-800">
                    <h1 className="text-2xl font-black text-white tracking-tighter">Project<span className="text-purple-500">Nightfall</span></h1>
                </div>
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                    <nav className="flex-1 p-4" role="navigation" aria-label="Main Navigation">
                        {navigation.map((item) => 
                            item.name === 'Categories' ? (
                                <a
                                    key={item.name}
                                    href="/categories"
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                </a>
                            ) : item.name === 'Top Rated' ? (
                                <Link
                                    key={item.name}
                                    to="/top-rated"
                                    onClick={onMobileClose}
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                </Link>
                            ) : item.name === 'Favorites' ? (
                                <Link
                                    key={item.name}
                                    to="/favorites"
                                    onClick={onMobileClose}
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                    {favoritesCount > 0 && (
                                        <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                            {favoritesCount}
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavClick(item.page)}
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                </button>
                            )
                        )}
                        
                        {/* Categories Section */}
                        <div className="mt-6">
                            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Categories
                            </h3>
                            {categories.map((category) => (
                                <a
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className={`${
                                        isCategoryActive(category.slug) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all mb-1 w-full text-left`}
                                    onClick={onMobileClose}
                                >
                                    <span className="mr-3 flex-shrink-0 h-2 w-2 bg-purple-500 rounded-full"></span>
                                    {category.name}
                                    <span className="ml-auto text-xs text-slate-500">
                                        {category.videoCount}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </nav>
                    <div className="p-4 space-y-4">
                        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Promotions
                        </h3>
                        {affiliateBanners.map((banner) => (
                             <a 
                                href={banner.link} 
                                key={banner.id} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                                onClick={() => {
                                    // GA4 event tracking for affiliate clicks
                                    if (typeof window !== 'undefined' && (window as any).gtag) {
                                        (window as any).gtag('event', 'affiliate_click', {
                                            affiliate_id: banner.id,
                                            affiliate_name: banner.alt,
                                            network: 'sidebar_banner'
                                        });
                                    }
                                }}
                             >
                                 <img src={banner.imageUrl} alt={banner.alt} className="w-full h-auto" />
                             </a>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar */}
            <aside className={`${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden`}>
                <div className="flex items-center justify-between h-16 flex-shrink-0 px-6 bg-slate-950 border-b border-slate-800">
                    <h1 className="text-2xl font-black text-white tracking-tighter">Project<span className="text-purple-500">Nightfall</span></h1>
                    <button
                        onClick={onMobileClose}
                        className="text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md p-1"
                    >
                        <span className="sr-only">Close sidebar</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                    <nav className="flex-1 p-4" role="navigation" aria-label="Main Navigation">
                        {navigation.map((item) => 
                            item.name === 'Categories' ? (
                                <a
                                    key={item.name}
                                    href="/categories"
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                    onClick={onMobileClose}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                </a>
                            ) : item.name === 'Top Rated' ? (
                                <Link
                                    key={item.name}
                                    to="/top-rated"
                                    onClick={onMobileClose}
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                </Link>
                            ) : item.name === 'Favorites' ? (
                                <Link
                                    key={item.name}
                                    to="/favorites"
                                    onClick={onMobileClose}
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                    {favoritesCount > 0 && (
                                        <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                            {favoritesCount}
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavClick(item.page)}
                                    className={`${
                                        isActive(item) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all mb-2 w-full text-left`}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                    {item.name}
                                </button>
                            )
                        )}
                        
                        {/* Categories Section */}
                        <div className="mt-6">
                            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Categories
                            </h3>
                            {categories.map((category) => (
                                <a
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className={`${
                                        isCategoryActive(category.slug) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all mb-1 w-full text-left`}
                                    onClick={onMobileClose}
                                >
                                    <span className="mr-3 flex-shrink-0 h-2 w-2 bg-purple-500 rounded-full"></span>
                                    {category.name}
                                    <span className="ml-auto text-xs text-slate-500">
                                        {category.videoCount}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </nav>
                    <div className="p-4 space-y-4">
                        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Promotions
                        </h3>
                        {affiliateBanners.map((banner) => (
                             <a 
                                href={banner.link} 
                                key={banner.id} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                                onClick={() => {
                                    // GA4 event tracking for affiliate clicks
                                    if (typeof window !== 'undefined' && (window as any).gtag) {
                                        (window as any).gtag('event', 'affiliate_click', {
                                            affiliate_id: banner.id,
                                            affiliate_name: banner.alt,
                                            network: 'sidebar_banner'
                                        });
                                    }
                                }}
                             >
                                 <img src={banner.imageUrl} alt={banner.alt} className="w-full h-auto" />
                             </a>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
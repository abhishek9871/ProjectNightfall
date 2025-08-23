import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string, context?: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQueryState] = useState('');

  // Initialize search query from URL
  useEffect(() => {
    const queryFromUrl = searchParams.get('search') || '';
    setSearchQueryState(queryFromUrl);
  }, [searchParams]);

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  };

  const performSearch = (query: string, context?: string) => {
    if (!query.trim()) return;
    
    // For context-specific searches, stay on the current page
    // For global searches, navigate to home with search
    if (!context) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      setSearchQuery(query);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      performSearch,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
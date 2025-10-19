import React, { useState } from 'react';
import { LocationMarkerIcon, SearchIcon } from './Icons';

interface SearchBarProps {
  onSearch: (location: string) => void;
  onGeolocate: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGeolocate, isLoading }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearchClick} className="w-full">
      <div className="relative flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., '123 Main St, Anytown, USA' or 'Downtown'"
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-blue focus:outline-none transition duration-200"
            disabled={isLoading}
            />
        </div>
        <div className="flex w-full sm:w-auto shrink-0 gap-2">
             <button
                type="button"
                onClick={onGeolocate}
                className="w-1/3 sm:w-auto p-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition duration-200 flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-label="Use my current location"
            >
                <LocationMarkerIcon />
            </button>
            <button
                type="submit"
                className="w-2/3 sm:w-auto px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isLoading || !query}
            >
                {isLoading ? 'Searching...' : 'Find'}
            </button>
        </div>
      </div>
    </form>
  );
};
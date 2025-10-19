import React, { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
// FIX: Corrected imports. Spinner is a separate component, not an icon, and GeolocationCoordinates is a global type that does not need to be imported.
import { LocationMarkerIcon, SearchIcon } from './Icons';
import { Spinner } from './Spinner';

interface SearchBarProps {
  onSearch: (query: string | GeolocationPosition['coords']) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const { isLocating, locateError, getUserLocation } = useGeolocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleGeolocate = () => {
    getUserLocation((position) => {
      onSearch(position.coords);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter an address or landmark..."
          // FIX: Updated styles for better visibility
          className="w-full pl-5 pr-32 py-4 text-lg text-white placeholder-slate-300 bg-slate-800/50 backdrop-blur-sm border border-slate-500/50 rounded-full focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
          disabled={isLoading || isLocating}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
           <button
            type="button"
            onClick={handleGeolocate}
            disabled={isLoading || isLocating}
            className="p-2 text-slate-300 hover:text-white transition rounded-full hover:bg-slate-700/50"
            aria-label="Use my current location"
           >
            {isLocating ? <Spinner small /> : <LocationMarkerIcon className="w-6 h-6" />}
          </button>
          <button
            type="submit"
            disabled={isLoading || isLocating}
            className="ml-2 bg-brand-accent text-brand-dark font-bold h-12 px-6 rounded-full flex items-center gap-2 hover:brightness-110 transition disabled:opacity-50"
          >
            <SearchIcon className="w-5 h-5" />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </form>
      {locateError && <p className="text-red-400 text-center mt-2">{locateError}</p>}
    </div>
  );
};
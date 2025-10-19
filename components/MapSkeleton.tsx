import React from 'react';

const MapSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-300 overflow-hidden relative animate-pulse">
      {/* Fake streets */}
      <div className="absolute top-1/4 left-0 w-full h-2 bg-slate-400/50"></div>
      <div className="absolute top-1/2 left-0 w-full h-3 bg-slate-400/50 transform -translate-y-4"></div>
      <div className="absolute top-3/4 left-0 w-full h-2 bg-slate-400/50"></div>
      <div className="absolute top-0 left-1/4 w-2 h-full bg-slate-400/50"></div>
      <div className="absolute top-0 left-2/3 w-3 h-full bg-slate-400/50"></div>

      {/* Fake UI element */}
      <div className="absolute top-4 right-4 w-10 h-20 bg-slate-200 rounded-lg"></div>

      {/* Loading text */}
      <div className="absolute inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm">
        <p className="text-slate-600 font-semibold">Loading Map...</p>
      </div>
    </div>
  );
};

export default MapSkeleton;
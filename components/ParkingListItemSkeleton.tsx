import React from 'react';

export const ParkingListItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="mt-4">
        <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
      </div>
    </div>
  );
};
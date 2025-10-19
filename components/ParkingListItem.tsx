import React from 'react';
import { motion } from 'framer-motion';
import type { ParkingLot } from '../types';
import { ClockIcon, CurrencyDollarIcon, MapPinIcon } from './Icons';

interface ParkingListItemProps {
  lot: ParkingLot;
  onSelectLot: (lot: ParkingLot) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const AvailabilityIndicator: React.FC<{ availability: number }> = ({ availability }) => {
    const getAvailabilityInfo = () => {
        if (availability > 60) {
            return { color: 'bg-green-500', text: 'High', textColor: 'text-green-800', bgColor: 'bg-green-100' };
        }
        if (availability > 20) {
            return { color: 'bg-yellow-500', text: 'Medium', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100' };
        }
        return { color: 'bg-red-500', text: 'Low', textColor: 'text-red-800', bgColor: 'bg-red-100' };
    };

    const { color, text, textColor, bgColor } = getAvailabilityInfo();

    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="font-semibold">{availability}%</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${textColor} ${bgColor}`}>{text}</span>
        </div>
    );
};

export const ParkingListItem: React.FC<ParkingListItemProps> = ({ lot, onSelectLot, isHovered, onHover }) => {
  return (
    <motion.div 
        variants={itemVariants}
        className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${isHovered ? 'ring-2 ring-brand-blue' : 'ring-0 ring-transparent'}`}
        onMouseEnter={() => onHover(lot.id)}
        onMouseLeave={() => onHover(null)}
        layout
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
          <h3 className="text-lg font-bold text-brand-dark mb-2 sm:mb-0">{lot.name}</h3>
          <AvailabilityIndicator availability={lot.availability} />
        </div>
        <div className="text-slate-600 space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-slate-400" />
            <span>{lot.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-slate-400" />
            <span>{lot.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-lg text-green-600">${lot.pricePerHour.toFixed(2)} / hour</span>
          </div>
        </div>
        <button
          onClick={() => onSelectLot(lot)}
          className="w-full sm:w-auto bg-brand-accent text-brand-dark font-bold py-2 px-5 rounded-lg hover:brightness-105 transition duration-200"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
};
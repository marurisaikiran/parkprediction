import React from 'react';
import { motion } from 'framer-motion';
import type { ParkingLot } from '../types';
import { ParkingListItem } from './ParkingListItem';

interface ParkingListProps {
  lots: ParkingLot[];
  onSelectLot: (lot: ParkingLot) => void;
  hoveredLotId: string | null;
  onListItemHover: (id: string | null) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const ParkingList: React.FC<ParkingListProps> = ({ lots, onSelectLot, hoveredLotId, onListItemHover }) => {
  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl font-bold text-slate-700 px-2">Available Spots Nearby</h2>
      {lots.map((lot) => (
        <ParkingListItem 
            key={lot.id} 
            lot={lot} 
            onSelectLot={onSelectLot} 
            isHovered={hoveredLotId === lot.id}
            onHover={onListItemHover}
        />
      ))}
    </motion.div>
  );
};
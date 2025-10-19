import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ParkingLot } from '../types';
import { Spinner } from './Spinner';

interface BookingModalProps {
  lot: ParkingLot;
  onClose: () => void;
  onConfirm: (hours: number, totalPrice: number) => void;
  isLoading: boolean;
}

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 50 },
    // FIX: Added 'as const' to the transition 'type' property to satisfy framer-motion's strict type requirements.
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2 } },
};

export const BookingModal: React.FC<BookingModalProps> = ({ lot, onClose, onConfirm, isLoading }) => {
  const [hours, setHours] = useState(1);
  const totalPrice = (lot.pricePerHour * hours).toFixed(2);

  const handleConfirm = () => {
    onConfirm(hours, parseFloat(totalPrice));
  };

  return (
    <motion.div 
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" 
        onClick={onClose}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
    >
      <motion.div 
        className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md relative" 
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition" aria-label="Close modal">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl font-bold text-brand-dark mb-2">Confirm Your Booking</h2>
        <p className="text-slate-600 mb-6">You're booking a spot at <span className="font-semibold">{lot.name}</span>.</p>

        <div className="space-y-4 text-slate-700 mb-6">
            <div className="flex justify-between items-center">
                <span className="font-medium">Location:</span>
                <span className="text-right">{lot.address}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="font-medium">Hourly Rate:</span>
                <span>${lot.pricePerHour.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
                <label htmlFor="booking-hours" className="font-medium">Duration:</label>
                <select 
                    id="booking-hours"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="border border-slate-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    disabled={isLoading}
                >
                    {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>{i+1} hour{i > 0 ? 's' : ''}</option>)}
                </select>
            </div>
            <hr className="my-2"/>
            <div className="flex justify-between items-center text-xl font-bold text-brand-dark">
                <span>Total Price:</span>
                <span>${totalPrice}</span>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onClose} 
            className="w-full bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg hover:bg-slate-300 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="w-full bg-brand-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? <Spinner small /> : 'Pay & Confirm'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
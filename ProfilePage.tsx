
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, ClockIcon, CogIcon, CurrencyDollarIcon, UserIcon } from './components/Icons';
// FIX: Import the shared 'Page' type for consistent navigation handling.
import type { Booking, Page } from './types';

interface ProfilePageProps {
  bookings: Booking[];
  // FIX: Use the shared 'Page' type for the onNavigate prop.
  onNavigate: (page: Page) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ bookings, onNavigate }) => {
  const settingsItems = [
    { label: "Personal Information", action: () => onNavigate('settings') },
    { label: "Payment Methods", action: () => onNavigate('settings') },
    { label: "Password & Security", action: () => onNavigate('settings') },
  ];

  return (
    <div className="bg-slate-100 min-h-screen">
      <div 
        className="bg-cover bg-center h-48"
        style={{backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.5)), url(https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop)'}}
      ></div>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 -mt-24">
        {/* User Card */}
        <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8 flex items-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <div className="bg-slate-200 rounded-full p-4">
            <UserIcon className="w-12 h-12 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">John Doe</h1>
            <p className="text-slate-500">john.doe@example.com</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking History */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-slate-700 mb-4">Booking History</h2>
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
              <AnimatePresence>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
                      className="border-b border-slate-200 last:border-b-0 pb-4 last:pb-0"
                    >
                      <h3 className="font-bold text-brand-dark">{booking.lotName}</h3>
                      <div className="flex flex-wrap items-center text-sm text-slate-500 mt-1 gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4" /> {booking.date}</span>
                          <span>Duration: {booking.duration}</span>
                          <span className="flex items-center gap-1.5 font-semibold text-green-600"><CurrencyDollarIcon className="w-4 h-4" /> ${booking.cost.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8">No recent bookings.</p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-slate-700 mb-4">Settings</h2>
            <div className="bg-white rounded-xl shadow-lg p-2">
              <ul className="divide-y divide-slate-200">
                {settingsItems.map((item) => (
                  <li key={item.label}>
                    <button onClick={item.action} className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50 transition rounded-lg">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

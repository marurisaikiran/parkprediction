import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
// FIX: Import the shared 'Page' type to ensure type consistency.
import type { ParkingLot, Booking, Page } from './types';

// Mock initial booking data
const initialBookings: Booking[] = [
  { id: 1, lotName: 'Downtown Metro Garage', date: '2024-07-28', duration: '2 hours', cost: 15.00 },
  { id: 2, lotName: 'City Center Parking', date: '2024-07-25', duration: '3 hours', cost: 22.50 },
];

// FIX: Removed local 'Page' type definition. It's now imported from types.ts.

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 50 },
};

const pageTransition = {
  // FIX: Added 'as const' to help TypeScript infer the correct literal types for framer-motion's Transition properties, resolving a type error.
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.5,
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const handleSignIn = useCallback(() => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsAuthLoading(false);
    }, 1500); // Simulate network request
  }, []);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('home'); // Redirect to home on sign out
  }, []);
  
  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleAddBooking = useCallback((lot: ParkingLot, duration: number, cost: number) => {
    const newBooking: Booking = {
      id: Date.now(),
      lotName: lot.name,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      duration: `${duration} hour${duration > 1 ? 's' : ''}`,
      cost: cost,
    };
    setBookings(prevBookings => [newBooking, ...prevBookings]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header 
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {currentPage === 'home' && <HomePage onAddBooking={handleAddBooking} onNavigate={handleNavigate} />}
            {currentPage === 'profile' && <ProfilePage bookings={bookings} onNavigate={handleNavigate} />}
            {currentPage === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
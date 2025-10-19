
import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchBar } from './components/SearchBar';
import { ParkingMap } from './components/ParkingMap';
import { ParkingList } from './components/ParkingList';
import { InfoCard } from './components/InfoCard';
import { BookingModal } from './components/BookingModal';
import { ParkingListItemSkeleton } from './components/ParkingListItemSkeleton';
import { fetchParkingPredictions } from './services/geminiService';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { ExclamationCircleIcon, SearchIcon, MapPinIcon } from './components/Icons';
// FIX: Import the shared 'Page' type for consistent navigation handling.
import type { ParkingLot, Page } from './types';

const API_KEY = process.env.API_KEY || '';

interface HomePageProps {
  onAddBooking: (lot: ParkingLot, duration: number, cost: number) => void;
  // FIX: Use the shared 'Page' type for the onNavigate prop.
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddBooking, onNavigate }) => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [hoveredLotId, setHoveredLotId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { isMapLoaded, mapError } = useGoogleMaps(API_KEY);

  const handleSearch = useCallback(async (query: string | GeolocationPosition['coords']) => {
    setIsLoading(true);
    setError(null);
    setParkingLots([]);
    setBookingSuccess(false);
    try {
      const data = await fetchParkingPredictions(query);
      if (Array.isArray(data)) {
        setParkingLots(data);
      } else {
        throw new Error("Received invalid data from the AI service.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBookingConfirm = useCallback((hours: number, totalPrice: number) => {
    if (!selectedLot) return;
    
    setIsBooking(true);
    setTimeout(() => {
      onAddBooking(selectedLot, hours, totalPrice);
      setIsBooking(false);
      setSelectedLot(null);
      setBookingSuccess(true); // Keep success state for a moment before navigation
      setTimeout(() => onNavigate('profile'), 500); // Navigate to profile to see the new booking
    }, 2000); // Simulate payment processing
  }, [selectedLot, onAddBooking, onNavigate]);
  
  const panToLot = useMemo(() => {
    if (!hoveredLotId) return null;
    return parkingLots.find(lot => lot.id === hoveredLotId) || null;
  }, [hoveredLotId, parkingLots]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-700 px-2 animate-pulse">Searching for Spots...</h2>
          {[...Array(3)].map((_, i) => <ParkingListItemSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return <InfoCard icon={<ExclamationCircleIcon className="w-10 h-10" />} title="Search Error" message={error} />;
    }
     if (bookingSuccess) {
      return <InfoCard icon={<div className="text-3xl">✅</div>} title="Booking Confirmed!" message="Redirecting to your profile to view your booking..." />;
    }
    if (parkingLots.length > 0) {
      return <ParkingList lots={parkingLots} onSelectLot={setSelectedLot} hoveredLotId={hoveredLotId} onListItemHover={setHoveredLotId}/>;
    }
    return <InfoCard icon={<MapPinIcon className="w-10 h-10" />} title="Welcome to ParkPredict" message="Find and book the best parking spots in seconds. Enter a location above to start your search." />;
  };

  return (
    <>
      <section 
        className="relative py-16 md:py-24 bg-cover bg-center text-white" 
        style={{backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.6)), url(https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop)'}}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Smarter Parking, Simpler Journeys
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-slate-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Instantly find and book available parking spots with real-time predictions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:order-2 h-[400px] lg:h-auto rounded-xl shadow-lg overflow-hidden">
            {isMapLoaded ? (
              <ParkingMap 
                lots={parkingLots} 
                hoveredLotId={hoveredLotId}
                onMarkerClick={setSelectedLot}
                onMarkerHover={setHoveredLotId}
                panToLot={panToLot}
              />
            ) : (
              <div className="w-full h-full bg-slate-700 flex flex-col justify-center items-center text-white">
                {mapError ? (
                  <div className="text-center p-4">
                    <ExclamationCircleIcon className="w-12 h-12 mx-auto text-red-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Map Error</h3>
                    <p className="text-sm text-slate-300">{mapError}</p>
                  </div>
                ) : (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-brand-blue mb-4"></div>
                    <p>Loading Map...</p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="lg:order-1">{renderContent()}</div>
        </div>
      </div>
      
      <AnimatePresence>
        {selectedLot && (
          <BookingModal 
            lot={selectedLot} 
            onClose={() => setSelectedLot(null)}
            onConfirm={handleBookingConfirm}
            isLoading={isBooking}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;
import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ParkingList } from './components/ParkingList';
import { BookingModal } from './components/BookingModal';
import { InfoCard } from './components/InfoCard';
import { ExclamationCircleIcon, MapPinIcon } from './components/Icons';
import { ParkingMap } from './components/ParkingMap';
import type { ParkingLot } from './types';
import { fetchParkingPredictions } from './services/geminiService';
import { useGeolocation } from './hooks/useGeolocation';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { ParkingListItemSkeleton } from './components/ParkingListItemSkeleton';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [hoveredLotId, setHoveredLotId] = useState<string | null>(null);
  const [panToLot, setPanToLot] = useState<ParkingLot | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { isLocating, locateError, getUserLocation } = useGeolocation();
  const { isMapLoaded, mapError } = useGoogleMaps(process.env.API_KEY || '');

  useEffect(() => {
    if (hoveredLotId) {
      const lot = parkingLots.find(p => p.id === hoveredLotId);
      setPanToLot(lot || null);
    } else {
      setPanToLot(null);
    }
  }, [hoveredLotId, parkingLots]);

  const handleSearch = useCallback(async (location: string | GeolocationCoordinates) => {
    if (!location) {
      setError("Please enter a location.");
      return;
    }
    setIsSearching(true);
    setError(null);
    setParkingLots([]);
    setBookingConfirmed(false);

    try {
      const lots = await fetchParkingPredictions(location);
      setParkingLots(lots);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch parking predictions. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleGeolocate = useCallback(async () => {
    getUserLocation(async (position) => {
      await handleSearch(position.coords);
    });
  }, [getUserLocation, handleSearch]);

  const handleSelectLot = (lot: ParkingLot) => {
    setSelectedLot(lot);
    setBookingConfirmed(false);
  };

  const handleCloseModal = () => {
    setSelectedLot(null);
  };

  const handleConfirmBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setSelectedLot(null);
      setBookingConfirmed(true);
      setParkingLots([]);
    }, 1500);
  };

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(20, 25, 40, 0.7), rgba(20, 25, 40, 0.7)), url('https://images.unsplash.com/photo-1544336449-db35b6b479a7?q=80&w=2500&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const renderContent = () => {
    if (isSearching) {
      return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:order-2 h-[400px] lg:h-auto min-h-[300px] rounded-xl overflow-hidden shadow-lg bg-slate-200 flex items-center justify-center">
              <p className="text-slate-500 font-medium">Finding parking spots...</p>
            </div>
            <div className="lg:order-1 space-y-4">
               <h2 className="text-xl font-bold text-slate-700 px-2">Available Spots Nearby</h2>
              {[...Array(5)].map((_, i) => <ParkingListItemSkeleton key={i} />)}
            </div>
          </div>
      );
    }
    
    if (error) {
      return <InfoCard
            icon={<ExclamationCircleIcon className="w-8 h-8"/>}
            title="An Error Occurred"
            message={error}
          />
    }

    if (bookingConfirmed) {
      return (
        <InfoCard
          icon={<div className="text-3xl">🎉</div>}
          title="Booking Confirmed!"
          message="Your parking spot is reserved. Check your email for details. Search above to find a new spot."
        />
      );
    }
    
    if (parkingLots.length > 0) {
      return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:order-2 h-[400px] lg:h-auto min-h-[300px] rounded-xl overflow-hidden shadow-lg">
              {isMapLoaded ? (
                <ParkingMap 
                  lots={parkingLots} 
                  hoveredLotId={hoveredLotId} 
                  onMarkerClick={handleSelectLot} 
                  onMarkerHover={setHoveredLotId}
                  panToLot={panToLot}
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    {mapError ? (
                        <div className="w-full h-full bg-red-50 border-2 border-dashed border-red-200 flex flex-col items-center justify-center p-4 text-center">
                            <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-2" />
                            <h3 className="font-semibold text-red-700">Map Unavailable</h3>
                            <p className="text-sm text-red-600 max-w-sm">{mapError}</p>
                        </div>
                    ) : <Spinner />}
                </div>
              )}
            </div>
            <div className="lg:order-1">
              <ParkingList lots={parkingLots} onSelectLot={handleSelectLot} hoveredLotId={hoveredLotId} onListItemHover={setHoveredLotId} />
            </div>
          </div>
      );
    }

    return (
        <InfoCard
          icon={<MapPinIcon />}
          title="Welcome to ParkPredict"
          message="Find and pre-book parking slots with ease. Start by searching for a location or using your current position."
        />
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-brand-dark font-sans">
      <Header isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} onLogout={() => setIsLoggedIn(false)} />
      
      <section className="relative text-white py-16 md:py-24" style={heroStyle}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">The Smartest Way to Park</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Instantly find and book the best parking spots. No more circling the block.</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
              <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocate} isLoading={isSearching || isLocating} />
            </div>
             {locateError && <p className="text-red-400 mt-4 bg-red-900/50 px-4 py-2 rounded-md inline-block">{locateError}</p>}
        </div>
      </section>

      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        {renderContent()}
      </main>

      <AnimatePresence>
        {selectedLot && (
          <BookingModal
            lot={selectedLot}
            onClose={handleCloseModal}
            onConfirm={handleConfirmBooking}
            isLoading={isBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
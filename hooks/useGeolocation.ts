
import { useState, useCallback } from 'react';

type GeolocationSuccessCallback = (position: GeolocationPosition) => void;

export const useGeolocation = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const getUserLocation = useCallback((onSuccess: GeolocationSuccessCallback) => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSuccess(position);
        setIsLocating(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocateError('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocateError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocateError('The request to get user location timed out.');
            break;
          default:
            setLocateError('An unknown error occurred.');
            break;
        }
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { isLocating, locateError, getUserLocation };
};

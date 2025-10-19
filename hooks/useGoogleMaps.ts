import { useState, useEffect, useRef } from 'react';

const SCRIPT_ID = 'google-maps-script';

declare global {
  interface Window { 
    gm_authFailure?: () => void;
  }
}

enum ScriptStatus {
  IDLE,
  LOADING,
  READY,
  ERROR,
}

export const useGoogleMaps = (apiKey: string) => {
  const [status, setStatus] = useState<ScriptStatus>(ScriptStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to hold the current status to avoid stale closures in callbacks.
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    // If the Google Maps API is already available, we're done.
    if ((window as any).google && (window as any).google.maps) {
      if (status !== ScriptStatus.READY) setStatus(ScriptStatus.READY);
      return;
    }
    
    // If the script is already loading or has failed, don't try again.
    if (status === ScriptStatus.LOADING || status === ScriptStatus.ERROR) {
        return;
    }

    // Handle missing API key explicitly.
    if (!apiKey) {
      const errorMessage = "Google Maps API key is missing. The map cannot be loaded.";
      setError(errorMessage);
      setStatus(ScriptStatus.ERROR);
      console.error(errorMessage);
      return;
    }

    // This callback is specific to the Google Maps JS API. It's called when authentication fails.
    // We define it on the window object so the Maps script can find it.
    window.gm_authFailure = () => {
      const errorMessage = "Google Maps API Error: The provided API key is invalid or not authorized for this domain. The map cannot be loaded.";
      setError(errorMessage);
      setStatus(ScriptStatus.ERROR);
      console.error(errorMessage);
    };

    // If a previous attempt to load the script failed, it might still be in the DOM.
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
        existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
    script.async = true;
    script.defer = true;
    
    const handleLoad = () => {
      setStatus(ScriptStatus.READY);
    };

    const handleError = () => {
      // If gm_authFailure was not called, it's a different kind of error (e.g., network).
      // Use a ref to get the current status to avoid a stale closure. This prevents overwriting a more specific error from gm_authFailure.
      if (statusRef.current !== ScriptStatus.ERROR) {
        const errorMessage = "Failed to load the Google Maps script. Please check the network connection.";
        setError(errorMessage);
        setStatus(ScriptStatus.ERROR);
        console.error(errorMessage);
      }
      script.remove(); // Clean up the failed script tag
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    setStatus(ScriptStatus.LOADING);
    document.body.appendChild(script);

    // Cleanup function when the component unmounts
    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      if (window.gm_authFailure) {
        delete window.gm_authFailure;
      }
    };
  }, [apiKey, status]);

  return {
    isMapLoaded: status === ScriptStatus.READY,
    mapError: error,
  };
};
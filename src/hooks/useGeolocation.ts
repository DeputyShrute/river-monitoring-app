import { useState, useEffect } from 'react';
import { LocationData } from '@/lib/types';

interface UseGeolocationResult {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        });
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000 // 5 minutes
      }
    );
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  // Check if location is stale (older than 30 minutes)
  useEffect(() => {
    if (location && Date.now() - location.timestamp > 30 * 60 * 1000) {
      setLocation(null);
    }
  }, [location]);

  return {
    location,
    loading,
    error,
    requestLocation,
    clearLocation
  };
}
import { useState, useCallback, useEffect } from 'react';
import { locationService } from '../services/location';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const watchLocation = useCallback(() => {
    return locationService.watchLocation((newLocation) => {
      setLocation(newLocation);
    });
  }, []);

  return { location, error, isLoading, getLocation, watchLocation };
};

export default useGeolocation;

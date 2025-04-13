import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api'; // Make sure this handles baseURL setup

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Send current location to the backend
  const sendLocation = useCallback(async (vehicleId, lat, lng) => {
    console.log("vechile details",vehicleId,lat,lng);
    setLoading(true);
    try {
      const response = await api.post('/location', { vehicleId, lat, lng });
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending location');
      console.error('Error sending location:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get location for a specific vehicle
  const fetchLocation = useCallback(async (vehicleId) => {
    setLoading(true);
    try {
      const response = await api.get(`/location/${vehicleId}`);
      setLocationData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching location');
      console.error('Error fetching location:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    locationData,
    loading,
    error,
    sendLocation,
    fetchLocation,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

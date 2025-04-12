// src/context/APIContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    currentCoins: 0,
    todayEarnings: 0,
    totalEarnings: 0
  });
  const [coinPackages, setCoinPackages] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [earningsHistory, setEarningsHistory] = useState([]);

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/stats');
      setUserStats(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching user stats');
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/packages');
      setCoinPackages(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch payment history
  const fetchPaymentHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/payment/history');
      setPaymentHistory(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching payment history');
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch earnings history
  const fetchEarningsHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/earnings');
      setEarningsHistory(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching earnings history');
      console.error('Error fetching earnings history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update coin count
  const updateCoins = useCallback(async (coinCount) => {
    setLoading(true);
    try {
      const response = await api.post('/coins/update', { coins: coinCount,user:{id:1} });
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating coins');
      console.error('Error updating coins:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Process day end (convert coins to rupees)
  const processDayEnd = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post('/coins/process-day-end');
      await fetchUserStats(); // Refresh stats after processing
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing day end');
      console.error('Error processing day end:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchUserStats]);

  // Create Razorpay order
  const createPaymentOrder = useCallback(async (packageId, amount) => {
    setLoading(true);
    try {
      const response = await api.post('/payment/create-order', { packageId, amount });
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating payment order');
      console.error('Error creating payment order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify payment
  const verifyPayment = useCallback(async (paymentData) => {
    setLoading(true);
    try {
      const response = await api.post('/payment/verify', paymentData);
      await fetchUserStats(); // Refresh stats after payment
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying payment');
      console.error('Error verifying payment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchUserStats]);

  // Generate random coins (for frontend only)
  const generateRandomCoins = useCallback((currentCoins) => {
    const randomAmount = Math.floor(Math.random() * 10) + 1;
    return currentCoins + randomAmount;
  }, []);

  const value = {
    loading,
    error,
    userStats,
    coinPackages,
    paymentHistory,
    earningsHistory,
    fetchUserStats,
    fetchPackages,
    fetchPaymentHistory,
    fetchEarningsHistory,
    updateCoins,
    processDayEnd,
    createPaymentOrder,
    verifyPayment,
    generateRandomCoins
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

export const useAPIContext = () => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPIContext must be used within an APIProvider');
  }
  return context;
};
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAPIContext } from '../context/APIContext';
import Navbar from './Navbar';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { 
    loading, 
    userStats, 
    fetchUserStats, 
    updateCoins, 
    generateRandomCoins 
  } = useAPIContext();
  
  const [coinCount, setCoinCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchUserStats();
    // Set up interval for DB updates
    const updateInterval = setInterval(() => {
      if (coinCount > 0) {
        updateCoinsInDatabase();
      }
    }, 60000); // Update every minute

    return () => clearInterval(updateInterval);
  }, [fetchUserStats]);

  useEffect(() => {
    // Update local coin count when user stats change
    if (userStats && userStats.currentCoins !== undefined) {
      setCoinCount(userStats.currentCoins);
    }
  }, [userStats]);

  // Function to generate random number on button click
  const handleGenerateCoins = () => {
    const newCoinCount = generateRandomCoins(coinCount);
    setCoinCount(newCoinCount);
    setLastUpdated(new Date());
  };

  // Function to update coins in database
  const updateCoinsInDatabase = async () => {
    await updateCoins(coinCount);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <h1>Welcome, {currentUser.name}!</h1>
        
        <div className="stats-container">
          <div className="stat-box">
            <h3>Current Coins</h3>
            <p className="stat-value">{coinCount}</p>
          </div>
          <div className="stat-box">
            <h3>Today's Earnings (₹)</h3>
            <p className="stat-value">₹{userStats.todayEarnings || 0}</p>
          </div>
          <div className="stat-box">
            <h3>Total Earnings</h3>
            <p className="stat-value">₹{userStats.totalEarnings || 0}</p>
          </div>
        </div>

        <div className="coin-generator">
          <h2>Generate Coins</h2>
          <div className='d-flex justify-content-evenly'>
          
          {lastUpdated && (
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button className="generate-btn" onClick={handleGenerateCoins}>
            Click to Generate Coins
          </button>
          <button 
            className="update-btn" 
            onClick={updateCoinsInDatabase}
          >
            Save Coins to Database
          </button>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/purchase" className="action-btn">
            Purchase Coins
          </Link>
          <Link to="/profile" className="action-btn">
            View Earnings History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

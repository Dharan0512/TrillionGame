// src/components/Profile.js
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { useAPIContext } from '../context/APIContext';
import { format } from 'date-fns';

const Profile = () => {
  const {
    loading,
    userStats,
    earningsHistory,
    paymentHistory,
    fetchUserStats,
    fetchEarningsHistory,
    fetchPaymentHistory
  } = useAPIContext();

  useEffect(() => {
    fetchUserStats();
    fetchEarningsHistory();
    fetchPaymentHistory();
  }, [fetchUserStats, fetchEarningsHistory, fetchPaymentHistory]);

  if (loading) {
    return <div className="loading">Loading profile data...</div>;
  }

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-content">
        <h1>Your Profile</h1>
        
        <div className="stats-overview">
          <div className="stat-item">
            <h3>Current Coins</h3>
            <p>{userStats.currentCoins || 0}</p>
          </div>
          <div className="stat-item">
            <h3>Total Earnings</h3>
            <p>₹{userStats.totalEarnings || 0}</p>
          </div>
        </div>
        
        <div className="history-section">
          <h2>Earnings History</h2>
          {earningsHistory.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Coins Generated</th>
                  <th>Rupees Earned</th>
                </tr>
              </thead>
              <tbody>
                {earningsHistory.map(record => (
                  <tr key={record.id}>
                    <td>{format(new Date(record.date), 'dd/MM/yyyy')}</td>
                    <td>{record.coinsGenerated}</td>
                    <td>₹{record.rupeesEarned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No earnings history yet.</p>
          )}
        </div>
        
        <div className="history-section">
          <h2>Purchase History</h2>
          {paymentHistory.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Package</th>
                  <th>Coins</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(payment => (
                  <tr key={payment.id}>
                    <td>{format(new Date(payment.createdAt), 'dd/MM/yyyy')}</td>
                    <td>{payment.Package?.name || 'N/A'}</td>
                    <td>{payment.coinsPurchased}</td>
                    <td>₹{payment.amount}</td>
                    <td>
                      <span className={`status-badge status-${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No purchase history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
// src/components/Profile.js
import React, { useEffect,useState } from 'react';
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
          <EarningsTable earningsHistory={earningsHistory}/>
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

const EarningsTable = ({ earningsHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(earningsHistory.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = earningsHistory.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <>
      {earningsHistory.length > 0 ? (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Coins Generated</th>
                <th>Rupees Earned</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(record => (
                <tr key={record.id}>
                  <td>{format(new Date(record.date), 'dd/MM/yyyy')}</td>
                  <td>{record.coinsGenerated}</td>
                  <td>₹{record.rupeesEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls d-flex justify-content-center" style={{ marginTop: '10px' }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: '10px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No earnings history yet.</p>
      )}
    </>
  );
};



export default Profile;
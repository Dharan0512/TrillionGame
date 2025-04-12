import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { useAPIContext } from '../context/APIContext';

const CoinPurchase = () => {
  const { 
    loading, 
    coinPackages, 
    fetchPackages, 
    createPaymentOrder, 
    verifyPayment 
  } = useAPIContext();

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const initializeRazorpay = (orderId, amount, packageId) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'CoinGen App',
      description: `Purchase coins package`,
      order_id: orderId,
      handler: async function (response) {
        try {
          // Verify payment on the server
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            package_id: packageId
          });
          
          alert('Payment successful! Coins added to your account.');
          // Refresh the page after successful payment
          window.location.href = '/dashboard';
        } catch (err) {
          console.error('Payment verification failed:', err);
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePurchase = async (packageId, amount) => {
    try {
      // Create order on the server
      const orderData = await createPaymentOrder(packageId, amount);
      if (orderData && orderData.orderId) {
        // Initialize Razorpay with the order ID
        initializeRazorpay(orderData.orderId, amount, packageId);
      }
    } catch (err) {
      console.error('Failed to create order:', err);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading packages...</div>;
  }

  return (
    <div className="coin-purchase">
      <Navbar />
      <div className="purchase-content">
        <h1>Purchase Coins</h1>
        
        <div className="packages-container">
          {coinPackages.map(pkg => (
            <div key={pkg.id} className="package-card">
              <h3>{pkg.name}</h3>
              <p className="coin-amount">{pkg.coins} Coins</p>
              <p className="price">₹{pkg.price}</p>
              <button 
                className="buy-button"
                onClick={() => handlePurchase(pkg.id, pkg.price)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinPurchase;
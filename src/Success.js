// Success.js
import React, { useEffect, useState, useRef } from 'react';

const Success = () => {
  const [paymentStatus, setPaymentStatus] = useState('Fetching payment status...');
  const POLLING_INTERVAL = 2000; // Poll every 2 seconds
  const intervalId = useRef(null); // Create a ref to store the interval ID

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch('http://localhost:5002/payment-status');
        const data = await response.json();
        setPaymentStatus(data);
      } catch (error) {
        setPaymentStatus('Error fetching payment status');
      }
    };

    // Initial fetch
    const clearAndFetch = async () => {
        await setPaymentStatus('Fetching payment status...');
        await fetchPaymentStatus();
    }

    // Polling interval
    intervalId.current = setInterval(() => {
        fetchPaymentStatus();
      }, POLLING_INTERVAL);
  
      // Cleanup interval on component unmount
    return () => clearInterval(intervalId.current);
  }, []);

  useEffect(() => {
    if (paymentStatus === 'payment_captured') {
        clearInterval(intervalId.current); // Clear the interval
    }
  }, [paymentStatus]);


  return (
    <div>
      <h1>Payment Result</h1>
      <p>Payment Status: {paymentStatus}</p>
    </div>
  );
};

export default Success;

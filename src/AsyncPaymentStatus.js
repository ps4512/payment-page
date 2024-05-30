import React, { useEffect, useState, useRef } from 'react';

const AsyncPaymentStatus = () => {
  const [paymentStatus, setPaymentStatus] = useState('Fetching payment status...');
  const POLLING_INTERVAL = 3000; // Poll every 3 seconds
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

    intervalId.current = setInterval(() => {
        fetchPaymentStatus();
      }, POLLING_INTERVAL);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId.current);
  }, []);

  useEffect(() => {
    if (paymentStatus === 'payment_captured' || paymentStatus === 'payment_declined') {
        clearInterval(intervalId.current); // Clear the interval
    }
  }, [paymentStatus]);


  return (
    <div>
      <h1>Payment Status: {paymentStatus}</h1>
    </div>
  );
};

export default AsyncPaymentStatus;